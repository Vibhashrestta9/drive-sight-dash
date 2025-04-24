
import { serve } from "https://deno.fresh.dev/server";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface EmailAlert {
  driverName: string;
  location: string;
  timestamp: string;
  status: string;
  recipientEmail: string;
  sendgridApiKey: string;
  senderEmail: string;
}

serve(async (req) => {
  // Set CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      } 
    });
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const data = await req.json() as EmailAlert;
    console.log('Received request to send email alert:', {
      recipient: data.recipientEmail,
      driver: data.driverName,
      location: data.location,
    });
    
    const { driverName, location, timestamp, status, recipientEmail, sendgridApiKey, senderEmail } = data;
    
    if (!sendgridApiKey || !senderEmail) {
      console.error('Missing SendGrid API key or sender email');
      throw new Error('SendGrid API key and sender email are required');
    }

    if (!recipientEmail) {
      console.error('Missing recipient email');
      throw new Error('Recipient email is required');
    }

    const emailBody = `
      CRITICAL DRIVER ALERT
      
      Driver ${driverName} is in CRITICAL condition!
      Location: ${location}
      Time: ${timestamp}
      Status: ${status}
      
      Please check on the driver immediately.
      
      This is an automated alert from your DriveSight Dashboard.
    `;

    console.log(`Sending alert email to ${recipientEmail} via SendGrid`);
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: recipientEmail }],
        }],
        from: { email: senderEmail },
        subject: `🚨 CRITICAL DRIVER ALERT: ${driverName}`,
        content: [{
          type: 'text/plain',
          value: emailBody,
        }],
      }),
    });

    const responseText = await response.text();
    console.log(`SendGrid API response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`SendGrid API error: ${response.statusText}`, responseText);
      throw new Error(`SendGrid API error: ${response.status} - ${responseText || response.statusText}`);
    }

    console.log('Email successfully sent!');
    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error in send-alert-email function:', error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack || 'No stack trace available'
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
