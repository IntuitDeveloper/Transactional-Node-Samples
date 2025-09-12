# Send Email with Merge Tags (Dynamic Content)

This use case demonstrates how to personalize emails using merge tags for dynamic content like names, order information, and custom data.

## Basic Merge Tags Example

Use merge tags to personalize content for each recipient:

```javascript
require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

const message = {
  html: `
    <h1>Welcome {{fname}}!</h1>
    <p>Hi {{fname}} {{lname}},</p>
    <p>Thanks for joining {{company_name}}! Your account is now active.</p>
    <p>Your membership level: {{membership_level}}</p>
    <p>Best regards,<br>The {{company_name}} Team</p>
  `,
  text: `
    Welcome {{fname}}!
    
    Hi {{fname}} {{lname}},
    
    Thanks for joining {{company_name}}! Your account is now active.
    Your membership level: {{membership_level}}
    
    Best regards,
    The {{company_name}} Team
  `,
  subject: 'Welcome to {{company_name}}, {{fname}}!',
  from_email: 'brad_hudson@intuit.com',
  from_name: 'Brad Hudson',
  to: [{
    email: 'brad_hudson@intuit.com',
    name: 'Brad Hudson',
    type: 'to'
  }],
  headers: {
    'Reply-To': 'brad_hudson@intuit.com'
  },
  // Global merge variables (apply to all recipients)
  global_merge_vars: [
    {
      name: 'company_name',
      content: 'Intuit Developer Program'
    },
    {
      name: 'membership_level',
      content: 'Premium' // Default value
    }
  ],
  // Recipient-specific merge variables
  merge_vars: [
    {
      rcpt: 'john@example.org',
      vars: [
        {
          name: 'fname',
          content: 'John'
        },
        {
          name: 'lname', 
          content: 'Smith'
        }
      ]
    },
    {
      rcpt: 'jane@example.org',
      vars: [
        {
          name: 'fname',
          content: 'Jane'
        },
        {
          name: 'lname',
          content: 'Doe'
        },
        {
          name: 'membership_level',
          content: 'Enterprise' // Overrides global value
        }
      ]
    }
  ],
  merge_language: 'handlebars' // or 'mailchimp'
};

async function sendPersonalizedEmail() {
  try {
    const result = await mailchimp.messages.send({ message });
    console.log('Personalized emails sent:');
    // console.log('Full result:', JSON.stringify(result, null, 2));
    
    if (Array.isArray(result)) {
      result.forEach((recipient) => {
        console.log(`${recipient.email}: ${recipient.status}`);
      });
    } else {
      console.log('Unexpected result structure:', result);
    }
  } catch (error) {
    console.error('Mandrill error:', error.message);
    if (error.response) {
      // console.error('Error response:', error.response.data);
    }
  }
}

sendPersonalizedEmail();
```

## Merge Language Options

| Language | Syntax | Example | Use Case |
|---|---|---|---|
| handlebars | {{variable}} | Hello {{name}}! | Complex logic, loops, conditionals |
| mailchimp | `*|VARIABLE|*` | Hello *|NAME|*! | Simple substitutions, legacy compatibility |

## Key Features

| Feature | Description | Example |
|---|---|---|
| Global Merge Vars | Apply to all recipients | Company name, promotion details |
| Recipient Merge Vars | Specific to each recipient | Personal names, order details |
| Merge Language | Choose syntax style | handlebars or mailchimp |
| Complex Data | Arrays and objects | Order items, address objects |
| Fallback Values | Default when data missing | {{name 'Customer'}} |

## Notes

- **Merge Tag Format**: Use alphanumeric characters and underscores only (no colons)
- **Content Length**: Generally unlimited for API usage
- **Global vs Recipient**: Global vars apply to all; recipient vars are specific to each email
- **Language Setting**: Can be set globally in account or per-message via `merge_language`
- **Handlebars Benefits**: Supports loops, conditionals, and complex logic
- **Template Conversion**: Mailchimp templates auto-convert to Handlebars when imported
- **Error Handling**: Always handle cases where merge data might be missing
