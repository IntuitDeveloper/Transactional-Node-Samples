# Kitchen Sink - Example with Broad Settings

This use case demonstrates a comprehensive Mailchimp Transactional (Mandrill) message exercising many available settings in one example.

## Comprehensive Example

```javascript
const fs = require('fs');
const path = require('path');
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

function readBase64(p) {
  return fs.readFileSync(p).toString('base64');
}

async function sendKitchenSink() {
  const message = {
    // Core content
    html: `
      <h1>Kitchen Sink</h1>
      <p>Hello {{FNAME}} {{LNAME}},</p>
      <p>Welcome to {{company_name}}. Your order <strong>{{ORDERID}}</strong> is confirmed.</p>
      <p><img src="cid:company-logo" alt="Logo" style="max-width:160px"/></p>
      <p>Inline image above, attachments included.</p>
    `,
    text: 'Hello {{FNAME}} {{LNAME}}, your order {{ORDERID}} is confirmed.',
    subject: 'Order {{ORDERID}} Confirmation - {{company_name}}',

    // From
    from_email: 'no-reply@example.org',
    from_name: 'Example Inc.',

    // Recipients (to/cc/bcc)
    to: [
      { email: 'primary@example.org', name: 'Primary Recipient', type: 'to' },
      { email: 'copy1@example.org', name: 'Copy One', type: 'cc' },
      { email: 'copy2@example.org', name: 'Copy Two', type: 'cc' },
      { email: 'hidden@example.org', name: 'Hidden Recipient', type: 'bcc' }
    ],

    // Headers
    headers: {
      'Reply-To': 'support@example.org',
      'X-Custom-Header': 'custom-value'
    },

    // Tracking & options
    important: false,
    track_opens: true,
    track_clicks: true,
    auto_text: true,
    auto_html: false,
    inline_css: true,
    url_strip_qs: false,
    preserve_recipients: false,
    view_content_link: null,
    subaccount: null,

    // Merge data (global + per recipient)
    global_merge_vars: [
      { name: 'company_name', content: 'Example Inc.' }
    ],
    merge_vars: [
      {
        rcpt: 'primary@example.org',
        vars: [
          { name: 'FNAME', content: 'Alex' },
          { name: 'LNAME', content: 'Smith' },
          { name: 'ORDERID', content: 'A-1001' }
        ]
      },
      {
        rcpt: 'copy1@example.org',
        vars: [
          { name: 'FNAME', content: 'Casey' },
          { name: 'LNAME', content: 'Lee' },
          { name: 'ORDERID', content: 'A-1001' }
        ]
      }
    ],
    merge_language: 'handlebars',

    // Attachments (downloadable) and inline images
    attachments: [
      {
        type: 'application/pdf',
        name: 'invoice.pdf',
        content: readBase64(path.resolve(__dirname, '../fixtures/invoice.pdf'))
      },
      {
        type: 'text/plain',
        name: 'notes.txt',
        content: Buffer.from('Order notes for A-1001').toString('base64')
      }
    ],
    images: [
      {
        type: 'image/png',
        name: 'company-logo', // referenced as cid:company-logo
        content: readBase64(path.resolve(__dirname, '../fixtures/logo.png'))
      }
    ],

    // Metadata and tags
    metadata: {
      order_id: 'A-1001',
      customer_id: 'C-500'
    },
    tags: ['kitchen-sink', 'orders', 'transactional'],

    // IP pool & scheduling
    ip_pool: undefined, // e.g., 'transactional-pool'
    send_at: null // e.g., new Date(Date.now() + 3600_000).toISOString()
  };

  // Optional: Use a stored template instead of inline HTML
  const useTemplate = false;
  const templateName = 'order-confirmation-template';
  const templateContent = [
    // For Mailchimp merge language mc:edit regions only
    // { name: 'main', content: '<p>Custom main area</p>' }
  ];

  try {
    let result;
    if (useTemplate) {
      result = await mailchimp.messages.sendTemplate({
        template_name: templateName,
        template_content: templateContent,
        message
      });
    } else {
      result = await mailchimp.messages.send({ message });
    }

    console.log('Kitchen Sink send results:');
    result.forEach(r => {
      console.log(`${r.email}: ${r.status}${r.reject_reason ? ` (${r.reject_reason})` : ''}`);
    });
  } catch (error) {
    console.error('Mandrill error:', error.message);
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
