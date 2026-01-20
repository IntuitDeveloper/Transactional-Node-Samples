# Send an SMS to a Single Recipient

This use case demonstrates how to send an SMS message to a single recipient using the Mandrill API with Node.js.

> **Note:** The Node.js SDK doesn't include the `send_sms` method yet, so we use the REST API directly with the `/api/1.1/messages/send-sms` endpoint.

## Basic Example

Here's how to send an SMS using the Mandrill REST API:

```javascript
require('dotenv').config();
const https = require('https');

const SMS_API_ENDPOINT = 'https://mandrillapp.com/api/1.1/messages/send-sms';

async function sendSms(toPhone, fromPhone, messageText, consentType = 'onetime') {
  const payload = {
    key: process.env.TRANSACTIONAL_API_KEY,
    message: {
      sms: {
        text: messageText,
        to: toPhone,           // E.164 format (e.g., +1234567890)
        from: fromPhone,       // Must be verified in Mandrill
        consent: consentType,
        track_clicks: true
      }
    }
  };

  return new Promise((resolve, reject) => {
    const url = new URL(SMS_API_ENDPOINT);
    const postData = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log(`SMS sent! Status: ${result[0].status}`);
          resolve(result);
        } else {
          console.log(`Failed: ${data}`);
          reject(new Error(data));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Send an SMS
sendSms('+1234567890', '+0987654321', 'Hello from Mandrill SMS!');
```

## API Features

| Feature | Mandrill Implementation |
|---------|-------------------------|
| **Endpoint** | `POST https://mandrillapp.com/api/1.1/messages/send-sms` |
| **Recipient** | `message.sms.to`: Phone number in E.164 format (e.g., `+1234567890`) |
| **Sender** | `message.sms.from`: Verified sender ID (E.164 number, short code, or alphanumeric) |
| **Message** | `message.sms.text`: SMS content (max 1600 characters) |
| **Consent** | `message.sms.consent`: Type of consent (`onetime`, `recurring`, `recurring-no-confirm`) |

## Message Structure

The Mandrill SMS payload requires these key properties:

- **key**: Your Mandrill API key
- **message.sms.text**: Content of the SMS message
- **message.sms.to**: Recipient's phone number in E.164 format
- **message.sms.from**: Approved sender ID (must be verified)
- **message.sms.consent**: Consent type for the message
- **message.sms.track_clicks**: Boolean to enable URL click tracking (optional)

### Phone Number Format (E.164)

Phone numbers must be in E.164 format:
- Starts with `+` followed by the country code
- No spaces, dashes, or parentheses
- Examples:
  - US: `+14155551234`
  - UK: `+442071234567`
  - Australia: `+61412345678`

### Consent Types

| Type | Description |
|------|-------------|
| `onetime` | Single transactional message (default) |
| `recurring` | Ongoing messages with confirmation |
| `recurring-no-confirm` | Ongoing messages without confirmation |

## Advanced Options

You can enhance your SMS with additional options:

```javascript
const payload = {
  key: apiKey,
  message: {
    sms: {
      text: 'Your order #12345 has shipped! Track it here: https://example.com/track/12345',
      to: '+1234567890',
      from: '+0987654321',
      consent: 'onetime',
      track_clicks: true  // Track link clicks in the message
    }
  }
};
```

## Environment Variables

Create a `.env` file in the scripts directory with:

```
TRANSACTIONAL_API_KEY=your_api_key_here
SMS_TO_PHONE=+1234567890
SMS_FROM_PHONE=+0987654321
SMS_MESSAGE=Hello from Mandrill SMS!
SMS_CONSENT_TYPE=onetime
SMS_TRACK_CLICKS=true
```

## Error Handling

```javascript
require('dotenv').config();
const https = require('https');

const SMS_API_ENDPOINT = 'https://mandrillapp.com/api/1.1/messages/send-sms';

async function sendSmsWithErrorHandling(toPhone, fromPhone, messageText) {
  const payload = {
    key: process.env.TRANSACTIONAL_API_KEY,
    message: {
      sms: {
        text: messageText,
        to: toPhone,
        from: fromPhone,
        consent: 'onetime'
      }
    }
  };

  return new Promise((resolve) => {
    const url = new URL(SMS_API_ENDPOINT);
    const postData = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          switch (res.statusCode) {
            case 200:
              if (result[0]?.status === 'rejected') {
                resolve({ success: false, error: `Rejected: ${result[0].reject_reason}` });
              } else {
                resolve({ success: true, data: result });
              }
              break;
            case 401:
              resolve({ success: false, error: 'Invalid API key' });
              break;
            case 400:
              resolve({ success: false, error: `Bad request: ${data}` });
              break;
            default:
              resolve({ success: false, error: `HTTP ${res.statusCode}: ${data}` });
          }
        } catch (e) {
          resolve({ success: false, error: `Parse error: ${e.message}` });
        }
      });
    });

    req.on('error', (error) => {
      if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        resolve({ success: false, error: 'SSL Error. Try setting NODE_TLS_REJECT_UNAUTHORIZED=0' });
      } else {
        resolve({ success: false, error: error.message });
      }
    });

    req.setTimeout(30000, () => {
      req.destroy();
      resolve({ success: false, error: 'Request timed out' });
    });

    req.write(postData);
    req.end();
  });
}
```

## Prerequisites

Before sending SMS messages, ensure you have:

1. **Verified Sender Phone Number**: Your sending phone number must be verified in your Mandrill account
2. **SMS Enabled**: SMS functionality must be enabled for your account
3. **Proper Consent**: You must have appropriate consent from recipients to send SMS messages
4. **Valid API Key**: Your Mandrill API key with SMS permissions

## Common Use Cases

### Order Confirmation

```javascript
await sendSms({
  to: customerPhone,
  from: businessPhone,
  text: `Your order #${orderId} has been confirmed! Expected delivery: ${deliveryDate}`
});
```

### Appointment Reminder

```javascript
await sendSms({
  to: patientPhone,
  from: clinicPhone,
  text: `Reminder: Your appointment is scheduled for ${appointmentTime}. Reply CONFIRM to confirm.`
});
```

### Verification Code

```javascript
const code = Math.floor(100000 + Math.random() * 900000);
await sendSms({
  to: userPhone,
  from: servicePhone,
  text: `Your verification code is: ${code}. This code expires in 10 minutes.`
});
```

### Shipping Notification

```javascript
await sendSms({
  to: customerPhone,
  from: storePhone,
  text: `Great news! Your package has shipped. Track it here: https://example.com/track/${trackingId}`
});
```

## Running the Script

```bash
cd scripts
node sms_single_recipient.js
```

## Notes

- **Character Limit**: SMS messages can be up to 1600 characters
- **Link Tracking**: Enable `track_clicks: true` to track link clicks in your messages
- **Rate Limits**: Be aware of SMS rate limits for your account
- **Compliance**: Ensure compliance with SMS regulations (TCPA, GDPR, etc.)
- **Costs**: SMS messages may incur additional costs depending on your plan
- **International**: International SMS delivery may have different rates and regulations

## API Response

A successful response looks like:

```json
[
  {
    "status": "sent",
    "to": "+1234567890",
    "_id": "abc123def456"
  }
]
```

Possible status values:
- `sent`: Message was sent successfully
- `queued`: Message is queued for delivery
- `rejected`: Message was rejected (check `reject_reason`)
- `invalid`: Invalid phone number or parameters

