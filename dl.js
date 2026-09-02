const fs = require('fs');
fetch('https://akshayam-sigma.vercel.app/profiles/1020AE')
  .then(r => r.text())
  .then(t => {
    const idx = t.indexOf('og:image" content="');
    const end = t.indexOf('"', idx + 20);
    const url = t.substring(idx + 19, end);
    console.log(url);
    return fetch(url);
  })
  .then(r => r.arrayBuffer())
  .then(b => {
    fs.writeFileSync('lakshana.jpg', Buffer.from(b));
    let i = 0;
    const data = Buffer.from(b);
    while (i < data.length) {
      if (data[i] == 0xFF && data[i+1] == 0xC0) {
        const h = data.readUInt16BE(i+5);
        const w = data.readUInt16BE(i+7);
        console.log(w, h);
        break;
      }
      i++;
    }
  });
