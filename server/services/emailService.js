const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP email
const sendOTPEmail = async (email, otp, purpose = 'student_verification') => {
  try {
    const subject = purpose === 'student_verification' 
      ? 'CollegeNetwork - Student Verification OTP'
      : 'CollegeNetwork - Password Reset OTP';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">CollegeNetwork</h1>
        </div>
        
        <div style="padding: 20px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Verification Code</h2>
          
          <p style="color: #475569; margin-bottom: 20px;">
            Your verification code is:
          </p>
          
          <div style="background: #e2e8f0; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #1e293b; letter-spacing: 5px;">
              ${otp}
            </span>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px;">
              Best regards,<br>
              The CollegeNetwork Team
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send college verification email
const sendCollegeVerificationEmail = async (email, collegeName, isApproved, rejectionReason = null) => {
  try {
    const subject = isApproved 
      ? 'CollegeNetwork - College Registration Approved'
      : 'CollegeNetwork - College Registration Update';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${isApproved ? '#10b981' : '#ef4444'}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">CollegeNetwork</h1>
        </div>
        
        <div style="padding: 20px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">
            ${isApproved ? 'Registration Approved!' : 'Registration Update'}
          </h2>
          
          <p style="color: #475569; margin-bottom: 20px;">
            Dear ${collegeName},
          </p>
          
          ${isApproved 
            ? `<p style="color: #059669; margin-bottom: 20px;">
                Congratulations! Your college registration has been approved. Your students can now sign up using their college email addresses.
              </p>`
            : `<p style="color: #dc2626; margin-bottom: 20px;">
                We regret to inform you that your college registration could not be approved at this time.
              </p>
              ${rejectionReason ? `<p style="color: #dc2626; margin-bottom: 20px;"><strong>Reason:</strong> ${rejectionReason}</p>` : ''}`
          }
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px;">
              Best regards,<br>
              The CollegeNetwork Team
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendCollegeVerificationEmail
}; 