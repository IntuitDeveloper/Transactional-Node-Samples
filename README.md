# Mandrill Node.js Use Cases

[![npm version](https://img.shields.io/npm/v/@mailchimp/mailchimp_transactional.svg)](https://www.npmjs.com/package/@mailchimp/mailchimp_transactional)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/example/mandrill-use-cases/blob/master/LICENSE)

**Comprehensive Node.js examples for the Mandrill API**

This repository provides examples for specific Mandrill API use cases using Node.js. These examples demonstrate how to implement Mandrill email functionality effectively.

## 📧 Documentation Examples

All examples are available as documentation in the `/use-cases/` directory. Each use case includes complete code examples you can copy and run.

If you need support using Mandrill, please check the [Mandrill API Documentation](https://docs.mailchimp.com/api/mandrill/).

## Table of Contents

- [Getting Started](#getting-started)
- [Use Cases](#use-cases)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Getting Started

### Prerequisites

- A Mandrill API key

### Installation

1. **Clone this repository**
   ```bash
   git clone git@github.com:IntuitDeveloper/Transactional-Node-Samples.git
   cd Transactional-Node-Samples
   ```

2. **Install dependencies in the scripts folder:**
   ```bash
   cd scripts
   npm install
   ```

3. **Add your API key and email addresses to your .env file**
   ```bash
   MANDRILL_API_KEY='your-mandrill-api-key-here'
   DEFAULT_FROM_EMAIL='your-email@example.com'
   DEFAULT_FROM_NAME='Your Name'
   DEFAULT_TO_EMAIL='recipient@example.com'
   DEFAULT_TO_NAME='Recipient Name'
   ```

4. **Run a script from the scripts folder**
   ```bash
   node email_with_single_recipient.js
   ```

## Use Cases

**Basic Email Sending:**
- [Send a Single Email to a Single Recipient](./use-cases/send-single-email-single-recipient.md)

**Advanced Features:**
- [Send Email with Merge Tags](./use-cases/send-email-with-merge-tags.md)
- [Send Email with Attachments](./use-cases/send-email-with-attachments.md)
- [Create Email Template](./use-cases/create-template.md)
- [Send Email Using Template](./use-cases/send-email-using-template.md)
- [Kitchen Sink - All Features](./use-cases/kitchen-sink.md)



## API Features

### Core Capabilities

| Feature | Mandrill Implementation |
|---------|-------------------------|
| **Library** | `@mailchimp/mailchimp_transactional` |
| **Recipients** | `to: [{email: 'email@example.org', type: 'to'}]` |
| **Sender** | `from_email: 'email@example.org'` |
| **Multiple Recipients** | `preserve_recipients: false` |
| **Substitutions** | `*|VARIABLE|*` |
| **Categories** | `tags: ['tag']` |

### Implementation Checklist

- [ ] Install `@mailchimp/mailchimp_transactional` package
- [ ] Configure API key
- [ ] Set up message structure (recipients, sender format)
- [ ] Implement error handling with try/catch
- [ ] Configure substitution variables syntax
- [ ] Test email delivery and tracking
- [ ] Set up monitoring and analytics

## Troubleshooting

### Common Issues

- **Authentication Errors**: Verify your API key is correct and active
- **Email Rejections**: Check email format and domain reputation
- **Rate Limiting**: Implement delays between API calls for bulk sending
- **Template Errors**: Verify template names and merge variable syntax

### Getting Help

- Check the [Mandrill API Documentation](https://docs.mailchimp.com/api/mandrill/)
- Contact [Mandrill Support](https://mailchimp.com/help/)

## Best Practices

1. **Error Handling**: Always implement proper error handling
2. **Rate Limiting**: Respect API limits to avoid throttling
3. **Email Validation**: Validate email addresses before sending
4. **Content Quality**: Follow email best practices for deliverability
5. **Monitoring**: Track delivery rates and bounces
6. **Security**: Keep API keys secure and use environment variables
7. **Testing**: Test emails in development before production

### Support

For Mandrill API support, please contact [Mailchimp Support](https://mailchimp.com/help/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
