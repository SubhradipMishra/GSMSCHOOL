import axios from 'axios';

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        if (!process.env.BREVO_EMAIL || !process.env.BREVO_API_KEY) {
            throw new Error('Brevo API credentials are missing in .env file');
        }

        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'GSM Academy',
                    email: process.env.BREVO_EMAIL,
                },
                to: [{ email: to }],
                subject,
                textContent: text,
                htmlContent: html || text,
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error('Error sending email via Brevo API:', error.response?.data || error.message);
        throw error;
    }
};

export const sendOTPEmail = async (to: string, otp: string) => {
    const subject = `${otp} is your GSM Academy verification code`;
    const text = `Your OTP for GSM Academy is: ${otp}. It will expire in 10 minutes.`;
    const html = `
        <div style="background-color: #1a3a2a; padding: 40px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #c9a84c;">
                <div style="background: #c9a84c; padding: 40px 20px; text-align: center;">
                    <h1 style="color: #1a3a2a; margin: 0; font-size: 28px; font-weight: 800;">GSM Academy</h1>
                </div>
                <div style="padding: 40px; text-align: center;">
                    <h2 style="color: #1a3a2a; font-size: 24px; font-weight: 800; margin-bottom: 10px;">Verify Your Identity</h2>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 30px;">
                        Please use the following one-time password to securely verify your identity.
                    </p>
                    <div style="background: #f1f5f9; padding: 30px; border-radius: 20px; display: inline-block; border: 2px solid #e2e8f0;">
                        <span style="display: block; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Your Code</span>
                        <div style="font-size: 48px; font-weight: 900; color: #1a3a2a; letter-spacing: 8px; margin: 0;">${otp}</div>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 25px;">
                        This code is active for 10 minutes.
                    </p>
                </div>
            </div>
        </div>
        </div>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendTeacherCredentialsEmail = async (to: string, data: any) => {
    const subject = `Welcome to GSM Academy - Teacher Portal Credentials`;
    const text = `Hello ${data.fullname},\n\nYour teacher account has been created successfully. \n\nYour Login Credentials:\nEmail: ${data.email}\nPassword: ${data.password}\n\nPlease keep this information secure.`;
    const html = `
        <div style="background-color: #1a3a2a; padding: 40px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #c9a84c;">
                <div style="background: #c9a84c; padding: 40px 20px; text-align: center;">
                    <h1 style="color: #1a3a2a; margin: 0; font-size: 28px; font-weight: 800;">GSM Academy</h1>
                    <p style="color: #1a3a2a; font-size: 16px; margin-top: 10px;">Welcome to our Faculty!</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #1a3a2a; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Hello ${data.fullname},</h2>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 20px;">
                        Your teacher account has been successfully created. Below are your account details and login credentials.
                    </p>
                    
                    <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                        <h3 style="margin-top: 0; color: #1a3a2a;">Your Credentials</h3>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
                        <p style="margin: 5px 0;"><strong>Password:</strong> ${data.password}</p>
                    </div>

                    <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                        <h3 style="margin-top: 0; color: #1a3a2a;">Profile Details</h3>
                        <p style="margin: 5px 0;"><strong>Mobile:</strong> ${data.mobile}</p>
                        <p style="margin: 5px 0;"><strong>Gender:</strong> ${data.gender}</p>
                        <p style="margin: 5px 0;"><strong>Department:</strong> ${data.department || 'N/A'}</p>
                        <p style="margin: 5px 0;"><strong>Specialty:</strong> ${data.specialty || 'N/A'}</p>
                        <p style="margin: 5px 0;"><strong>Experience:</strong> ${data.experience || 'N/A'} years</p>
                        <p style="margin: 5px 0;"><strong>Aadhar No:</strong> ${data.adharNo}</p>
                    </div>

                    <p style="color: #94a3b8; font-size: 13px; margin-top: 30px; text-align: center;">
                        Please log in to the portal and change your password as soon as possible for security reasons.
                    </p>
                </div>
            </div>
        </div>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendTeacherUpdateEmail = async (to: string, data: any) => {
    const subject = `Update on your GSM Academy Profile`;
    const text = `Hello ${data.fullname},\n\nYour teacher profile has been updated by the administration. \n\nPlease log in to your portal to review the changes.`;
    const html = `
        <div style="background-color: #1a3a2a; padding: 40px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #c9a84c;">
                <div style="background: #c9a84c; padding: 40px 20px; text-align: center;">
                    <h1 style="color: #1a3a2a; margin: 0; font-size: 28px; font-weight: 800;">GSM Academy</h1>
                    <p style="color: #1a3a2a; font-size: 16px; margin-top: 10px;">Profile Update Notice</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #1a3a2a; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Hello ${data.fullname},</h2>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 20px;">
                        Your teacher profile has recently been updated by the administration team.
                    </p>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 20px;">
                        Please log in to your portal to review the latest changes to your information, such as department, specialty, or contact details.
                    </p>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 30px; text-align: center;">
                        If you believe this update was a mistake, please contact the administration immediately.
                    </p>
                </div>
            </div>
        </div>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendTeacherDeletionEmail = async (to: string, name: string) => {
    const subject = `Account Deletion Notice - GSM Academy`;
    const text = `Hello ${name},\n\nYour teacher account has been removed from the GSM Academy system. If you have any questions, please contact administration.`;
    const html = `
        <div style="background-color: #1a3a2a; padding: 40px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #c9a84c;">
                <div style="background: #ef4444; padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">GSM Academy</h1>
                    <p style="color: #ffffff; font-size: 16px; margin-top: 10px;">Account Deletion Notice</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #1a3a2a; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Hello ${name},</h2>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 20px;">
                        This email is to formally notify you that your teacher account has been removed from the GSM Academy system by the administration.
                    </p>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 20px;">
                        Consequently, your access to the portal has been revoked. We thank you for your time with us.
                    </p>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 30px; text-align: center;">
                        If you have any questions or believe this is an error, please reach out to the school administration.
                    </p>
                </div>
            </div>
        </div>
    `;
    return sendEmail(to, subject, text, html);
};
