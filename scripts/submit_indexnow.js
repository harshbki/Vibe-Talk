const https = require('https');

const INDEXNOW_KEY = 'a376d7b014cb67dca0e439f4a1d5e026';
const HOST = 'vibetalk.me';

const urls = [
  'https://vibetalk.me/',
  'https://vibetalk.me/start',
  'https://vibetalk.me/about',
  'https://vibetalk.me/how-it-works',
  'https://vibetalk.me/safety',
  'https://vibetalk.me/community-guidelines',
  'https://vibetalk.me/articles',
  'https://vibetalk.me/articles/gen-z-guide-to-low-stakes-stranger-chat',
  'https://vibetalk.me/articles/safe-omegle-alternative-and-video-chat',
  'https://vibetalk.me/articles/free-random-chat-online',
  'https://vibetalk.me/articles/what-is-vibetalk',
  'https://vibetalk.me/articles/safe-random-chat-online-guide',
  'https://vibetalk.me/articles/how-to-make-friends-online-through-chat',
  'https://vibetalk.me/articles/video-chat-tips-for-a-better-online-call',
  'https://vibetalk.me/articles/random-chat-with-strangers-online',
  'https://vibetalk.me/articles/online-group-chat-for-shared-interests',
  'https://vibetalk.me/articles/respectful-chat-with-women-online',
  'https://vibetalk.me/articles/video-chat-with-strangers-safely',
  'https://vibetalk.me/articles/online-chat-rooms-and-interest-groups',
  'https://vibetalk.me/privacy',
  'https://vibetalk.me/legal',
  'https://vibetalk.me/cookies',
  'https://vibetalk.me/contact'
];

const payload = JSON.stringify({
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
  urlList: urls
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log(`Submitting ${urls.length} URLs to IndexNow for ${HOST}...`);

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode} ${res.statusMessage}`);
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('✅ IndexNow submission successful! Bing & search engines notified.');
    } else {
      console.log('Response body:', responseBody || '(empty)');
    }
  });
});

req.on('error', (error) => {
  console.error('Error submitting to IndexNow:', error.message);
});

req.write(payload);
req.end();
