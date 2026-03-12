import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  } else {
    // For development, use Ethereal (fake SMTP)
    // Or configure your own SMTP server
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
};

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_USER && !process.env.SMTP_USER) {
      console.log('\u{1F4E7} EMAIL (Development Mode):');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      if (options.text) console.log('Preview:', options.text.substring(0, 120) + '...');
      console.log('---');
      return true;
    }

    const transporter = createTransporter();

    // Verify SMTP connection on first send
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error('Email SMTP connection failed:', verifyErr);
      console.error('Check EMAIL_USER / EMAIL_PASSWORD in .env (use Gmail App Password, not regular password)');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('\u2705 Email sent:', info.messageId, '| To:', options.to);
    return true;
  } catch (error: any) {
    console.error('Email sending failed:', error.message || error);
    return false;
  }
};

export const sendUniqueIdEmail = async (
  email: string,
  name: string,
  uniqueId: string
): Promise<boolean> => {
  const subject = 'Your AGORA Voting Account Approved! 🎉';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .unique-id-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
        .unique-id { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; font-family: monospace; }
        .steps { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .step { margin: 10px 0; padding-left: 10px; }
        .button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗳️ Welcome to AGORA!</h1>
          <p>Your voting account has been approved</p>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Great news! Your registration has been verified and approved by our admin team.</p>
          
          <div class="unique-id-box">
            <p style="margin: 0; font-size: 14px; color: #666;">Your Unique ID:</p>
            <div class="unique-id">${uniqueId}</div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Keep this ID secure - you'll need it to login</p>
          </div>

          <div class="steps">
            <h3 style="color: #667eea; margin-top: 0;">🔐 How to Login:</h3>
            <div class="step">1️⃣ Visit the AGORA website</div>
            <div class="step">2️⃣ Click "Sign In"</div>
            <div class="step">3️⃣ Enter your Unique ID</div>
            <div class="step">4️⃣ Verify with OTP sent to your phone</div>
            <div class="step">5️⃣ Create/Enter your 4-digit MPIN</div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/auth" class="button">
              Login to AGORA
            </a>
          </div>

          <p style="margin-top: 30px;">
            <strong>Important Security Notes:</strong><br>
            • Keep your Unique ID confidential<br>
            • Never share your MPIN with anyone<br>
            • AGORA will never ask for your MPIN via email<br>
            • Your vote is completely anonymous and secure
          </p>

          <div class="footer">
            <p>This email was sent by AGORA - Blockchain-Powered Voting Platform</p>
            <p>If you didn't register for AGORA, please ignore this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hello ${name},

Your AGORA voting account has been approved!

Your Unique ID: ${uniqueId}

How to Login:
1. Visit ${process.env.CLIENT_URL || 'http://localhost:3000'}/auth
2. Click "Sign In"
3. Enter your Unique ID
4. Verify with OTP sent to your phone
5. Create/Enter your 4-digit MPIN

Keep your Unique ID secure!

Best regards,
AGORA Team
  `;

  return await sendEmail({ to: email, subject, html, text });
};

export const sendRejectionEmail = async (
  email: string,
  name: string,
  reason: string
): Promise<boolean> => {
  const subject = 'AGORA Registration - Additional Information Required';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reason-box { background: #fff3cd; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Registration Update</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for your interest in AGORA. We've reviewed your registration and need some additional information.</p>
          
          <div class="reason-box">
            <strong>Reason:</strong><br>
            ${reason}
          </div>

          <p>Please address the above concern and submit a new registration with the correct information.</p>

          <p>If you have any questions, please contact our support team.</p>

          <div class="footer">
            <p>This email was sent by AGORA - Blockchain-Powered Voting Platform</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hello ${name},

We've reviewed your AGORA registration and need some additional information.

Reason: ${reason}

Please address the above concern and submit a new registration with the correct information.

Best regards,
AGORA Team
  `;

  return await sendEmail({ to: email, subject, html, text });
};
