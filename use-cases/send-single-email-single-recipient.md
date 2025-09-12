# Send a Single Email to a Single Recipient

This use case demonstrates how to send a single email to a single recipient using the Mandrill API.

## Basic Example

Here's how to send a single email to a single recipient using the Mandrill API:

```javascript
require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

const message = {
  html: '<p>Hello HTML world!</p>',
  text: 'Hello plain world!',
  subject: 'Hello world',
  from_email: 'brad_hudson@intuit.com',
  from_name: 'Brad Hudson',
  to: [{
    email: 'brad_hudson@intuit.com',
    name: 'Brad Hudson',
    type: 'to'
  }],
  headers: {
    'Reply-To': 'brad_hudson@intuit.com'
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
    console.log(`Mandrill error: ${error.name} - ${error.message}`);
    if (error.response) {
      console.log('Error response:', error.response.data);
    }
  }
}

sendEmail();
```

## API Features

| Feature | Mandrill Implementation |
|---------|-------------------------|
| **Recipients** | `to: [{email: 'email@example.org', name: 'Name', type: 'to'}]` |
| **Sender** | `from_email: 'email@example.org', from_name: 'Name'` |
| **Send Method** | `mailchimp.messages.send({message: msg}, success, error)` |

## Message Structure

The Mandrill message object requires these key properties:

- **html**: HTML content of the email
- **text**: Plain text content (optional, but recommended)
- **subject**: Email subject line
- **from_email**: Sender's email address
- **from_name**: Sender's display name (optional)
- **to**: Array of recipient objects

### Recipient Object Structure

Each recipient in the `to` array must be an object with:

- **email**: Recipient's email address (required)
- **name**: Recipient's display name (optional)
- **type**: Recipient type - `'to'`, `'cc'`, or `'bcc'` (required)

## Advanced Options

You can enhance your email with additional options:

```javascript
const message = {
  html: '<p>Hello HTML world!</p>',
  text: 'Hello plain world!',
  subject: 'Hello world',
  from_email: 'sender@example.org',
  from_name: 'Sender Name',
  to: [{
    email: 'recipient@example.org',
    name: 'Recipient Name',
    type: 'to'
  }],
  headers: {
    'Reply-To': 'replyto@example.org',
    'X-MC-Track': 'opens,clicks'
  },
  important: true,
  track_opens: true,
  track_clicks: true,
  auto_text: true,
  auto_html: false,
  inline_css: true,
  tags: ['welcome', 'single-recipient'],
  metadata: {
    user_id: '12345',
    campaign: 'welcome-series'
  }
};
```
## Notes

- **Async Parameter**: Set `async: false` for immediate sending, `async: true` for background processing
- **IP Pool**: Specify `ip_pool` for dedicated IP addresses (optional)
- **Headers**: Use the `headers` object for custom email headers
- **Tracking**: Enable `track_opens` and `track_clicks` for email analytics
