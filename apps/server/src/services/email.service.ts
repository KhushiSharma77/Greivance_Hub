import nodemailer from "nodemailer";

let cachedTransporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
    if (cachedTransporter) return cachedTransporter;

    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    console.log(`[EMAIL] Initializing transporter with: ${smtpEmail}`);

    if (smtpEmail && smtpPassword && !smtpEmail.includes("your_")) {
        cachedTransporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            family: 4,
            auth: { user: smtpEmail, pass: smtpPassword },
        });
        console.log(`[EMAIL] Gmail transporter created`);
        return cachedTransporter;
    }

    console.log(`[EMAIL] Falling back to Ethereal...`);
    // Fallback to Ethereal
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log(`[EMAIL] Ethereal transporter created: ${testAccount.user}`);
    return cachedTransporter;
}

/**
 * Send grievance submission confirmation email
 */
export async function sendGrievanceConfirmation(email: string, grievanceData: {
    id: string;
    originalText: string;
    category?: string;
}) {
    console.log(`[EMAIL] Attempting to send confirmation to: ${email}`);
    const transporter = await getTransporter();

    try {
        const info = await transporter.sendMail({
            from: `"GrievanceHub" <${process.env.SMTP_EMAIL || "noreply@grievancehub.in"}>`,
            to: email,
            subject: "✅ Grievance Submitted Successfully - GrievanceHub",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="display: inline-block; background: #22c55e; color: white; padding: 12px 20px; border-radius: 50%; font-size: 24px;">✓</div>
                    </div>
                    <h2 style="color: #1e293b; text-align: center; margin-bottom: 8px;">Grievance Submitted!</h2>
                    <p style="color: #64748b; text-align: center; font-size: 14px; margin-bottom: 24px;">
                        Your complaint has been registered and is being processed by our AI system.
                    </p>
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px;">Grievance ID</p>
                        <p style="color: #3b82f6; font-weight: bold; font-size: 14px; margin: 0 0 16px; font-family: monospace;">${grievanceData.id}</p>
                        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px;">Description</p>
                        <p style="color: #334155; font-size: 14px; margin: 0;">${grievanceData.originalText.substring(0, 200)}${grievanceData.originalText.length > 200 ? '...' : ''}</p>
                    </div>
                    <div style="background: #eff6ff; border-radius: 8px; padding: 16px; text-align: center;">
                        <p style="color: #3b82f6; font-size: 13px; margin: 0;">
                            🤖 Our AI is analyzing your complaint and routing it to the appropriate department. You'll receive updates via email.
                        </p>
                    </div>
                    <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 24px;">
                        © GrievanceHub - AI-Powered Civic Grievance Platform
                    </p>
                </div>
            `,
        });
        console.log(`[EMAIL] Grievance confirmation sent successfully to ${email}. MessageId: ${info.messageId}`);
    } catch (error) {
        console.error(`[EMAIL] ERROR sending confirmation to ${email}:`, error);
        throw error;
    }
}

/**
 * Send grievance status update email
 */
export async function sendStatusUpdateEmail(email: string, data: {
    grievanceId: string;
    originalText: string;
    oldStatus: string;
    newStatus: string;
    departmentName?: string;
}) {
    const transporter = await getTransporter();

    const statusColors: Record<string, string> = {
        PENDING: "#f59e0b",
        ANALYZED: "#3b82f6",
        IN_PROGRESS: "#8b5cf6",
        RESOLVED: "#22c55e",
        CLOSED: "#64748b",
    };

    const statusEmoji: Record<string, string> = {
        PENDING: "⏳",
        ANALYZED: "🔍",
        IN_PROGRESS: "🚧",
        RESOLVED: "✅",
        CLOSED: "📁",
    };

    const color = statusColors[data.newStatus] || "#64748b";
    const emoji = statusEmoji[data.newStatus] || "📋";

    await transporter.sendMail({
        from: `"GrievanceHub" <${process.env.SMTP_EMAIL || "noreply@grievancehub.in"}>`,
        to: email,
        subject: `${emoji} Grievance Update: ${data.newStatus.replace("_", " ")} - GrievanceHub`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                <h2 style="color: #1e293b; text-align: center; margin-bottom: 8px;">Grievance Status Updated</h2>
                <p style="color: #64748b; text-align: center; font-size: 14px; margin-bottom: 24px;">
                    There's an update on your complaint.
                </p>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px;">Grievance ID</p>
                    <p style="color: #3b82f6; font-weight: bold; font-size: 14px; margin: 0 0 16px; font-family: monospace;">${data.grievanceId}</p>
                    
                    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px;">Description</p>
                    <p style="color: #334155; font-size: 14px; margin: 0 0 16px;">${data.originalText.substring(0, 150)}${data.originalText.length > 150 ? '...' : ''}</p>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-top: 16px;">
                        <div style="flex: 1; text-align: center; padding: 12px; background: #f1f5f9; border-radius: 8px;">
                            <p style="color: #94a3b8; font-size: 11px; margin: 0 0 4px;">Previous</p>
                            <p style="color: #64748b; font-weight: bold; font-size: 13px; margin: 0;">${data.oldStatus.replace("_", " ")}</p>
                        </div>
                        <div style="font-size: 20px;">→</div>
                        <div style="flex: 1; text-align: center; padding: 12px; background: ${color}15; border: 2px solid ${color}; border-radius: 8px;">
                            <p style="color: #94a3b8; font-size: 11px; margin: 0 0 4px;">Current</p>
                            <p style="color: ${color}; font-weight: bold; font-size: 13px; margin: 0;">${emoji} ${data.newStatus.replace("_", " ")}</p>
                        </div>
                    </div>

                    ${data.departmentName ? `
                    <div style="margin-top: 16px; padding: 12px; background: #f0fdf4; border-radius: 8px;">
                        <p style="color: #15803d; font-size: 13px; margin: 0;">
                            🏛️ Assigned to: <strong>${data.departmentName}</strong>
                        </p>
                    </div>` : ''}
                </div>
                <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 24px;">
                    © GrievanceHub - AI-Powered Civic Grievance Platform
                </p>
            </div>
        `,
    });

    console.log(`[EMAIL] Status update (${data.newStatus}) sent to ${email}`);
}
