
interface AlertData {
  driverName: string;
  location: string;
  timestamp: string;
  status: string;
}

export const sendEmailAlert = async (data: AlertData, emailAddress: string): Promise<boolean> => {
  if (!emailAddress) {
    console.error('No email address provided for alerts');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    console.error('Invalid email format:', emailAddress);
    return false;
  }

  try {
    const response = await fetch('https://87e62aba-bf20-4563-aed5-3388a32d7039.supabase.co/functions/v1/send-alert-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        recipientEmail: emailAddress,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email alert sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email alert:', error);
    return false;
  }
};
