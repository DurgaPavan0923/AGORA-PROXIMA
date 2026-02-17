// SMS Service for sending OTP via SMS
// Supports multiple SMS providers

interface SMSOptions {
  phone: string;
  message: string;
}

export const sendSMS = async (options: SMSOptions): Promise<boolean> => {
  try {
    const { phone, message } = options;

    // Check if SMS service is configured
    if (!process.env.SMS_API_KEY) {
      // Development mode - log to console
      console.log('📱 SMS (Development Mode):');
      console.log('To:', phone);
      console.log('Message:', message);
      console.log('---');
      return true; // Return success in development mode
    }

    // Production mode - use actual SMS service
    const smsProvider = process.env.SMS_PROVIDER || 'twilio';

    switch (smsProvider) {
      case 'twilio':
        return await sendViaTwilio(phone, message);
      case 'msg91':
        return await sendViaMsg91(phone, message);
      case 'textlocal':
        return await sendViaTextLocal(phone, message);
      default:
        console.error('Unknown SMS provider:', smsProvider);
        return false;
    }
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
};

// Twilio SMS Provider
const sendViaTwilio = async (phone: string, message: string): Promise<boolean> => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured');
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phone.startsWith('+') ? phone : `+91${phone}`,
        From: fromNumber,
        Body: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twilio error: ${JSON.stringify(error)}`);
    }

    console.log('SMS sent via Twilio');
    return true;
  } catch (error) {
    console.error('Twilio SMS failed:', error);
    return false;
  }
};

// MSG91 SMS Provider (Popular in India)
const sendViaMsg91 = async (phone: string, message: string): Promise<boolean> => {
  try {
    const apiKey = process.env.MSG91_API_KEY;
    const senderId = process.env.MSG91_SENDER_ID || 'AGORA';

    if (!apiKey) {
      throw new Error('MSG91 API key not configured');
    }

    const url = 'https://api.msg91.com/api/v5/flow/';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'authkey': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        route: '4', // Transactional route
        country: '91',
        sms: [
          {
            message: message,
            to: [phone.startsWith('+91') ? phone.substring(3) : phone],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MSG91 error: ${JSON.stringify(error)}`);
    }

    console.log('SMS sent via MSG91');
    return true;
  } catch (error) {
    console.error('MSG91 SMS failed:', error);
    return false;
  }
};

// TextLocal SMS Provider (India)
const sendViaTextLocal = async (phone: string, message: string): Promise<boolean> => {
  try {
    const apiKey = process.env.TEXTLOCAL_API_KEY;
    const sender = process.env.TEXTLOCAL_SENDER || 'AGORA';

    if (!apiKey) {
      throw new Error('TextLocal API key not configured');
    }

    const url = 'https://api.textlocal.in/send/';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: apiKey,
        numbers: phone.startsWith('+91') ? phone.substring(3) : phone,
        sender: sender,
        message: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`TextLocal error: ${JSON.stringify(error)}`);
    }

    console.log('SMS sent via TextLocal');
    return true;
  } catch (error) {
    console.error('TextLocal SMS failed:', error);
    return false;
  }
};

// Send OTP SMS
export const sendOTPSMS = async (phone: string, otp: string): Promise<boolean> => {
  const message = `Your AGORA OTP is: ${otp}\n\nThis code will expire in 5 minutes.\n\nDo not share this code with anyone.\n\n- AGORA Team`;
  
  return await sendSMS({ phone, message });
};

// Send Welcome SMS after registration
export const sendWelcomeSMS = async (phone: string, name: string): Promise<boolean> => {
  const message = `Welcome to AGORA, ${name}!\n\nYour registration is being reviewed. You'll receive your Unique ID via email once approved.\n\n- AGORA Team`;
  
  return await sendSMS({ phone, message });
};
