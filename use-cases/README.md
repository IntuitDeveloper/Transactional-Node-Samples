# Transactional API Use Cases

Essential Node.js examples for the Transactional API. Each use case includes complete, copy-paste code examples.

## 📧 Basic Email Sending

- [Send a Single Email to a Single Recipient](./send-single-email-single-recipient.md)

## 🚀 Advanced Features

- [Send Email with Merge Tags](./send-email-with-merge-tags.md)
- [Send Email with Attachments](./send-email-with-attachments.md)
- [Create Email Template](./create-template.md)
- [Send Email Using Template](./send-email-using-template.md)
- [Kitchen Sink - All Features](./kitchen-sink.md)

---

## Quick Example

```javascript
require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

const message = {
  html: '<p>Hello world!</p>',
  text: 'Hello world!',
  subject: 'Test Email',
  from_email: process.env.DEFAULT_FROM_EMAIL || 'test@example.org',
  from_name: process.env.DEFAULT_FROM_NAME || 'Test Sender',
  to: [{
    email: process.env.DEFAULT_TO_EMAIL || 'recipient@example.org',
    name: process.env.DEFAULT_TO_NAME || 'Test Recipient',
    type: 'to'
  }]
};

async function sendEmail() {
  try {
    const result = await mailchimp.messages.send({ message });
    console.log('Email sent:', result[0].status);
  } catch (error) {
    console.error('Transactional API error:', error.message);
  }
}

sendEmail();
```

For setup instructions, see the [main README](../README.md).