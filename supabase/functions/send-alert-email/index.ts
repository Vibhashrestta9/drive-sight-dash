
import { serve } from "https://deno.fresh.dev/server";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL');

interface EmailAlert {
  driverName: string;
  location: string;
  timestamp: string;
  status: string;
  recipientEmail: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const { driverName, location, timestamp, status, recipientEmail } = await req.json() as EmailAlert;

    const emailBody = `
      Driver ${driverName} is in CRITICAL condition!
      Location: ${location}
      Time: ${timestamp}
      Status: ${status}
      
      Please check on the driver immediately.
    `;

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: recipientEmail }],
        }],
        from: { email: SENDER_EMAIL },
        subject: `🚨 CRITICAL DRIVER ALERT: ${driverName}`,
        content: [{
          type: 'text/plain',
          value: emailBody,
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
