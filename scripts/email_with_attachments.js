require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.TRANSACTIONAL_API_KEY);

// Helper to read a local file and return a Base64 string
function readFileAsBase64(filePath) {
  const data = fs.readFileSync(filePath);
  return data.toString('base64');
}

const attachments = [
  {
    type: 'application/pdf',
    name: 'sample.pdf',
    content: readFileAsBase64(path.resolve(__dirname, 'sample.pdf'))
  },
  {
    type: 'text/plain',
    name: 'readme.txt',
    content: Buffer.from('This is a demo text file created by the Transactional API Use Case File.\n\nGenerated at: ' + new Date().toISOString()).toString('base64')
  }
];

const message = {
  html: `
    <h1>Your Documents</h1>
    <p>Please find the attached files.</p>
  `,
  text: `Your documents are attached.`,
  subject: 'Documents Attached',
  from_email: process.env.DEFAULT_FROM_EMAIL || 'test@example.org',
  from_name: process.env.DEFAULT_FROM_NAME || 'Test Sender',
  to: [
    { email: process.env.DEFAULT_TO_EMAIL || 'recipient@example.org', name: process.env.DEFAULT_TO_NAME || 'Test Recipient', type: 'to' }
  ],
  attachments: attachments, // Array of attachments
  tags: ['attachments', 'outbound-documents']
};

async function sendWithAttachments() {
  try {
    const result = await mailchimp.messages.send({ message });
    console.log('Email with attachments sent:');
    console.log('Full result:', JSON.stringify(result, null, 2));
    
    if (Array.isArray(result)) {
      result.forEach(r => console.log(`${r.email}: ${r.status}`));
    } else {
      console.log('Unexpected result structure:', result);
    }
  } catch (error) {
    console.error('Transactional API error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

sendWithAttachments();