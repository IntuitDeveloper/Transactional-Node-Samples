# Send Email Using Stored Template

Send an email using a stored template with `messages.sendTemplate`. Provide the template name, optional `template_content` (for mc:edit regions), and a standard `message` with recipients and merge data.

## Basic Example

```javascript
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

async function sendWithTemplate() {
  const templateName = 'welcome-template-v2';

  const message = {
    from_email: 'no-reply@example.org',
    from_name: 'Example Inc.',
    subject: 'Welcome, {{fname}}', // Can be overridden even if template has a default
    to: [
      { email: 'john@example.org', name: 'John Smith', type: 'to' },
      { email: 'jane@example.org', name: 'Jane Doe', type: 'to' }
    ],
    global_merge_vars: [
      { name: 'company_name', content: 'Example Inc.' }
    ],
    merge_vars: [
      { rcpt: 'john@example.org', vars: [ { name: 'fname', content: 'John' } ] },
      { rcpt: 'jane@example.org', vars: [ { name: 'fname', content: 'Jane' } ] }
    ],
    merge_language: 'handlebars',
    tags: ['onboarding', 'welcome']
  };

  // Optional: replace mc:edit regions in template (Mailchimp merge language only)
  const templateContent = [
    // { name: 'header', content: '<h2>Welcome Header</h2>' },
    // { name: 'main', content: 'Thanks for joining us.' }
  ];

  try {
    const result = await mailchimp.messages.sendTemplate({
      template_name: templateName,
      template_content: templateContent,
      message
    });

    console.log('Template-based emails sent:');
    result.forEach(r => console.log(`${r.email}: ${r.status}`));
  } catch (error) {
    console.error('Mandrill error:', error.message);
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
