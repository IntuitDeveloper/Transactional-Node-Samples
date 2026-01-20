# Transactional API Scripts

Ready-to-run Node.js scripts demonstrating all Transactional API features.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
   ⚠️ **Important:** Make sure to run `npm install` in the `scripts/` directory to install the required packages.

2. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env and add your TRANSACTIONAL_API_KEY and email addresses
   ```

3. **Run any script:**
   ```bash
   node email_with_single_recipient.js
   node email_with_merge_tags.js
   node email_with_attachments.js
   node create_template.js
   node email_with_template.js
   node kitchen_sink_email.js
   node sms_single_recipient.js
   ```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `email_with_single_recipient.js` | Send a single email to a single recipient |
| `email_with_merge_tags.js` | Send email with merge tags for personalization |
| `email_with_attachments.js` | Send email with file attachments (includes sample.pdf) |
| `create_template.js` | Create a new email template in your Transactional API account |
| `email_with_template.js` | Send email using a stored template |
| `kitchen_sink_email.js` | Send comprehensive email with ALL Transactional API features |
| `sms_single_recipient.js` | 📱 Send an SMS message to a single recipient |

## 🔧 Requirements

- Node.js 14.0.0 or higher
- Transactional API key from [Mailchimp Transactional](https://mailchimp.com/developer/transactional/)

## 📧 Environment Variables

Create a `.env` file with:

```env
TRANSACTIONAL_API_KEY=your_transactional_api_key_here
DEFAULT_FROM_EMAIL=test@example.org
DEFAULT_FROM_NAME=Test Sender
DEFAULT_TO_EMAIL=recipient@example.org
DEFAULT_TO_NAME=Test Recipient

# SMS settings (optional - for SMS functionality)
SMS_TO_PHONE=+1234567890
SMS_FROM_PHONE=+0987654321
SMS_MESSAGE=Hello from Mandrill SMS!
SMS_CONSENT_TYPE=onetime
SMS_TRACK_CLICKS=true
```

## 🎯 Features Demonstrated

- ✅ Basic email sending
- ✅ Merge tags and personalization
- ✅ File attachments
- ✅ Inline images
- ✅ Template creation and usage
- ✅ Open and click tracking
- ✅ Custom headers and metadata
- ✅ All Transactional API features
- 📱 SMS messaging

## 📚 Learn More

Each script includes detailed comments and demonstrates specific Transactional API features. Check the individual files for implementation details.

For more information, see the [use-cases documentation](../use-cases/README.md).