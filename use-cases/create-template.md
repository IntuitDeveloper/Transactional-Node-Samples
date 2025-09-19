# Create Template

Create a reusable email template in the Transactional API.

```javascript
require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.TRANSACTIONAL_API_KEY);

async function createTemplate() {
  const templateData = {
    name: 'hello-template',
    from_email: process.env.DEFAULT_FROM_EMAIL || 'test@example.org',
    from_name: process.env.DEFAULT_FROM_NAME || 'Test Sender',
    subject: 'Hello {{fname}}!',
    code: `
      <h1>Hello {{fname}}!</h1>
      <div mc:edit="welcome_message">
        <p>Welcome to {{company_name}}.</p>
      </div>
      <p>Your account: {{account_id}}</p>
    `,
    text: `Hello {{fname}}!\n\nWelcome to {{company_name}}.\nYour account: {{account_id}}`,
    publish: false,
    labels: ['hello', 'demo']
  };

  try {
    const response = await mailchimp.templates.add(templateData);
    console.log(`Template created: ${response.name}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('API Details:', error.response.data);
    }
  }
}

createTemplate();
```

## Key Fields

- `name` - Unique template identifier
- `code` - HTML content with merge tags
- `text` - Plain text version
- `subject` - Default subject line
- `from_email`/`from_name` - Default sender
- `publish` - false = draft, true = published
