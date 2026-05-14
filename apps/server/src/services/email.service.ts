import { env } from "@team-call-of-code/env/server";

/**
 * Send email using Brevo HTTP API (works on Render)
 */
async function sendEmailViaBrevo(to: string, subject: string, html: string) {
    const apiKey = env.BREVO_API_KEY;
    const senderEmail = process.env.SMTP_EMAIL || "khushisharma4628@gmail.com";

    // Debugging (Safe: doesn't print the whole key)
    console.log(`[DEBUG] Brevo Key length: ${apiKey?.length || 0}`);
    console.log(`[DEBUG] Brevo Key starts with xkeysib: ${apiKey?.startsWith('xkeysib-')}`);
    if (apiKey === 'dummy') console.warn(`[WARNING] Brevo Key is still the 'dummy' value!`);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sender: { name: "GrievanceHub", email: senderEmail },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    });

    const result = (await response.json()) as any;

    if (!response.ok) {
        console.error("[EMAIL] Brevo error:", result);
        throw new Error(result.message || "Failed to send email");
    }

    return result;
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
    
    const html = `
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
    `;

    try {
        await sendEmailViaBrevo(email, "✅ Grievance Submitted Successfully - GrievanceHub", html);
        console.log(`[EMAIL] Grievance confirmation sent successfully to ${email}.`);
    } catch (error) {
        console.error(`[EMAIL] ERROR sending confirmation to ${email}:`, error);
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

    const html = `
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
                    <div style="font-size: 20px; text-align: center;">→</div>
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
    `;

    try {
        await sendEmailViaBrevo(email, `${emoji} Grievance Update: ${data.newStatus.replace("_", " ")} - GrievanceHub`, html);
        console.log(`[EMAIL] Status update (${data.newStatus}) sent to ${email}`);
    } catch (error) {
        console.error(`[EMAIL] ERROR sending status update to ${email}:`, error);
    }
}

