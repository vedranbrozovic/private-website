const https = require('https');
https.get('https://en.wikipedia.org/wiki/Faculty_of_Economics_and_Business,_University_of_Zagreb', (resp) => {
  let data = '';
  resp.on('data', (chunk) => data += chunk);
  resp.on('end', () => {
    let m = data.match(/<table class="infobox[^>]*>.*?<\/table>/s);
    if(m) console.log(m[0].match(/<img[^>]+src="([^"]+)"/)[1]);
  });
});
