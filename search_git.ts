import https from 'https';

const url = 'https://raw.githubusercontent.com/vedranbrozovic/private-website/main/public/inspiration.json';

https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (resp) => {
  let data = '';
  resp.on('data', (chunk) => data += chunk);
  resp.on('end', () => {
    console.log(data);
  });
});
