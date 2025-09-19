require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.TRANSACTIONAL_API_KEY);

const message = {
  html: `
    <h1>Welcome {{fname}}!</h1>
    <p>Hi {{fname}} {{lname}},</p>
    <p>Thanks for joining the {{company_name}}! Your account is now active.</p>
    <p>Your membership level: {{membership_level}}</p>
    <p>Best regards,<br>The {{company_name}} Team</p>
  `,
  text: `
    Welcome {{fname}}!
    
    Hi {{fname}} {{lname}},
    
    Thanks for joining the {{company_name}}! Your account is now active.
    Your membership level: {{membership_level}}
    
    Best regards,
    The {{company_name}} Team
  `,
  subject: 'Welcome to {{company_name}}, {{fname}}!',
  from_email: process.env.DEFAULT_FROM_EMAIL || 'test@example.org',
  from_name: process.env.DEFAULT_FROM_NAME || 'Test Sender',
  to: [{
    email: process.env.DEFAULT_TO_EMAIL || 'recipient@example.org',
    name: process.env.DEFAULT_TO_NAME || 'Test Recipient',
    type: 'to'
  }],
  headers: {
    'Reply-To': process.env.DEFAULT_FROM_EMAIL || 'test@example.org'
  },
  // Global merge variables (apply to all recipients)
  global_merge_vars: [
    {
      name: 'company_name',
      content: 'Intuit Developer Program'
    },
    {
      name: 'membership_level',
      content: 'Premium' // Default value
    }
  ],
  // Recipient-specific merge variables
  merge_vars: [
    {
      rcpt: process.env.DEFAULT_TO_EMAIL || 'recipient@example.org',
      vars: [
        {
          name: 'fname',
          content: 'John'
        },
        {
          name: 'lname', 
          content: 'Smith'
        }
      ]
    }
  ],
  merge_language: 'handlebars' // or 'mailchimp'
};

async function sendPersonalizedEmail() {
  try {
    const result = await mailchimp.messages.send({ message });
    console.log('Personalized emails sent:');
    // console.log('Full result:', JSON.stringify(result, null, 2));
    
    if (Array.isArray(result)) {
      result.forEach((recipient) => {
        console.log(`${recipient.email}: ${recipient.status}`);
      });
    } else {
      console.log('Unexpected result structure:', result);
    }
  } catch (error) {
    console.error('Transactional API error:', error.message);
    if (error.response) {
      // console.error('Error response:', error.response.data);
    }
  }
}

sendPersonalizedEmail();