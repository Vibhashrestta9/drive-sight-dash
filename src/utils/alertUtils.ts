
/**
 * Utility functions for sending critical driver alerts
 */

interface AlertData {
  driverName: string;
  location: string;
  timestamp: string;
  status: string;
}

/**
 * Sends an email alert for a driver in critical condition
 * @param data Alert data including driver information
 * @param emailAddress The recipient email address
 * @returns Promise resolving to success status
 */
export const sendEmailAlert = async (data: AlertData, emailAddress: string): Promise<boolean> => {
  if (!emailAddress) {
    console.error('No email address provided for alerts');
    return false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    console.error('Invalid email format:', emailAddress);
    return false;
  }

  try {
    // For demonstration purposes, log the email that would be sent
    console.log(`📧 ALERT EMAIL would be sent to ${emailAddress} with data:`, data);
    
    // In a production environment, you would use a real email service API
    // Examples include SendGrid, Mailgun, AWS SES, or your own backend email service
    
    // This is a simulation for the demo - in a real app, replace with actual API endpoint
    const emailBody = `
      Driver ${data.driverName} is in CRITICAL condition!
      Location: ${data.location}
      Time: ${data.timestamp}
      Status: ${data.status}
      
      Please check on the driver immediately.
    `;
    
    // For demo purposes only - simulating email send success
    console.log('Email Content:', {
      to: emailAddress,
      subject: `🚨 CRITICAL DRIVER ALERT: ${data.driverName}`,
      message: emailBody
    });
    
    // This is where you would connect to a real email service API
    // For demonstration purposes, we'll simulate a successful API call
    console.log('Email would be sent in production environment');
    
    // To use a real email service, you would uncomment and modify code like this:
    /*
    const response = await fetch('https://your-real-email-service.com/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY_HERE'
      },
      body: JSON.stringify({
        to: emailAddress,
        subject: `🚨 CRITICAL DRIVER ALERT: ${data.driverName}`,
        message: emailBody,
      }),
    });
    return response.ok;
    */
    
    return true; // Simulate success for demo
  } catch (error) {
    console.error('Error sending email alert:', error);
    return false;
  }
};
