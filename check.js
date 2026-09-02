fetch('https://akshayam-sigma.vercel.app/profiles/1020AE')
  .then(r => r.text())
  .then(t => {
    const idx = t.indexOf('og:image" content="');
    const end = t.indexOf('"', idx + 20);
    const url = t.substring(idx + 19, end);
    console.log(url);
  });
