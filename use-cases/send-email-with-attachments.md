# Send Email with Attachments

This use case demonstrates how to attach files to emails sent via Mailchimp Transactional (Mandrill) and outlines limits and best practices.

## Basic Attachments Example

Attach one or more files by providing Base64-encoded content. The total message size (including attachments) must not exceed 25MB. Because attachments are Base64-encoded, they are roughly 33% larger than their on-disk size.

```javascript
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

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
    content: Buffer.from('This is a demo text file created by the Mandrill Use Case File.\n\nGenerated at: ' + new Date().toISOString()).toString('base64')
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
    console.error('Mandrill error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

sendWithAttachments();
```

## Attachments Using Buffers and Streams

If you already have a Buffer, convert it to Base64. For streams (e.g., reading large files), buffer the content before sending.

```javascript
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

function bufferToBase64(buffer) {
  return buffer.toString('base64');
}

async function sendBufferAsAttachment(buffer, filename, mimeType) {
  const message = {
    html: '<p>Attached buffer file.</p>',
    text: 'Attached buffer file.',
    subject: 'Buffer Attachment',
    from_email: 'attachments@example.org',
    from_name: 'Attachment Service',
    to: [{ email: 'john@example.org', type: 'to' }],
    attachments: [
      {
        type: mimeType || 'application/octet-stream',
        name: filename || 'file.bin',
        content: bufferToBase64(buffer)
      }
    ]
  };

  await mailchimp.messages.send({ message });
}
```

## Limits and Processing

- **Total Message Size**: Up to 25MB (includes the message body + attachments + headers).  
- **Base64 Overhead**: Attachments are Base64-encoded, increasing size by ~33%. A 15MB file on disk becomes ~20MB over the wire.  
- **Virus Scanning**: All attachments are scanned by multiple engines to help ensure safety for recipients.  
- **No Per-File Limit**: There is no specific limit for individual attachments beyond the total message size.

## Best Practices

- **Keep Attachments Small**: Prefer < 10MB combined to ensure deliverability and reduce scan time.  
- **Use Accurate MIME Types**: Set the `type` field properly (e.g., `application/pdf`, `image/png`).  
- **Validate Sizes**: Pre-check content size and account for Base64 growth before sending.  
- **Fallback Links**: For large or multiple files, consider hosting and linking instead of emailing.  
- **Security**: Only attach files from trusted sources; scan files before sending.  
- **Tracking**: Add tags and metadata for downstream analytics.

## Notes

- **Attachments Field**: Provide an array of objects `{ type, name, content }` where `content` is Base64.  
- **Inline Images**: Use the `images` array for content intended to render inside the email body (see inline images use case).  
- **Delivery Timing**: Large attachments can add processing time due to scanning.  
- **Error Handling**: Handle `ValidationError` for malformed attachments and runtime errors for oversize messages.
