require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.TRANSACTIONAL_API_KEY);

const message = {
  html: '<p>Hello HTML world!</p>',
  text: 'Hello plain world!',
  subject: 'Hello world',
  from_email: process.env.DEFAULT_FROM_EMAIL || 'test@example.org',
  from_name: process.env.DEFAULT_FROM_NAME || 'Test Sender',
  to: [{
    email: process.env.DEFAULT_TO_EMAIL || 'recipient@example.org',
    name: process.env.DEFAULT_TO_NAME || 'Test Recipient',
    type: 'to'
  }],
  headers: {
    'Reply-To': process.env.DEFAULT_FROM_EMAIL || 'test@example.org'
  }
};

async function sendEmail() {
  try {
    const result = await mailchimp.messages.send({
      message: message
    });
    console.log('Email sent successfully:');
    console.log('Full result:', JSON.stringify(result, null, 2));
    
    if (result && result.length > 0) {
      console.log('Status:', result[0].status);
      console.log('Email:', result[0].email);
      console.log('Message ID:', result[0]._id);
    } else {
      console.log('Unexpected result structure:', result);
    }
  } catch (error) {
    console.log(`Transactional API error: ${error.name} - ${error.message}`);
    if (error.response) {
      console.log('Error response:', error.response.data);
    }
  }
}

sendEmail();