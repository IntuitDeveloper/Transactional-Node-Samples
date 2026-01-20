/**
 * Send an SMS to a Single Recipient using Mandrill API
 *
 * This script demonstrates how to send an SMS message to a single recipient
 * using the Mailchimp Transactional (Mandrill) API.
 *
 * Usage:
 *     node sms_single_recipient.js
 *
 * Note: SMS functionality uses the Mandrill REST API v1.1 directly since the
 * Node.js SDK doesn't include the send_sms method yet.
 */

require('dotenv').config();
const https = require('https');

// SMS API endpoint (note: uses API version 1.1, not 1.0)
const SMS_API_ENDPOINT = 'https://mandrillapp.com/api/1.1/messages/send-sms';

/**
 * Send an SMS message using the Mandrill API.
 *
 * @param {Object} options - SMS options
 * @param {string} options.to - Recipient phone number in E.164 format (e.g., +1234567890)
 * @param {string} options.from - Sender phone number (must be verified in Mandrill)
 * @param {string} options.text - SMS message content (max 1600 characters)
 * @param {string} options.consent - Consent type ('onetime', 'recurring', 'recurring-no-confirm')
 * @param {boolean} options.trackClicks - Whether to track link clicks in the message
 * @returns {Promise<Object|null>} API response on success, null on failure
 */
async function sendSms(options = {}) {
  const apiKey = process.env.TRANSACTIONAL_API_KEY;

  if (!apiKey) {
    console.log('Error: TRANSACTIONAL_API_KEY not found in environment variables!');
    console.log('Please create a .env file with your Transactional API key.');
    return null;
  }

  // Build the SMS message payload with defaults from environment
  const toPhone = options.to || process.env.SMS_TO_PHONE || '+1234567890';
  const fromPhone = options.from || process.env.SMS_FROM_PHONE || '+0987654321';
  const messageText = options.text || process.env.SMS_MESSAGE || 'Hello from Mandrill SMS! This is a test message.';
  const consentType = options.consent || process.env.SMS_CONSENT_TYPE || 'onetime';
  const trackClicks = options.trackClicks !== undefined 
    ? options.trackClicks 
    : (process.env.SMS_TRACK_CLICKS === 'true');

  const payload = {
    key: apiKey,
    message: {
      sms: {
        text: messageText,
        to: toPhone,
        from: fromPhone,
        consent: consentType,
        track_clicks: trackClicks
      }
    }
  };

  return new Promise((resolve) => {
    const url = new URL(SMS_API_ENDPOINT);
    const postData = JSON.stringify(payload);

    const requestOptions = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('SMS Request sent!');
    console.log('='.repeat(50));

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log('SMS sent successfully!');
            console.log('Response:', JSON.stringify(result, null, 2));

            // Display key details from the response
            if (Array.isArray(result) && result.length > 0) {
              const firstResult = result[0];
              console.log('\nDetails:');
              if (firstResult.status) {
                console.log(`  Status: ${firstResult.status}`);
              }
              if (firstResult.to) {
                console.log(`  To: ${firstResult.to}`);
              }
              if (firstResult._id) {
                console.log(`  Message ID: ${firstResult._id}`);
              }
              if (firstResult.reject_reason) {
                console.log(`  Reject Reason: ${firstResult.reject_reason}`);
              }
            } else if (typeof result === 'object') {
              if (result.status) {
                console.log(`  Status: ${result.status}`);
              }
              if (result._id) {
                console.log(`  Message ID: ${result._id}`);
              }
            }

            console.log('='.repeat(50));
            resolve(result);
          } catch (parseError) {
            console.log('Error parsing response:', parseError.message);
            console.log('Raw response:', data);
            console.log('='.repeat(50));
            resolve(null);
          }
        } else {
          let errorBody;
          try {
            errorBody = JSON.parse(data);
          } catch {
            errorBody = data;
          }

          console.log('SMS sending failed!');
          console.log(`HTTP Status: ${res.statusCode}`);
          if (typeof errorBody === 'object') {
            console.log('Error:', JSON.stringify(errorBody, null, 2));
          } else {
            console.log('Error:', errorBody);
          }
          console.log('='.repeat(50));
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.log('Error sending SMS!');
      console.log('='.repeat(50));
      console.log('Error:', error.message);
      
      if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || 
          error.code === 'CERT_HAS_EXPIRED' ||
          error.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
        console.log('');
        console.log("💡 TIP: If you're behind a corporate proxy, you may need to set:");
        console.log('   NODE_TLS_REJECT_UNAUTHORIZED=0');
      }
      
      console.log('='.repeat(50));
      resolve(null);
    });

    req.setTimeout(30000, () => {
      console.log('Request Timeout!');
      console.log('='.repeat(50));
      console.log('The request timed out after 30 seconds.');
      console.log('='.repeat(50));
      req.destroy();
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Send an SMS with comprehensive error handling.
 *
 * @param {string} toPhone - Recipient phone number in E.164 format
 * @param {string} fromPhone - Sender phone number
 * @param {string} messageText - SMS message content
 * @param {string} consentType - Type of consent (default: 'onetime')
 * @returns {Promise<Object>} Result with 'success' boolean and 'data' or 'error' key
 */
async function sendSmsWithErrorHandling(toPhone, fromPhone, messageText, consentType = 'onetime') {
  const result = await sendSms({
    to: toPhone,
    from: fromPhone,
    text: messageText,
    consent: consentType
  });

  if (result) {
    if (Array.isArray(result) && result.length > 0 && result[0].status === 'rejected') {
      return { 
        success: false, 
        error: `Rejected: ${result[0].reject_reason || 'Unknown reason'}` 
      };
    }
    return { success: true, data: result };
  }

  return { success: false, error: 'Failed to send SMS' };
}

// Main execution
async function main() {
  // Check if API key is configured
  if (!process.env.TRANSACTIONAL_API_KEY) {
    console.log('Error: TRANSACTIONAL_API_KEY not found in environment variables!');
    console.log('Please create a .env file with your Transactional API key.');
    process.exit(1);
  }

  console.log('📱 Sending SMS...');
  console.log('');

  const result = await sendSms();

  if (result) {
    console.log('\n✅ SMS operation completed!');
  } else {
    console.log('\n❌ SMS operation failed!');
    process.exit(1);
  }
}

// Run if executed directly
main();

// Export for use as a module
module.exports = { sendSms, sendSmsWithErrorHandling };

