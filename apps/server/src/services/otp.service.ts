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
 * Send email using Resend HTTP API (works on Render, unlike SMTP)
 */
async function sendEmailViaResend(to: string, subject: string, html: string) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("[EMAIL] RESEND_API_KEY is not set!");
        throw new Error("Email service not configured. Set RESEND_API_KEY.");
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "GrievanceHub <onboarding@resend.dev>",
            to: [to],
            subject,
            html,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("[EMAIL] Resend error:", result);
        throw new Error(result.message || "Failed to send email");
    }

    console.log(`[EMAIL] Sent successfully to ${to}, id: ${result.id}`);
    return result;
}

/**
 * Send OTP via email
 */
export async function sendEmailOTP(email: string): Promise<string | null> {
    const otp = generateOTP();

    // Store OTP in Redis with TTL (5 min expiry)
    await redis.set(`${OTP_PREFIX}${email}`, otp, "EX", OTP_EXPIRY_SECONDS);

    await sendEmailViaResend(
        email,
        "Your GrievanceHub Verification Code",
        `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                <h2 style="color: #1e293b; margin-bottom: 8px;">Verify your email</h2>
                <p style="color: #64748b; font-size: 14px;">Use the code below to complete your GrievanceHub registration:</p>
                <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3b82f6;">${otp}</span>
                </div>
                <p style="color: #94a3b8; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `
    );

    console.log(`[OTP] Code for ${email}: ${otp}`);
    return null;
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
