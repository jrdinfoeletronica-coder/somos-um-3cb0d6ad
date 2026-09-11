const query = encodeURIComponent('site:youtube.com gabriela rocha audio');
const searchUrl = 'https://html.duckduckgo.com/html/?q=' + query;
const proxyUrl = 'https://corsproxy.io/?url=' + encodeURIComponent(searchUrl);
fetch(proxyUrl)
  .then(r => r.text())
  .then(html => {
    const match = html.match(/href="[^"]*youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
    console.log('DDG ID:', match ? match[1] : 'Not found');
  })
  .catch(console.error);
