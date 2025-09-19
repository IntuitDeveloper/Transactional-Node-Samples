# Kitchen Sink - Example with Broad Settings

This use case demonstrates a comprehensive Transactional API message exercising many available settings in one example.

## Comprehensive Example

```javascript
require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

// Simple attachments
const fs = require('fs');
const path = require('path');

const attachments = [
  {
    type: 'application/pdf',
    name: 'sample.pdf',
    content: fs.readFileSync(path.resolve(__dirname, 'sample.pdf')).toString('base64')
  }
];

// Inline images (empty for this demo)
const images = [];

// Complete Transactional API message with ALL features
const message = {
  // Basic content
  html: `
    <h1>Hello {{fname}}!</h1>
    <p>This email demonstrates multiple Transactional API features.</p>
    <p>Company: {{company_name}}</p>
    <p>Account: {{account_id}}</p>
    <div style="width: 50px; height: 50px; background: #007bff; border: 2px solid #0056b3; display: inline-block;"></div>
  `,
  text: `Hello {{fname}}!\n\nThis email demonstrates multiple Transactional API features.\nCompany: {{company_name}}\nAccount: {{account_id}}`,
  
  // Basic fields
  subject: 'Hello {{fname}} - Transactional API Features Demo',
  from_email: process.env.DEFAULT_FROM_EMAIL || 'test@example.org',
  from_name: process.env.DEFAULT_FROM_NAME || 'Test Sender',
  
  // All recipient types
  to: [
    { email: process.env.DEFAULT_TO_EMAIL || 'recipient@example.org', name: process.env.DEFAULT_TO_NAME || 'Test Recipient', type: 'to' }
  ],
  cc: [
    // { email: 'cc@example.com', name: 'CC User', type: 'cc' }
  ],
  bcc: [
    // { email: 'bcc@example.com', name: 'BCC User', type: 'bcc' }
  ],
  
  // Headers
  headers: {
    'Reply-To': process.env.DEFAULT_FROM_EMAIL || 'test@example.org',
    'X-Custom-Header': 'Transactional-API-Demo'
  },
  
  // Merge variables
  global_merge_vars: [
    { name: 'company_name', content: 'Intuit Developer Program' }
  ],
  merge_vars: [
    {
      rcpt: process.env.DEFAULT_TO_EMAIL || 'recipient@example.org',
      vars: [
        { name: 'fname', content: 'John' },
        { name: 'account_id', content: 'ACC-001' }
      ]
    }
  ],
  merge_language: 'handlebars',
  
  // Attachments and images
  attachments: attachments,
  images: images,
  
  // Tracking
  track_opens: true,
  track_clicks: true,
  auto_text: true,
  auto_html: false,
  inline_css: true,
  
  // Tags and metadata
  tags: ['demo', 'kitchen-sink', 'features'],
  metadata: {
    campaign: 'mandrill-demo',
    version: '1.0'
  },
  
  // Advanced options
  important: true,
  view_content_link: true,
  preserve_recipients: false,
  async: false
};

async function sendKitchenSink() {
  try {
    const result = await mailchimp.messages.send({ message });
    
    if (Array.isArray(result)) {
      result.forEach(r => {
        console.log(`${r.email}: ${r.status}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('API Details:', error.response.data);
    }
  }
}

sendKitchenSink();
```

## Notes

- **Recipients**: Use `to` with `type: 'to' | 'cc' | 'bcc'` per recipient.
- **Merge**: Combine `global_merge_vars` and `merge_vars`; set `merge_language` to `handlebars` or `mailchimp`.
- **Templates**: Switch to `messages.sendTemplate` and pass `template_name`. Use `template_content` to replace mc:edit regions (Mailchimp merge language only).
- **Attachments/Images**: Use `attachments` for files and `images` for inline CID images. Total message size max ~25MB (Base64 grows size ~33%).
- **Headers**: Add standard headers (e.g., `Reply-To`) and custom `X-` headers.
- **Tracking**: Enable `track_opens` and `track_clicks` for analytics.
- **Metadata/Tags**: Useful for analytics and grouping in the UI.
- **Scheduling**: Provide `send_at` as an ISO-8601 string for future sends.
- **IP Pool**: If you use dedicated IPs, set `ip_pool` accordingly.

## API Mapping

- Send: `messages.send`
- Send with template: `messages.sendTemplate`
