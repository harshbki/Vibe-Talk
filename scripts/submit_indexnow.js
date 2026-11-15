const https = require('https');
const path = require('path');
const publicArticles = require('../client/src/data/publicArticles.json');

const INDEXNOW_KEY = 'a376d7b014cb67dca0e439f4a1d5e026';
const HOST = 'vibetalk.me';

const staticRoutes = [
  'https://vibetalk.me/',
  'https://vibetalk.me/start',
  'https://vibetalk.me/about',
  'https://vibetalk.me/how-it-works',
  'https://vibetalk.me/safety',
  'https://vibetalk.me/community-guidelines',
  'https://vibetalk.me/privacy',
  'https://vibetalk.me/legal',
  'https://vibetalk.me/cookies',
  'https://vibetalk.me/disclaimer',
  'https://vibetalk.me/contact',
  'https://vibetalk.me/articles'
];

const articleRoutes = publicArticles.map(a => `https://vibetalk.me/articles/${a.slug}`);
const urls = [...staticRoutes, ...articleRoutes];

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
  res.on('data', (d) => process.stdout.write(d));
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('\n✅ IndexNow submission successful! Bing & search engines notified.');
    } else {
      console.log('\n⚠️ IndexNow response ended.');
    }
  });
});

req.on('error', (e) => {
  console.error('Error submitting to IndexNow:', e);
});

req.write(payload);
req.end();
