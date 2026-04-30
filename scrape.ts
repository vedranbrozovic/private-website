import https from 'https';
https.get('https://en.wikipedia.org/wiki/Faculty_of_Economics_and_Business,_University_of_Zagreb', (resp) => {
  let data = '';
  resp.on('data', (chunk) => data += chunk);
  resp.on('end', () => {
    let m = data.match(/<img[^>]+src="([^"]+)"/g);
    if(m) {
      m.forEach(i => console.log(i));
    }
  });
});
