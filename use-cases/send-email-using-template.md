# Send Email Using Stored Template

Send an email using a stored template with `messages.sendTemplate` in the Transactional API. Provide the template name, optional `template_content` (for mc:edit regions), and a standard `message` with recipients and merge data.

## Basic Example

```javascript
require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

async function sendWithTemplate() {
  const templateName = 'hello-template';

  const message = {
    from_email: process.env.DEFAULT_FROM_EMAIL || 'test@example.org',
    from_name: process.env.DEFAULT_FROM_NAME || 'Test Sender',
    subject: 'Welcome, {{fname}}', // Can be overridden even if template has a default
    to: [
      { email: process.env.DEFAULT_TO_EMAIL || 'recipient@example.org', name: process.env.DEFAULT_TO_NAME || 'Test Recipient', type: 'to' }
    ],
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
    tags: ['onboarding', 'welcome']
  };

  // Replace mc:edit regions in template (works with both Handlebars and Mailchimp)
  const templateContent = [
    { 
      name: 'welcome_message', 
      content: '<p>Thanks for joining <strong>{{company_name}}</strong>! We\'re excited to have you on board.</p>' 
    }
  ];

  try {
    const result = await mailchimp.messages.sendTemplate({
      template_name: templateName,
      template_content: templateContent,
      message
    });

    console.log('Template-based emails sent:');
    if (Array.isArray(result)) {
      result.forEach(r => console.log(`   ${r.email}: ${r.status}`));
    } else {
      console.log('Unexpected result structure:', result);
    }
  } catch (error) {
    console.error('Transactional API error:', error.message);
    if (error.response) {
      console.error('API Details:', error.response.data);
    }
  }
}

sendWithTemplate();
```

## Notes

- **Template name**: Use the template’s `name`/slug as shown in the Templates UI or API.
- **Merge language**: Choose `handlebars` or `mailchimp` via `merge_language` per message.
- **Editable regions**: Use `template_content` to replace `mc:edit` regions (only with Mailchimp merge language templates).
- **Overrides**: `subject`, `from_email`, and `from_name` can be overridden at send-time.

## API Mapping

- Send with template: `messages.sendTemplate`
