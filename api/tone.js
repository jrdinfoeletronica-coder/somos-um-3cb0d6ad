export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { artist, title } = req.query;

  if (!artist || !title) {
    return res.status(400).json({ error: 'Missing artist or title' });
  }

  const slugify = (str) => {
    return str.toString().toLowerCase().trim()
      .replace(/[áàãâä]/g, 'a')
      .replace(/[éèẽêë]/g, 'e')
      .replace(/[íìĩîï]/g, 'i')
      .replace(/[óòõôö]/g, 'o')
      .replace(/[úùũûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[\s\W-]+/g, '-');
  };

  const mainArtist = (artist || "").split(/&|feat|ft\.|,|\b-\b|\be\b/i)[0].trim();
  const aSlug = slugify(mainArtist);
  const tSlug = slugify(title).replace(/^(o|a|os|as)-/i, "");

  const url = `https://www.cifraclub.com.br/${aSlug}/${tSlug}/`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'Not found on Cifra Club' });
    }

    const html = await response.text();

    const match1 = html.match(/data-anchor="--chord-tone"[^>]*>([A-G][#b]?m?)</i);
    const match2 = html.match(/id="js-c-key"[^>]*>([A-G][#b]?m?)</i);
    const match3 = html.match(/Tom[\s\S]{0,150}?>\s*([A-G][#b]?m?)\s*</i);

    let key = null;
    if (match1) key = match1[1];
    else if (match2) key = match2[1];
    else if (match3) key = match3[1];

    if (key) {
      return res.status(200).json({ key, source: 'cifraclub' });
    }

    return res.status(404).json({ error: 'Key not found in HTML' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
