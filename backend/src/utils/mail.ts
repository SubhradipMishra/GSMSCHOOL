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

export const sendPaymentSuccessEmail = async (to: string, data: {
    fullname: string;
    courseName: string;
    amount: number;
    paymentId: string;
    orderId: string;
    enrolledAt: string;
    endingDate?: string;
}) => {
    const subject = `🎉 Enrollment Confirmed – ${data.courseName} | GSM Academy`;
    const text = `Hello ${data.fullname},\n\nYour payment was successful and you are now enrolled in ${data.courseName}.\n\nPayment ID: ${data.paymentId}\nAmount Paid: ₹${data.amount}\n\nWelcome to GSM Academy!`;
    const html = `
        <div style="background-color: #1a3a2a; padding: 40px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #c9a84c;">
                <div style="background: linear-gradient(135deg, #c9a84c, #a08030); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #1a3a2a; margin: 0; font-size: 28px; font-weight: 800;">GSM Academy</h1>
                    <p style="color: #1a3a2a; font-size: 16px; margin-top: 10px; font-weight: 600;">🎉 Enrollment Confirmed!</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #1a3a2a; font-size: 22px; font-weight: 800; margin-bottom: 10px;">Hello ${data.fullname},</h2>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 24px;">
                        Your payment was successful! You are now enrolled in <strong>${data.courseName}</strong>. Welcome to your learning journey!
                    </p>
                    <div style="background: #f1f5f9; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                        <h3 style="margin-top: 0; color: #1a3a2a; font-size: 15px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">📋 Payment Receipt</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td style="padding: 6px 0; color: #64748b;">Course</td><td style="padding: 6px 0; color: #1a3a2a; font-weight: 600; text-align: right;">${data.courseName}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Amount Paid</td><td style="padding: 6px 0; color: #16a34a; font-weight: 700; text-align: right;">₹${data.amount}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Payment ID</td><td style="padding: 6px 0; color: #1a3a2a; font-size: 12px; text-align: right;">${data.paymentId}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Order ID</td><td style="padding: 6px 0; color: #1a3a2a; font-size: 12px; text-align: right;">${data.orderId}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Enrolled On</td><td style="padding: 6px 0; color: #1a3a2a; text-align: right;">${data.enrolledAt}</td></tr>
                            ${data.endingDate ? `<tr><td style="padding: 6px 0; color: #64748b;">Access Until</td><td style="padding: 6px 0; color: #1a3a2a; text-align: right;">${data.endingDate}</td></tr>` : ''}
                        </table>
                    </div>
                    <div style="background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02)); padding: 20px; border-radius: 12px; border: 1px solid rgba(201,168,76,0.25); text-align: center; margin-bottom: 24px;">
                        <p style="color: #1a3a2a; font-size: 14px; margin: 0; font-weight: 600;">
                            🎓 Access your course from your Student Dashboard
                        </p>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                        If you did not make this purchase, please contact us immediately.
                    </p>
                </div>
            </div>
        </div>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendPaymentFailureEmail = async (to: string, data: {
    fullname: string;
    courseName: string;
    amount: number;
    orderId: string;
    reason?: string;
}) => {
    const subject = `❌ Payment Failed – ${data.courseName} | GSM Academy`;
    const text = `Hello ${data.fullname},\n\nUnfortunately, your payment of ₹${data.amount} for ${data.courseName} failed.\n\nReason: ${data.reason || 'Unknown error'}\nOrder ID: ${data.orderId}\n\nPlease try again from the GSM Academy portal.`;
    const html = `
        <div style="background-color: #1a3a2a; padding: 40px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #ef4444;">
                <div style="background: linear-gradient(135deg, #ef4444, #b91c1c); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">GSM Academy</h1>
                    <p style="color: #fecaca; font-size: 16px; margin-top: 10px; font-weight: 600;">❌ Payment Failed</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #1a3a2a; font-size: 22px; font-weight: 800; margin-bottom: 10px;">Hello ${data.fullname},</h2>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 24px;">
                        Unfortunately, your payment for <strong>${data.courseName}</strong> could not be processed.
                    </p>
                    <div style="background: #fef2f2; padding: 24px; border-radius: 16px; border: 1px solid #fecaca; margin-bottom: 24px;">
                        <h3 style="margin-top: 0; color: #991b1b; font-size: 15px; font-weight: 700; border-bottom: 1px solid #fecaca; padding-bottom: 10px;">❌ Failed Transaction Details</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td style="padding: 6px 0; color: #64748b;">Course</td><td style="padding: 6px 0; color: #1a3a2a; font-weight: 600; text-align: right;">${data.courseName}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Amount</td><td style="padding: 6px 0; color: #ef4444; font-weight: 700; text-align: right;">₹${data.amount}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Order ID</td><td style="padding: 6px 0; color: #1a3a2a; font-size: 12px; text-align: right;">${data.orderId}</td></tr>
                            ${data.reason ? `<tr><td style="padding: 6px 0; color: #64748b;">Reason</td><td style="padding: 6px 0; color: #ef4444; text-align: right;">${data.reason}</td></tr>` : ''}
                        </table>
                    </div>
                    <div style="background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02)); padding: 20px; border-radius: 12px; border: 1px solid rgba(201,168,76,0.25); text-align: center; margin-bottom: 24px;">
                        <p style="color: #1a3a2a; font-size: 14px; margin: 0; font-weight: 600;">
                            🔄 Please try again from the GSM Academy portal
                        </p>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                        No amount has been deducted from your account. If you believe this is an error, please contact support.
                    </p>
                </div>
            </div>
        </div>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendEventBookingSuccessEmail = async (to: string, data: {
    fullname: string;
    eventTitle: string;
    amount: number;
    paymentId: string;
    date: string;
    time: string;
    place: string;
}) => {
    const subject = `🎟️ Seat Confirmed: ${data.eventTitle} | GSM Academy`;
    const text = `Hello ${data.fullname},\n\nYour booking is confirmed for the event: ${data.eventTitle}.\n\nDate: ${data.date}\nTime: ${data.time}\nLocation: ${data.place}\nPayment: ${data.amount > 0 ? `₹${data.amount} (ID: ${data.paymentId})` : 'Free'}\n\nWe look forward to seeing you!`;
    const html = `
        <div style="background-color: #1a3a2a; padding: 40px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #c9a84c;">
                <div style="background: linear-gradient(135deg, #c9a84c, #a08030); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #1a3a2a; margin: 0; font-size: 28px; font-weight: 800;">GSM Academy</h1>
                    <p style="color: #1a3a2a; font-size: 16px; margin-top: 10px; font-weight: 600;">🎟️ Event Ticket Confirmed!</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #1a3a2a; font-size: 22px; font-weight: 800; margin-bottom: 10px;">Hello ${data.fullname},</h2>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 24px;">
                        Your seat is reserved for <strong>${data.eventTitle}</strong>. Here are the event and booking details:
                    </p>
                    <div style="background: #f1f5f9; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                        <h3 style="margin-top: 0; color: #1a3a2a; font-size: 15px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">📅 Event & Booking Details</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td style="padding: 6px 0; color: #64748b;">Event Title</td><td style="padding: 6px 0; color: #1a3a2a; font-weight: 600; text-align: right;">${data.eventTitle}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Date</td><td style="padding: 6px 0; color: #1a3a2a; font-weight: 600; text-align: right;">${data.date}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Time</td><td style="padding: 6px 0; color: #1a3a2a; font-weight: 600; text-align: right;">${data.time}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Place</td><td style="padding: 6px 0; color: #1a3a2a; font-weight: 600; text-align: right;">${data.place}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Amount Paid</td><td style="padding: 6px 0; color: #16a34a; font-weight: 700; text-align: right;">${data.amount > 0 ? `₹${data.amount}` : 'FREE'}</td></tr>
                            ${data.amount > 0 ? `<tr><td style="padding: 6px 0; color: #64748b;">Payment ID</td><td style="padding: 6px 0; color: #1a3a2a; font-size: 12px; text-align: right;">${data.paymentId}</td></tr>` : ''}
                        </table>
                    </div>
                    <div style="background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02)); padding: 20px; border-radius: 12px; border: 1px solid rgba(201,168,76,0.25); text-align: center; margin-bottom: 24px;">
                        <p style="color: #1a3a2a; font-size: 14px; margin: 0; font-weight: 600;">
                            🌟 Present this confirmation at the venue entrance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendEventBookingFailureEmail = async (to: string, data: {
    fullname: string;
    eventTitle: string;
    amount: number;
    orderId: string;
    reason?: string;
}) => {
    const subject = `❌ Booking Failed: ${data.eventTitle} | GSM Academy`;
    const text = `Hello ${data.fullname},\n\nUnfortunately, your payment for the event "${data.eventTitle}" failed.\n\nReason: ${data.reason || 'Unknown error'}\nOrder ID: ${data.orderId}\n\nPlease try booking again.`;
    const html = `
        <div style="background-color: #1a3a2a; padding: 40px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #ef4444;">
                <div style="background: linear-gradient(135deg, #ef4444, #b91c1c); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">GSM Academy</h1>
                    <p style="color: #fecaca; font-size: 16px; margin-top: 10px; font-weight: 600;">❌ Event Booking Failed</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #1a3a2a; font-size: 22px; font-weight: 800; margin-bottom: 10px;">Hello ${data.fullname},</h2>
                    <p style="color: #4B4128; font-size: 16px; margin-bottom: 24px;">
                        We couldn't process your payment for the event <strong>${data.eventTitle}</strong>.
                    </p>
                    <div style="background: #fef2f2; padding: 24px; border-radius: 16px; border: 1px solid #fecaca; margin-bottom: 24px;">
                        <h3 style="margin-top: 0; color: #991b1b; font-size: 15px; font-weight: 700; border-bottom: 1px solid #fecaca; padding-bottom: 10px;">❌ Details</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td style="padding: 6px 0; color: #64748b;">Event</td><td style="padding: 6px 0; color: #1a3a2a; font-weight: 600; text-align: right;">${data.eventTitle}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Amount</td><td style="padding: 6px 0; color: #ef4444; font-weight: 700; text-align: right;">₹${data.amount}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Order ID</td><td style="padding: 6px 0; color: #1a3a2a; font-size: 12px; text-align: right;">${data.orderId}</td></tr>
                            ${data.reason ? `<tr><td style="padding: 6px 0; color: #64748b;">Reason</td><td style="padding: 6px 0; color: #ef4444; text-align: right;">${data.reason}</td></tr>` : ''}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    return sendEmail(to, subject, text, html);
};
