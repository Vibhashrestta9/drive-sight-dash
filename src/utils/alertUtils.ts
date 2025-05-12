
interface AlertData {
  driverName: string;
  location: string;
  timestamp: string;
  status: string;
}

interface AlertSettings {
  sendgridApiKey?: string;
  senderEmail?: string;
}

export const sendEmailAlert = async (
  data: AlertData, 
  emailAddress: string,
  settings?: AlertSettings
): Promise<boolean> => {
  if (!emailAddress) {
    console.error('No email address provided for alerts');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    console.error('Invalid email format:', emailAddress);
    return false;
  }
  
  // Check if SendGrid credentials are available
  if (!settings?.sendgridApiKey || !settings?.senderEmail) {
    console.error('SendGrid API key and sender email are required');
    return false;
  }

  console.log('Attempting to send email alert to:', emailAddress);
  console.log('Alert data:', JSON.stringify(data));

  try {
    const response = await fetch('https://87e62aba-bf20-4563-aed5-3388a32d7039.supabase.co/functions/v1/send-alert-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        recipientEmail: emailAddress,
        sendgridApiKey: settings.sendgridApiKey,
        senderEmail: settings.senderEmail
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Email sending failed with status:', response.status);
      console.error('Error details:', result.error || 'Unknown error');
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email alert sent successfully to:', emailAddress);
    return true;
  } catch (error) {
    console.error('Error sending email alert:', error);
    return false;
  }
};
