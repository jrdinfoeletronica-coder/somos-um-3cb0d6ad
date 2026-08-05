/**
 * Banco de tonalidades dos louvores brasileiros mais tocados.
 * Chave: "titulo|artista" normalizado (sem acento, minusculo).
 * Valor: Tom original da musica.
 */
const WORSHIP_KEYS: Record<string, string> = {
  // Gabriela Rocha
  "lugar secreto|gabriela rocha": "D",
  "me atraiu|gabriela rocha": "A",
  "oceanos|gabriela rocha": "G",
  "eu sei que vou te ver|gabriela rocha": "A",
  "creio que tu es a cura|gabriela rocha": "G",
  "espirito|gabriela rocha": "E",
  "nenhum maior|gabriela rocha": "D",
  "chama de amor|gabriela rocha": "A",
  "promessas|gabriela rocha": "G",
  // Fernandinho
  "teu reino|fernandinho": "D",
  "feliz|fernandinho": "G",
  "fonte de graca|fernandinho": "A",
  "encontrei a paz|fernandinho": "G",
  "uma nova historia|fernandinho": "E",
  "sol da justica|fernandinho": "G",
  "deus aqui|fernandinho": "A",
  "take over|fernandinho": "D",
  // Aline Barros
  "ressuscita-me|aline barros": "Em",
  "ressuscita me|aline barros": "Em",
  "eu sou de ti|aline barros": "G",
  "sao tuas as maos|aline barros": "D",
  "deus cuida de mim|aline barros": "C",
  "tudo posso|aline barros": "G",
  "tudo e possivel|aline barros": "G",
  "o pao da vida|aline barros": "D",
  "rendido estou|aline barros": "E",
  // Diante do Trono
  "agnus dei|diante do trono": "D",
  "enche-me senhor|diante do trono": "G",
  "galileu|diante do trono": "D",
  "tu tens o meu coracao|diante do trono": "A",
  "encontrei a vida|diante do trono": "G",
  "eterno deus|diante do trono": "D",
  "a batalha e do senhor|diante do trono": "G",
  "bondade de deus|diante do trono": "G",
  // Morada
  "grande e o senhor|morada": "G",
  "rei para sempre|morada": "D",
  "pai|morada": "A",
  "firmeza|morada": "E",
  "graca sobre graca|morada": "G",
  "o senhor e meu pastor|morada": "G",
  // Casa Worship
  "a casa e sua|casa worship": "G",
  "pra sempre vou louvar|casa worship": "D",
  "coragem pra lutar|casa worship": "A",
  "sobre ti|casa worship": "E",
  // Isaias Saad
  "ruja o leao|isaias saad": "Am",
  "sou filho teu|isaias saad": "G",
  "deus e deus|isaias saad": "G",
  "graca incomum|isaias saad": "D",
  // Isadora Pompeo
  "vai ser lindo|isadora pompeo": "G",
  "te agradecer|isadora pompeo": "D",
  "vou louvar|isadora pompeo": "A",
  "bem aventurado|isadora pompeo": "G",
  // Kemuel
  "avivamento|kemuel": "G",
  "sobre tudo|kemuel": "D",
  "fiel|kemuel": "A",
  "deus de promessas|kemuel": "G",
  "seu nome e jesus|kemuel": "D",
  // Julia Vitoria
  "de dentro pra fora|julia vitoria": "E",
  "vou adorar|julia vitoria": "G",
  // Voz da Verdade
  "farei o que disseres|voz da verdade": "D",
  "proclamo que o senhor e bom|voz da verdade": "G",
  "como e grande o meu deus|voz da verdade": "G",
  "o escudo|voz da verdade": "G",
  // Samuel Messias
  "todavia me alegrarei|samuel messias": "G",
  "faz chover|samuel messias": "D",
  "dono do universo|samuel messias": "G",
  // Anderson Freire
  "amor que nao tem fim|anderson freire": "G",
  "enquanto houver vida|anderson freire": "D",
  "nao ha lugar mais alto|anderson freire": "G",
  // Nivea Soares
  "jesus tu es o senhor|nivea soares": "G",
  "hino de vitoria|nivea soares": "E",
  // Soraya Moraes
  "caminho no deserto|soraya moraes": "G",
  "eu navegarei|soraya moraes": "D",
  // Thalles Roberto
  "entra nesse barco|thalles roberto": "G",
  "nunca cansa|thalles roberto": "G",
  "tua presenca|thalles roberto": "A",
  // Ministerio Zoe
  "aquieta minh alma|ministerio zoe": "G",
  "aquieta minha alma|ministerio zoe": "G",
  "eterno e o seu amor|ministerio zoe": "G",
  // Bruna Karla
  "incomparavel|bruna karla": "G",
  "hallelujah|bruna karla": "G",
  "aleluia|bruna karla": "G",
  "prometo|bruna karla": "D",
  // Cassiane
  "principe da paz|cassiane": "D",
  "como chama que nao apaga|cassiane": "E",
  // Damares
  "lugar secreto|damares": "D",
  "minha bencao esta no louvor|damares": "G",
  // Eyshila
  "testemunho|eyshila": "G",
  "ele vive|eyshila": "D",
  "tempo de conquistar|eyshila": "G",
  // Regis Danese
  "faz um milagre em mim|regis danese": "G",
  // Fernanda Brum
  "amor e cura|fernanda brum": "G",
  "nao me esquecas|fernanda brum": "D",
  // Toque no Altar
  "deus de alianca|toque no altar": "G",
  "jesus alegria das nacoes|toque no altar": "G",
  // Trazendo a Arca
  "novo tempo|trazendo a arca": "G",
  "marca da promessa|trazendo a arca": "D",
  "ainda que a figueira|trazendo a arca": "G",
  // Theo Rubia
  "pode morar aqui|theo rubia": "G",
  "eterno fiel|theo rubia": "D",
  // Delino Marcal
  "aqui estou|delino marcal": "G",
  "vai chegar|delino marcal": "D",
  // Jefferson e Suellen
  "vem me buscar|jefferson e suellen": "D",
  "clamor|jefferson e suellen": "G",
  // Laura Souguellis
  "em teus bracos|laura souguellis": "D",
  "doce e suave|laura souguellis": "G",
  // Kemilly Santos
  "santo e fiel|kemilly santos": "D",
  "quero ver|kemilly santos": "G",
  // Midian Lima
  "milagre|midian lima": "G",
  "nao pare|midian lima": "G",
  "identidade|midian lima": "D",
  // Fred Arrais
  "tu es bom|fred arrais": "G",
  "eu vi o senhor|fred arrais": "D",
  // Sarah Beatriz
  "chao do ceu|sarah beatriz": "G",
  // Harpa Crista
  "alvo mais que a neve|harpa crista": "G",
  "a mensagem da cruz|harpa crista": "D",
  "foi na cruz|harpa crista": "G",
  "porque ele vive|harpa crista": "G",
  // Adhemar de Campos
  "nosso general|adhemar de campos": "D",
  "o nosso general|adhemar de campos": "D",
  // Renascer Praise
  "minha fonte de descanso|renascer praise": "G",
  "quero mais de ti|renascer praise": "D",
  "1000 graus|renascer praise": "G",
  // Marcelo Markes
  "eu tenho voce|marcelo markes": "G",
  "tudo que tenho|marcelo markes": "D",
  // Asaph Borba
  "fora de mim|asaph borba": "D",
  "nossa cancao de amor|asaph borba": "G",
  // PC Baruk
  "espera|pc baruk": "G",
  "extraordinario|pc baruk": "D",
  // Maria Marcal
  "deus vai honrar|maria marcal": "G",
  // Mara Lima
  "quero que voce me cure|mara lima": "D",
  "espera em deus|mara lima": "G",
  // Shirley Carvalhaes
  "eu sei que amanhece|shirley carvalhaes": "G",
  "tu mereces|shirley carvalhaes": "D",
  // Preto no Branco
  "filho|preto no branco": "G",
  "correndo pra ti|preto no branco": "D",
  // Jamily
  "so eu sei o quanto me custou|jamily": "D",
  "inesquecivel|jamily": "G",
};

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 |]/g, "")
    .trim();

/**
 * Busca a tonalidade de uma musica no banco interno.
 * Retorna o tom se encontrado, ou null caso nao encontre.
 */
export function lookupWorshipKey(title: string, artist: string): string | null {
  const normTitle = normalize(title);
  const normArtist = normalize(artist);

  // 1. Busca exata titulo|artista
  const exactKey = `${normTitle}|${normArtist}`;
  if (WORSHIP_KEYS[exactKey]) return WORSHIP_KEYS[exactKey];

  // 2. Busca parcial: titulo e artista contidos na chave
  for (const [key, tone] of Object.entries(WORSHIP_KEYS)) {
    const [keyTitle, keyArtist] = key.split("|");
    if (!keyArtist) continue;
    const titleMatch = normTitle.includes(keyTitle) || keyTitle.includes(normTitle);
    const artistMatch = normArtist.includes(keyArtist) || keyArtist.includes(normArtist);
    if (titleMatch && artistMatch) return tone;
  }

  // 3. Busca so por titulo (fallback)
  for (const [key, tone] of Object.entries(WORSHIP_KEYS)) {
    const [keyTitle] = key.split("|");
    if (keyTitle && (normTitle === keyTitle || normTitle.includes(keyTitle) || keyTitle.includes(normTitle))) {
      return tone;
    }
  }

  return null;
}
