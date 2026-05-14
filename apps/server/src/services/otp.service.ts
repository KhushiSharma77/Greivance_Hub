import nodemailer from "nodemailer";
import { redis } from "../lib/redisconnection";
import { ValidationError } from "../lib/error-handler";

const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const OTP_PREFIX = "otp:";

/**
 * Generate a 6-digit OTP
 */
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create a nodemailer transporter
 * Uses Ethereal (free test email) if no SMTP credentials are configured.
 * Uses Gmail if real SMTP credentials are provided.
 */
let cachedTransporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
    if (cachedTransporter) return cachedTransporter;

    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    // If real Gmail credentials exist, use them
    if (smtpEmail && smtpPassword && !smtpEmail.includes("your_")) {
        cachedTransporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            family: 4,
            auth: {
                user: smtpEmail,
                pass: smtpPassword,
            },
        });
        console.log("[EMAIL] Using Gmail SMTP");
        return cachedTransporter;
    }

    // Otherwise, use Ethereal (free test email — no config needed!)
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    console.log("[EMAIL] Using Ethereal test email (no real emails sent)");
    console.log(`[EMAIL] Ethereal credentials: ${testAccount.user} / ${testAccount.pass}`);
    return cachedTransporter;
}

/**
 * Send OTP via email
 */
export async function sendEmailOTP(email: string): Promise<string | null> {
    const otp = generateOTP();

    // Store OTP in Redis with TTL (5 min expiry)
    await redis.set(`${OTP_PREFIX}${email}`, otp, "EX", OTP_EXPIRY_SECONDS);

    const transporter = await getTransporter();

    const info = await transporter.sendMail({
        from: `"GrievanceHub" <noreply@grievancehub.in>`,
        to: email,
        subject: "Your GrievanceHub Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                <h2 style="color: #1e293b; margin-bottom: 8px;">Verify your email</h2>
                <p style="color: #64748b; font-size: 14px;">Use the code below to complete your GrievanceHub registration:</p>
                <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3b82f6;">${otp}</span>
                </div>
                <p style="color: #94a3b8; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `,
    });

    // Log preview URL for Ethereal (viewable in browser!)
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
        console.log(`\n📧 [OTP EMAIL PREVIEW] View the email here:\n   ${previewUrl}\n`);
    }

    console.log(`[OTP] Code for ${email}: ${otp}`);

    return previewUrl ? String(previewUrl) : null;
}

/**
 * Verify OTP
 */
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
    const key = `${OTP_PREFIX}${email}`;
    const storedOTP = await redis.get(key);

    if (!storedOTP) {
        throw new ValidationError("OTP has expired or was never sent. Please request a new one.");
    }

    if (storedOTP !== otp) {
        throw new ValidationError("Invalid OTP. Please try again.");
    }

    // Delete OTP after successful verification
    await redis.del(key);
    return true;
}
