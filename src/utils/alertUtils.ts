
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

  try {
    // In a production environment, this would call your backend API
    // which would handle the actual email sending through services like SendGrid, AWS SES, etc.
    
    // For demo purposes, we'll simulate the API call
    console.log(`📧 ALERT EMAIL would be sent to ${emailAddress} with data:`, data);
    
    // Simulated API call - in real app, replace with actual API endpoint
    const response = await fetch('https://mock-email-service.example/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // This is just a simulation - it won't actually send an email
      body: JSON.stringify({
        to: emailAddress,
        subject: `🚨 CRITICAL DRIVER ALERT: ${data.driverName}`,
        message: `
          Driver ${data.driverName} is in CRITICAL condition!
          Location: ${data.location}
          Time: ${data.timestamp}
          Status: ${data.status}
          
          Please check on the driver immediately.
        `,
      }),
    }).catch(() => {
      // Catch network errors for the demo
      console.log('Email would be sent in production environment');
      return { ok: true }; // Simulate success for demo
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email alert:', error);
    return false;
  }
};
