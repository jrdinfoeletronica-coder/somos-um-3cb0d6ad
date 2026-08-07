/**
 * Banco de tonalidades dos louvores brasileiros/gospel mais tocados.
 * Chave: "titulo|artista" normalizado (sem acento, minusculo).
 * Valor: Tom original da musica.
 */
const WORSHIP_KEYS: Record<string, string> = {
  // ═══════════════════════════════════════════════
  // GABRIELA ROCHA
  // ═══════════════════════════════════════════════
  "lugar secreto|gabriela rocha": "D",
  "me atraiu|gabriela rocha": "A",
  "oceanos|gabriela rocha": "G",
  "espirito|gabriela rocha": "E",
  "nenhum maior|gabriela rocha": "D",
  "chama de amor|gabriela rocha": "A",
  "promessas|gabriela rocha": "G",
  "creio que tu es a cura|gabriela rocha": "G",
  "eu sei que vou te ver|gabriela rocha": "A",
  "quao grande es tu|gabriela rocha": "G",
  "amo-te senhor|gabriela rocha": "G",
  "cristo basta|gabriela rocha": "D",
  "fala que eu te escuto|gabriela rocha": "G",
  "salvador|gabriela rocha": "A",
  "rendido|gabriela rocha": "D",
  "enche minha vida|gabriela rocha": "G",
  "nao ha outro|gabriela rocha": "D",
  "rei eterno|gabriela rocha": "G",
  "presenca|gabriela rocha": "A",
  "luz da manha|gabriela rocha": "D",

  // ═══════════════════════════════════════════════
  // FERNANDINHO
  // ═══════════════════════════════════════════════
  "teu reino|fernandinho": "D",
  "feliz|fernandinho": "G",
  "fonte de graca|fernandinho": "A",
  "encontrei a paz|fernandinho": "G",
  "uma nova historia|fernandinho": "E",
  "sol da justica|fernandinho": "G",
  "deus aqui|fernandinho": "A",
  "take over|fernandinho": "D",
  "mais que vencedor|fernandinho": "G",
  "so tu|fernandinho": "D",
  "vai tudo bem|fernandinho": "G",
  "reina em mim|fernandinho": "D",
  "ele reina|fernandinho": "G",
  "como aguia|fernandinho": "D",
  "deus e deus|fernandinho": "G",
  "consagracao|fernandinho": "E",
  "teu nome e poderoso|fernandinho": "G",
  "lugar secreto|fernandinho": "D",
  "fiel|fernandinho": "A",
  "minha cancao|fernandinho": "G",
  "mais de ti|fernandinho": "D",
  "perfume|fernandinho": "G",
  "nossa cancao|fernandinho": "D",
  "o eterno deus|fernandinho": "G",
  "somos filhos|fernandinho": "D",
  "toda forma de amor|fernandinho": "G",

  // ═══════════════════════════════════════════════
  // ALINE BARROS
  // ═══════════════════════════════════════════════
  "ressuscita-me|aline barros": "Em",
  "ressuscita me|aline barros": "Em",
  "eu sou de ti|aline barros": "G",
  "sao tuas as maos|aline barros": "D",
  "deus cuida de mim|aline barros": "C",
  "tudo posso|aline barros": "G",
  "tudo e possivel|aline barros": "G",
  "o pao da vida|aline barros": "D",
  "rendido estou|aline barros": "E",
  "sobre a pedra|aline barros": "D",
  "nada alem de ti|aline barros": "G",
  "minha heranca|aline barros": "G",
  "agir de deus|aline barros": "G",
  "eu te amo|aline barros": "D",
  "rei dos reis|aline barros": "D",
  "por amor|aline barros": "G",
  "quero adorar|aline barros": "G",
  "amor e cura|aline barros": "G",
  "me deste a vitoria|aline barros": "D",
  "senhor te louvo|aline barros": "G",

  // ═══════════════════════════════════════════════
  // DIANTE DO TRONO / ANA PAULA VALADAO
  // ═══════════════════════════════════════════════
  "agnus dei|diante do trono": "D",
  "enche-me senhor|diante do trono": "G",
  "galileu|diante do trono": "D",
  "tu tens o meu coracao|diante do trono": "A",
  "encontrei a vida|diante do trono": "G",
  "eterno deus|diante do trono": "D",
  "a batalha e do senhor|diante do trono": "G",
  "bondade de deus|diante do trono": "G",
  "eis-me aqui|diante do trono": "D",
  "deus de promessas|diante do trono": "G",
  "hosana|diante do trono": "G",
  "o deus|diante do trono": "D",
  "quao profundo|diante do trono": "G",
  "santo|diante do trono": "D",
  "teu amor e melhor|diante do trono": "G",
  "vento de deus|diante do trono": "D",
  "nao cansarei|diante do trono": "G",
  "o sangue|diante do trono": "D",
  "deus de maravilhas|diante do trono": "G",
  "sou feliz|diante do trono": "D",
  "nao e o fim|diante do trono": "G",
  "sobre ti|diante do trono": "D",
  "em espirito e em verdade|diante do trono": "G",
  "hosana rei|diante do trono": "D",
  "minha graca|diante do trono": "G",

  // ═══════════════════════════════════════════════
  // MORADA
  // ═══════════════════════════════════════════════
  "grande e o senhor|morada": "G",
  "rei para sempre|morada": "D",
  "pai|morada": "A",
  "firmeza|morada": "E",
  "graca sobre graca|morada": "G",
  "o senhor e meu pastor|morada": "G",
  "ninguem como tu|morada": "D",
  "deus em mim|morada": "G",
  "meu refugio|morada": "D",
  "com todo o meu ser|morada": "G",
  "so de ti|morada": "A",
  "mais que tudo|morada": "D",
  "ainda que o mundo|morada": "G",
  "espera|morada": "D",
  "deus imutavel|morada": "G",
  "forte rocha|morada": "D",
  "te louvarei|morada": "G",

  // ═══════════════════════════════════════════════
  // CASA WORSHIP
  // ═══════════════════════════════════════════════
  "a casa e sua|casa worship": "G",
  "pra sempre vou louvar|casa worship": "D",
  "coragem pra lutar|casa worship": "A",
  "sobre ti|casa worship": "E",
  "minha esperanca|casa worship": "G",
  "vem senhor|casa worship": "D",
  "aviva-me|casa worship": "G",
  "santo es tu|casa worship": "D",
  "teu amor permanece|casa worship": "G",
  "fogo de pentecostes|casa worship": "D",
  "deus poderoso|casa worship": "G",

  // ═══════════════════════════════════════════════
  // ISAIAS SAAD
  // ═══════════════════════════════════════════════
  "ruja o leao|isaias saad": "Am",
  "sou filho teu|isaias saad": "G",
  "deus e deus|isaias saad": "G",
  "graca incomum|isaias saad": "D",
  "altitude|isaias saad": "D",
  "filho do pai|isaias saad": "G",
  "paz|isaias saad": "A",
  "restauracao|isaias saad": "G",
  "confianca|isaias saad": "D",
  "todo o meu louvor|isaias saad": "G",
  "vitoria|isaias saad": "D",
  "espirito de deus|isaias saad": "G",
  "faz um milagre|isaias saad": "G",

  // ═══════════════════════════════════════════════
  // ISADORA POMPEO
  // ═══════════════════════════════════════════════
  "vai ser lindo|isadora pompeo": "G",
  "te agradecer|isadora pompeo": "D",
  "vou louvar|isadora pompeo": "A",
  "bem aventurado|isadora pompeo": "G",
  "extraordinario|isadora pompeo": "D",
  "me leva|isadora pompeo": "G",
  "acredito|isadora pompeo": "D",
  "tudo faz sentido|isadora pompeo": "G",
  "o amor de cristo|isadora pompeo": "D",
  "vida plena|isadora pompeo": "G",

  // ═══════════════════════════════════════════════
  // KEMUEL
  // ═══════════════════════════════════════════════
  "avivamento|kemuel": "G",
  "sobre tudo|kemuel": "D",
  "fiel|kemuel": "A",
  "deus de promessas|kemuel": "G",
  "seu nome e jesus|kemuel": "D",
  "te louvamos|kemuel": "G",
  "milagre|kemuel": "D",
  "bondade|kemuel": "G",
  "encontro marcado|kemuel": "A",
  "teu poder|kemuel": "D",
  "hosana|kemuel": "G",
  "como tu|kemuel": "D",
  "digno|kemuel": "G",

  // ═══════════════════════════════════════════════
  // JULIA VITORIA
  // ═══════════════════════════════════════════════
  "de dentro pra fora|julia vitoria": "E",
  "vou adorar|julia vitoria": "G",
  "louvado seja|julia vitoria": "D",
  "tua presenca|julia vitoria": "G",
  "eu e deus|julia vitoria": "A",
  "nao ha amor maior|julia vitoria": "G",
  "chama viva|julia vitoria": "D",
  "para sempre|julia vitoria": "G",

  // ═══════════════════════════════════════════════
  // ANDERSON FREIRE
  // ═══════════════════════════════════════════════
  "amor que nao tem fim|anderson freire": "G",
  "enquanto houver vida|anderson freire": "D",
  "nao ha lugar mais alto|anderson freire": "G",
  "o teu plano|anderson freire": "D",
  "enfrento o gigante|anderson freire": "G",
  "firmeza|anderson freire": "E",
  "te louvarei|anderson freire": "G",
  "meu fiel|anderson freire": "D",
  "te encontrei|anderson freire": "G",
  "me rendo|anderson freire": "D",
  "eterno e fiel|anderson freire": "G",
  "apaixonado|anderson freire": "D",
  "sou feliz|anderson freire": "G",
  "deus nao falha|anderson freire": "D",

  // ═══════════════════════════════════════════════
  // VOZ DA VERDADE
  // ═══════════════════════════════════════════════
  "farei o que disseres|voz da verdade": "D",
  "proclamo que o senhor e bom|voz da verdade": "G",
  "como e grande o meu deus|voz da verdade": "G",
  "o escudo|voz da verdade": "G",
  "vou chegar ao trono|voz da verdade": "D",
  "deus vai usar|voz da verdade": "G",
  "valeu a pena|voz da verdade": "D",
  "seja feita a tua vontade|voz da verdade": "G",
  "o deus que vale|voz da verdade": "D",
  "nao ha deus|voz da verdade": "G",
  "deixa o senhor|voz da verdade": "D",
  "teu poder|voz da verdade": "G",
  "cuida de mim|voz da verdade": "D",

  // ═══════════════════════════════════════════════
  // SAMUEL MESSIAS
  // ═══════════════════════════════════════════════
  "todavia me alegrarei|samuel messias": "G",
  "faz chover|samuel messias": "D",
  "dono do universo|samuel messias": "G",
  "sopro|samuel messias": "D",
  "esperanca|samuel messias": "G",
  "nao desistirei|samuel messias": "D",
  "vai e vem|samuel messias": "G",
  "tua fidelidade|samuel messias": "D",
  "meu refugio|samuel messias": "G",

  // ═══════════════════════════════════════════════
  // BRUNA KARLA
  // ═══════════════════════════════════════════════
  "incomparavel|bruna karla": "G",
  "hallelujah|bruna karla": "G",
  "prometo|bruna karla": "D",
  "o deus que faz chover|bruna karla": "G",
  "teu amor|bruna karla": "D",
  "meu vencedor|bruna karla": "G",
  "creio|bruna karla": "D",
  "hosana|bruna karla": "G",
  "preciso de ti|bruna karla": "D",
  "mais do teu espirito|bruna karla": "G",
  "esperanca|bruna karla": "D",
  "confio|bruna karla": "G",
  "o senhor e bom|bruna karla": "D",

  // ═══════════════════════════════════════════════
  // THEO RUBIA
  // ═══════════════════════════════════════════════
  "pode morar aqui|theo rubia": "G",
  "eterno fiel|theo rubia": "D",
  "sorri|theo rubia": "G",
  "acesse|theo rubia": "D",
  "tu es fiel|theo rubia": "G",
  "nunca vou parar|theo rubia": "D",
  "de bem com a vida|theo rubia": "G",
  "senhor da minha vida|theo rubia": "D",

  // ═══════════════════════════════════════════════
  // SORAYA MORAES
  // ═══════════════════════════════════════════════
  "caminho no deserto|soraya moraes": "G",
  "eu navegarei|soraya moraes": "D",
  "pra sempre|soraya moraes": "G",
  "fe total|soraya moraes": "D",
  "tua graca|soraya moraes": "G",
  "hallelujah|soraya moraes": "D",

  // ═══════════════════════════════════════════════
  // THALLES ROBERTO
  // ═══════════════════════════════════════════════
  "entra nesse barco|thalles roberto": "G",
  "nunca cansa|thalles roberto": "G",
  "tua presenca|thalles roberto": "A",
  "ha uma fonte|thalles roberto": "G",
  "ele nunca falhou|thalles roberto": "D",
  "sorri|thalles roberto": "G",
  "favor de deus|thalles roberto": "D",
  "ainda acredito|thalles roberto": "G",
  "coracao apaixonado|thalles roberto": "D",

  // ═══════════════════════════════════════════════
  // MINISTERIO ZOE
  // ═══════════════════════════════════════════════
  "aquieta minh alma|ministerio zoe": "G",
  "aquieta minha alma|ministerio zoe": "G",
  "eterno e o seu amor|ministerio zoe": "G",
  "vem senhor jesus|ministerio zoe": "D",
  "descansa|ministerio zoe": "G",
  "tudo|ministerio zoe": "D",
  "deus de maravilhas|ministerio zoe": "G",
  "ele reina|ministerio zoe": "D",
  "hosana|ministerio zoe": "G",

  // ═══════════════════════════════════════════════
  // NIVEA SOARES
  // ═══════════════════════════════════════════════
  "jesus tu es o senhor|nivea soares": "G",
  "hino de vitoria|nivea soares": "E",
  "tu es santo|nivea soares": "G",
  "tua graca|nivea soares": "D",
  "gloria|nivea soares": "G",
  "eu me rendo|nivea soares": "D",
  "minha fonte|nivea soares": "G",
  "ao som do louvor|nivea soares": "D",
  "adorar-te|nivea soares": "G",
  "deus de israel|nivea soares": "D",
  "por amor|nivea soares": "G",

  // ═══════════════════════════════════════════════
  // EYSHILA
  // ═══════════════════════════════════════════════
  "testemunho|eyshila": "G",
  "ele vive|eyshila": "D",
  "tempo de conquistar|eyshila": "G",
  "fe amor e adoracao|eyshila": "D",
  "identidade|eyshila": "G",
  "o sangue ainda fala|eyshila": "D",
  "nao temas|eyshila": "G",
  "rende-te|eyshila": "D",

  // ═══════════════════════════════════════════════
  // REGIS DANESE
  // ═══════════════════════════════════════════════
  "faz um milagre em mim|regis danese": "G",
  "chega de mimimi|regis danese": "E",
  "desperta adorador|regis danese": "G",
  "filho de deus|regis danese": "D",
  "tua presenca|regis danese": "G",
  "refresca-me|regis danese": "D",

  // ═══════════════════════════════════════════════
  // MARIA MARCAL
  // ═══════════════════════════════════════════════
  "deus vai honrar|maria marcal": "G",
  "volta pra mim|maria marcal": "D",
  "de graca|maria marcal": "G",
  "estou com ti|maria marcal": "D",
  "o milagre|maria marcal": "G",
  "nome poderoso|maria marcal": "D",
  "quem e como tu|maria marcal": "G",

  // ═══════════════════════════════════════════════
  // FRED ARRAIS
  // ═══════════════════════════════════════════════
  "tu es bom|fred arrais": "G",
  "eu vi o senhor|fred arrais": "D",
  "salmo 23|fred arrais": "G",
  "serei fiel|fred arrais": "D",
  "yeshua|fred arrais": "G",
  "nao desistirei|fred arrais": "D",
  "tua presenca|fred arrais": "G",
  "eterno|fred arrais": "D",

  // ═══════════════════════════════════════════════
  // DELINO MARCAL
  // ═══════════════════════════════════════════════
  "aqui estou|delino marcal": "G",
  "vai chegar|delino marcal": "D",
  "me segura|delino marcal": "G",
  "faz de mim|delino marcal": "D",
  "deus e deus|delino marcal": "G",
  "o deus que me ve|delino marcal": "D",
  "tua bondade|delino marcal": "G",
  "nao ha outro deus|delino marcal": "D",
  "alegria|delino marcal": "G",

  // ═══════════════════════════════════════════════
  // LAURA SOUGUELLIS
  // ═══════════════════════════════════════════════
  "em teus bracos|laura souguellis": "D",
  "doce e suave|laura souguellis": "G",
  "amor incondicional|laura souguellis": "D",
  "toda gloria|laura souguellis": "G",
  "me guia|laura souguellis": "D",
  "so tu es fiel|laura souguellis": "G",

  // ═══════════════════════════════════════════════
  // KEMILLY SANTOS
  // ═══════════════════════════════════════════════
  "santo e fiel|kemilly santos": "D",
  "quero ver|kemilly santos": "G",
  "faz chover|kemilly santos": "G",
  "porque tu es bom|kemilly santos": "D",
  "eterno deus|kemilly santos": "G",
  "graca|kemilly santos": "D",
  "hosana|kemilly santos": "G",
  "deus de alianca|kemilly santos": "D",
  "espirito de deus|kemilly santos": "G",

  // ═══════════════════════════════════════════════
  // JEFFERSON E SUELLEN
  // ═══════════════════════════════════════════════
  "vem me buscar|jefferson e suellen": "D",
  "clamor|jefferson e suellen": "G",
  "pai eterno|jefferson e suellen": "D",
  "forte e poderoso|jefferson e suellen": "G",
  "o amor de deus|jefferson e suellen": "D",
  "quero mais|jefferson e suellen": "G",

  // ═══════════════════════════════════════════════
  // SARAH BEATRIZ
  // ═══════════════════════════════════════════════
  "chao do ceu|sarah beatriz": "G",
  "milagre|sarah beatriz": "D",
  "fiel|sarah beatriz": "G",
  "deus es fiel|sarah beatriz": "D",
  "todo meu|sarah beatriz": "G",
  "graca sem fim|sarah beatriz": "D",

  // ═══════════════════════════════════════════════
  // MIDIAN LIMA
  // ═══════════════════════════════════════════════
  "milagre|midian lima": "G",
  "nao pare|midian lima": "G",
  "identidade|midian lima": "D",
  "lugar alto|midian lima": "G",
  "com os seus|midian lima": "D",
  "esperanca real|midian lima": "G",
  "te agradecer|midian lima": "D",

  // ═══════════════════════════════════════════════
  // CASSIANE
  // ═══════════════════════════════════════════════
  "principe da paz|cassiane": "D",
  "como chama que nao apaga|cassiane": "E",
  "faz um milagre|cassiane": "G",
  "pra ti|cassiane": "D",
  "eis-me aqui|cassiane": "G",
  "confiante|cassiane": "D",
  "milagres|cassiane": "G",
  "o sangue e a chave|cassiane": "D",
  "nunca desistiu de mim|cassiane": "G",

  // ═══════════════════════════════════════════════
  // DAMARES
  // ═══════════════════════════════════════════════
  "lugar secreto|damares": "D",
  "minha bencao esta no louvor|damares": "G",
  "so deus|damares": "D",
  "o senhor esta aqui|damares": "G",
  "ele cuida|damares": "D",
  "graca|damares": "G",
  "ungida|damares": "D",
  "no dia da batalha|damares": "G",

  // ═══════════════════════════════════════════════
  // SHIRLEY CARVALHAES
  // ═══════════════════════════════════════════════
  "eu sei que amanhece|shirley carvalhaes": "G",
  "tu mereces|shirley carvalhaes": "D",
  "nao chores|shirley carvalhaes": "G",
  "ele ainda esta aqui|shirley carvalhaes": "D",
  "deus da minha vida|shirley carvalhaes": "G",
  "louvai ao senhor|shirley carvalhaes": "D",
  "vitoria|shirley carvalhaes": "G",

  // ═══════════════════════════════════════════════
  // MARA LIMA
  // ═══════════════════════════════════════════════
  "quero que voce me cure|mara lima": "D",
  "espera em deus|mara lima": "G",
  "tua cura|mara lima": "D",
  "o vento|mara lima": "G",
  "ele e o senhor|mara lima": "D",
  "aleluia|mara lima": "G",
  "nunca vou parar|mara lima": "D",
  "o que sou eu|mara lima": "G",

  // ═══════════════════════════════════════════════
  // FERNANDA BRUM
  // ═══════════════════════════════════════════════
  "amor e cura|fernanda brum": "G",
  "nao me esquecas|fernanda brum": "D",
  "ele cuida de mim|fernanda brum": "G",
  "tu es fiel|fernanda brum": "D",
  "hosana|fernanda brum": "G",
  "grande es tu|fernanda brum": "D",
  "coracao apaixonado|fernanda brum": "G",
  "minha esperanca|fernanda brum": "D",
  "o milagre|fernanda brum": "G",

  // ═══════════════════════════════════════════════
  // TOQUE NO ALTAR
  // ═══════════════════════════════════════════════
  "deus de alianca|toque no altar": "G",
  "jesus alegria das nacoes|toque no altar": "G",
  "santo|toque no altar": "D",
  "te adorar|toque no altar": "G",
  "minha alma|toque no altar": "D",
  "chuva de graca|toque no altar": "G",
  "nao vou parar de te louvar|toque no altar": "D",
  "ha poder no sangue|toque no altar": "G",
  "ele esta aqui|toque no altar": "D",
  "rei da gloria|toque no altar": "G",
  "eterno|toque no altar": "D",

  // ═══════════════════════════════════════════════
  // TRAZENDO A ARCA
  // ═══════════════════════════════════════════════
  "novo tempo|trazendo a arca": "G",
  "marca da promessa|trazendo a arca": "D",
  "ainda que a figueira|trazendo a arca": "G",
  "tempo|trazendo a arca": "D",
  "o deus que me ve|trazendo a arca": "G",
  "esperanca|trazendo a arca": "D",
  "vitoria|trazendo a arca": "G",
  "mais alto|trazendo a arca": "D",
  "hosana|trazendo a arca": "G",
  "vai o impossivel|trazendo a arca": "D",

  // ═══════════════════════════════════════════════
  // RENASCER PRAISE
  // ═══════════════════════════════════════════════
  "minha fonte de descanso|renascer praise": "G",
  "quero mais de ti|renascer praise": "D",
  "1000 graus|renascer praise": "G",
  "mil graus|renascer praise": "G",
  "por causa da cruz|renascer praise": "D",
  "somos mais que vencedores|renascer praise": "G",
  "levanta-te e anda|renascer praise": "D",
  "deus abencoe a voce|renascer praise": "G",
  "rio de vida|renascer praise": "D",
  "fogo de pentecostes|renascer praise": "G",
  "santo espirito|renascer praise": "D",
  "aleluia|renascer praise": "G",

  // ═══════════════════════════════════════════════
  // ADHEMAR DE CAMPOS
  // ═══════════════════════════════════════════════
  "nosso general|adhemar de campos": "D",
  "o nosso general|adhemar de campos": "D",
  "vitorioso es tu senhor|adhemar de campos": "G",
  "quao grande es tu|adhemar de campos": "G",
  "na presenca do rei|adhemar de campos": "D",
  "gloria nos altos ceus|adhemar de campos": "G",
  "deus da minha vida|adhemar de campos": "D",
  "eis-me aqui|adhemar de campos": "G",
  "senhor tu sabes|adhemar de campos": "D",
  "o fogo|adhemar de campos": "G",

  // ═══════════════════════════════════════════════
  // ASAPH BORBA
  // ═══════════════════════════════════════════════
  "fora de mim|asaph borba": "D",
  "nossa cancao de amor|asaph borba": "G",
  "sozinho|asaph borba": "D",
  "bondade de deus|asaph borba": "G",
  "para sempre|asaph borba": "D",
  "eu navegarei|asaph borba": "G",

  // ═══════════════════════════════════════════════
  // PC BARUK
  // ═══════════════════════════════════════════════
  "espera|pc baruk": "G",
  "extraordinario|pc baruk": "D",
  "filho amado|pc baruk": "G",
  "graca|pc baruk": "D",
  "minha identidade|pc baruk": "G",
  "preciso de ti|pc baruk": "D",

  // ═══════════════════════════════════════════════
  // PRETO NO BRANCO
  // ═══════════════════════════════════════════════
  "filho|preto no branco": "G",
  "correndo pra ti|preto no branco": "D",
  "amor de pai|preto no branco": "G",
  "fe real|preto no branco": "D",
  "identidade|preto no branco": "G",
  "confio|preto no branco": "D",
  "meu parceiro|preto no branco": "G",

  // ═══════════════════════════════════════════════
  // PEDRO HENRIQUE
  // ═══════════════════════════════════════════════
  "bom demais|pedro henrique": "G",
  "valeu a pena esperar|pedro henrique": "D",
  "tua graca|pedro henrique": "G",
  "amor que nao falha|pedro henrique": "D",
  "hosana|pedro henrique": "G",
  "porque tu es bom|pedro henrique": "D",

  // ═══════════════════════════════════════════════
  // MARCELO MARKES
  // ═══════════════════════════════════════════════
  "eu tenho voce|marcelo markes": "G",
  "tudo que tenho|marcelo markes": "D",
  "meu tudo|marcelo markes": "G",
  "apenas comeca|marcelo markes": "D",
  "te louvarei|marcelo markes": "G",
  "glorioso|marcelo markes": "D",

  // ═══════════════════════════════════════════════
  // CORAL KEMUEL
  // ═══════════════════════════════════════════════
  "te louvamos|coral kemuel": "G",
  "ave maria|coral kemuel": "D",
  "seu nome e jesus|coral kemuel": "G",
  "hallelujah|coral kemuel": "D",
  "exaltado|coral kemuel": "G",
  "digno|coral kemuel": "D",

  // ═══════════════════════════════════════════════
  // VENCEDORES POR CRISTO
  // ═══════════════════════════════════════════════
  "creio em ti|vencedores por cristo": "G",
  "eis-me aqui|vencedores por cristo": "D",
  "so jesus|vencedores por cristo": "G",
  "eterno louvor|vencedores por cristo": "D",
  "quero te adorar|vencedores por cristo": "G",
  "eu confio|vencedores por cristo": "D",

  // ═══════════════════════════════════════════════
  // HARPA CRISTA (CLASSICOS)
  // ═══════════════════════════════════════════════
  "alvo mais que a neve|harpa crista": "G",
  "a mensagem da cruz|harpa crista": "D",
  "foi na cruz|harpa crista": "G",
  "porque ele vive|harpa crista": "G",
  "quanto mais que vencedores|harpa crista": "G",
  "cristo nos e tudo|harpa crista": "D",
  "na fonte da vida|harpa crista": "G",
  "minha alma tem um lar|harpa crista": "D",
  "rendo-me|harpa crista": "G",
  "terra bela|harpa crista": "G",
  "lacos do amor|harpa crista": "D",
  "venho a ti|harpa crista": "G",
  "jesus o nome excelso|harpa crista": "D",
  "sou salvo|harpa crista": "G",
  "jesus pao da vida|harpa crista": "G",
  "a paz de deus|harpa crista": "D",
  "gracas dou|harpa crista": "G",
  "sou peregrino|harpa crista": "D",
  "oh quao bom|harpa crista": "G",
  "o amor de deus|harpa crista": "D",
  "o que e isso|harpa crista": "G",
  "na volta do senhor|harpa crista": "D",
  "tua palavra|harpa crista": "G",
  "junto ao trono|harpa crista": "D",
  "belas palavras|harpa crista": "G",
  "ha uma fonte|harpa crista": "D",
  "sublime graca|harpa crista": "G",
  "quao firme alicerce|harpa crista": "G",
  "castelo forte|harpa crista": "D",
  "louvarei ao senhor|harpa crista": "G",

  // ═══════════════════════════════════════════════
  // JAMILY
  // ═══════════════════════════════════════════════
  "so eu sei o quanto me custou|jamily": "D",
  "inesquecivel|jamily": "G",
  "alguem me ama|jamily": "D",
  "tu cuidas de mim|jamily": "G",
  "sou feliz|jamily": "D",
  "te quero so|jamily": "G",

  // ═══════════════════════════════════════════════
  // RODRIGO FERREIRA
  // ═══════════════════════════════════════════════
  "todo meu louvor|rodrigo ferreira": "G",
  "deus esta em tudo|rodrigo ferreira": "D",
  "maranata|rodrigo ferreira": "G",
  "tua fidelidade|rodrigo ferreira": "D",
  "o senhor e meu pastor|rodrigo ferreira": "G",

  // ═══════════════════════════════════════════════
  // LIVRES PARA ADORAR
  // ═══════════════════════════════════════════════
  "fogo de pentecostes|livres para adorar": "G",
  "espirito de deus|livres para adorar": "D",
  "grande deus|livres para adorar": "G",
  "o sangue de jesus|livres para adorar": "D",
  "no rio de deus|livres para adorar": "G",
  "hosana|livres para adorar": "D",
  "santo espirito|livres para adorar": "G",

  // ═══════════════════════════════════════════════
  // CELINA BORGES
  // ═══════════════════════════════════════════════
  "o espirito|celina borges": "G",
  "hosana|celina borges": "D",
  "por causa do seu amor|celina borges": "G",
  "deus fiel|celina borges": "D",
  "glorificado|celina borges": "G",

  // ═══════════════════════════════════════════════
  // LEO BRANDAO
  // ═══════════════════════════════════════════════
  "deus esta aqui|leo brandao": "G",
  "viver para ti|leo brandao": "D",
  "nenhum outro nome|leo brandao": "G",
  "maravilhoso|leo brandao": "D",
  "te adorar|leo brandao": "G",
  "fidelidade|leo brandao": "D",

  // ═══════════════════════════════════════════════
  // OFICINA G3
  // ═══════════════════════════════════════════════
  "jesus de nazare|oficina g3": "D",
  "nada|oficina g3": "G",
  "sozinho|oficina g3": "D",
  "meu senhor|oficina g3": "G",
  "transformado|oficina g3": "D",
  "voce vai me chamar de louco|oficina g3": "G",
  "casinha de papel|oficina g3": "G",

  // ═══════════════════════════════════════════════
  // GEANPATRICK
  // ═══════════════════════════════════════════════
  "o deus que nos ve|geanpatrick": "G",
  "cedo e tarde|geanpatrick": "D",
  "tua paz|geanpatrick": "G",
  "louvor|geanpatrick": "D",

  // ═══════════════════════════════════════════════
  // ALEXANDRE APOSAN
  // ═══════════════════════════════════════════════
  "assim na terra|alexandre aposan": "G",
  "abba pai|alexandre aposan": "D",
  "que podes fazer|alexandre aposan": "G",
  "haja o que houver|alexandre aposan": "D",

  // ═══════════════════════════════════════════════
  // ANDREA FONTES
  // ═══════════════════════════════════════════════
  "chuva de bencaos|andrea fontes": "G",
  "vitoria do cordeiro|andrea fontes": "D",

  // ═══════════════════════════════════════════════
  // MINISTÉRIO JOVEM
  // ═══════════════════════════════════════════════
  "sola scriptura|ministerio jovem": "G",
  "ainda que tudo mude|ministerio jovem": "D",
  "o espirito e o noivo|ministerio jovem": "G",

  // ═══════════════════════════════════════════════
  // MATTOS NASCIMENTO
  // ═══════════════════════════════════════════════
  "espirito adoravel|mattos nascimento": "G",
  "so deus basta|mattos nascimento": "D",
  "poderoso deus|mattos nascimento": "G",
  "vem espirito de deus|mattos nascimento": "D",
  "nao ha outro|mattos nascimento": "G",
  "teu favor|mattos nascimento": "D",
  "graca e misericordia|mattos nascimento": "G",

  // ═══════════════════════════════════════════════
  // GABRIELA GOMES
  // ═══════════════════════════════════════════════
  "deus provera|gabriela gomes": "G",
  "eu navego|gabriela gomes": "D",
  "nao me deixes|gabriela gomes": "G",
  "vitoria|gabriela gomes": "D",

  // ═══════════════════════════════════════════════
  // ELIZEU CORREA
  // ═══════════════════════════════════════════════
  "eu corro para ti|elizeu correa": "G",
  "faz-me andar|elizeu correa": "D",
  "o senhor cuida de mim|elizeu correa": "G",
  "teus olhos|elizeu correa": "D",

  // ═══════════════════════════════════════════════
  // JOTTA A
  // ═══════════════════════════════════════════════
  "hallelujah|jotta a": "G",
  "deus cuida de mim|jotta a": "D",
  "lugar secreto|jotta a": "D",
  "confio em ti|jotta a": "G",

  // ═══════════════════════════════════════════════
  // ELIANE FERNANDES
  // ═══════════════════════════════════════════════
  "quero mais de ti|eliane fernandes": "D",
  "faz-me puro|eliane fernandes": "G",
  "me rendo|eliane fernandes": "D",
  "deus fiel|eliane fernandes": "G",

  // ═══════════════════════════════════════════════
  // ROZEANE RIBEIRO
  // ═══════════════════════════════════════════════
  "vai valer a pena|rozeane ribeiro": "G",
  "novo rosto|rozeane ribeiro": "D",
  "nao desista|rozeane ribeiro": "G",

  // ═══════════════════════════════════════════════
  // OZEIAS DE PAULA
  // ═══════════════════════════════════════════════
  "a sua presenca|ozeias de paula": "G",
  "aquele que nao vacila|ozeias de paula": "D",
  "o amor de deus|ozeias de paula": "G",
  "que precioso|ozeias de paula": "D",

  // ═══════════════════════════════════════════════
  // IRMÃ JACINTA
  // ═══════════════════════════════════════════════
  "tua presenca|irma jacinta": "G",
  "espera|irma jacinta": "D",
  "o espirito desceu|irma jacinta": "G",

  // ═══════════════════════════════════════════════
  // FHOP MUSIC
  // ═══════════════════════════════════════════════
  "como o joao|fhop music": "G",
  "fogo|fhop music": "D",
  "avivamento|fhop music": "G",
  "vem senhor|fhop music": "D",
  "estou de volta|fhop music": "G",
  "radical|fhop music": "D",

  // ═══════════════════════════════════════════════
  // CENTRAL 3
  // ═══════════════════════════════════════════════
  "teu amor me conquista|central 3": "G",
  "toda a honra|central 3": "D",
  "fala senhor|central 3": "G",
  "permanece|central 3": "D",

  // ═══════════════════════════════════════════════
  // GABRIELLA RODRIGUES
  // ═══════════════════════════════════════════════
  "tua misericordia|gabriella rodrigues": "G",
  "grandioso|gabriella rodrigues": "D",

  // ═══════════════════════════════════════════════
  // LAGOINHA WORSHIP
  // ═══════════════════════════════════════════════
  "digno|lagoinha worship": "G",
  "eterno|lagoinha worship": "D",
  "o senhor reina|lagoinha worship": "G",
  "hosana|lagoinha worship": "D",
  "nao ha outro deus|lagoinha worship": "G",

  // ═══════════════════════════════════════════════
  // ADORADORES (LIVRES P/ ADORAR / FLAVIO LOTT)
  // ═══════════════════════════════════════════════
  "eu vi a chuva|adoradores": "G",
  "grande e poderoso|adoradores": "D",
  "maravilhoso|adoradores": "G",

  // ═══════════════════════════════════════════════
  // VERSOES BRASILEIRAS - HILLSONG
  // ═══════════════════════════════════════════════
  "oceanos|hillsong": "G",
  "hosana|hillsong": "G",
  "o poder do teu amor|hillsong": "G",
  "como aguia|hillsong": "D",
  "unidos no amor|hillsong": "G",
  "teu nome e poder|hillsong": "D",
  "eu sei que vou te ver|hillsong": "A",
  "shout to the lord|hillsong": "G",
  "mais poderoso|hillsong": "G",
  "o teu amor|hillsong": "D",
  "glorious ruins|hillsong": "G",

  // ═══════════════════════════════════════════════
  // VERSOES BRASILEIRAS - BETHEL
  // ═══════════════════════════════════════════════
  "a bencao|bethel music": "G",
  "bondade de deus|bethel music": "G",
  "fiel|bethel music": "G",
  "espirito de deus|bethel music": "D",
  "reckless love|bethel music": "G",

  // ═══════════════════════════════════════════════
  // VERSOES BRASILEIRAS - CHRIS TOMLIN / OUTROS
  // ═══════════════════════════════════════════════
  "quao grande e o nosso deus|chris tomlin": "G",
  "santo e o senhor|chris tomlin": "G",
  "glorious|chris tomlin": "G",
  "amazing grace|chris tomlin": "G",
  "our god|chris tomlin": "G",
  "jesus my redeemer|chris tomlin": "G",

  // ═══════════════════════════════════════════════
  // VERSOES BRASILEIRAS - PLANETSHAKERS
  // ═══════════════════════════════════════════════
  "the anthem|planetshakers": "E",
  "evidence|planetshakers": "G",
  "power|planetshakers": "D",

  // ═══════════════════════════════════════════════
  // TALITTA CAMPAGNOLI
  // ═══════════════════════════════════════════════
  "minha bencao|talitta campagnoli": "G",
  "to no shalom|talitta campagnoli": "D",
  "faz cair|talitta campagnoli": "G",

  // ═══════════════════════════════════════════════
  // WALMIR ALENCAR
  // ═══════════════════════════════════════════════
  "nao e facil|walmir alencar": "G",
  "te louvarei|walmir alencar": "D",
  "amigo de deus|walmir alencar": "G",

  // ═══════════════════════════════════════════════
  // TITO LARA
  // ═══════════════════════════════════════════════
  "basta|tito lara": "G",
  "um so deus|tito lara": "D",
  "nao desistirei|tito lara": "G",

  // ═══════════════════════════════════════════════
  // GABI SAMPAIO
  // ═══════════════════════════════════════════════
  "pra te adorar|gabi sampaio": "G",
  "yeshua|gabi sampaio": "D",
  "graca|gabi sampaio": "G",

  // ═══════════════════════════════════════════════
  // NATHALIA BRAGA
  // ═══════════════════════════════════════════════
  "identidade|nathalia braga": "G",
  "filho|nathalia braga": "D",
  "graca|nathalia braga": "G",

  // ═══════════════════════════════════════════════
  // VITORIA LIMA
  // ═══════════════════════════════════════════════
  "te louvarei na tempestade|vitoria lima": "G",
  "preciso de ti|vitoria lima": "D",
  "nao te deixo|vitoria lima": "G",

  // ═══════════════════════════════════════════════
  // KLEBER LUCAS
  // ═══════════════════════════════════════════════
  "toma conta|kleber lucas": "G",
  "tu me sondas|kleber lucas": "D",
  "o amor de cristo|kleber lucas": "G",
  "deus da minha vida|kleber lucas": "D",
  "bendize a minha alma|kleber lucas": "G",
  "te esperarei|kleber lucas": "D",
  "mais que vencedor|kleber lucas": "G",

  // ═══════════════════════════════════════════════
  // MINISTÉRIO FHOP / LUIZ HERMINIO
  // ═══════════════════════════════════════════════
  "que a nossa fe nao faleça|ministerio fhop": "G",
  "transformado pela graca|ministerio fhop": "D",
  "digno e o senhor|ministerio fhop": "G",

  // ═══════════════════════════════════════════════
  // GENÉRICOS / CLASSICOS DO LOUVOR
  // ═══════════════════════════════════════════════
  "eu navegarei|": "G",
  "shout to the lord|": "G",
  "quao grande es tu|": "G",
  "sublime graca|": "G",
  "amazing grace|": "G",
  "clamando ao senhor|": "G",
  "a bencao|": "G",
  "there is no one like you|": "G",
  "open the eyes of my heart|": "G",
  "hosana|": "G",
  "king of kings|": "G",
  "way maker|": "G",
  "faz um milagre|": "G",
};

const normalize = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 |]/g, "")
    .trim();
};

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
    const titleMatch = normTitle === keyTitle || normTitle.includes(keyTitle) || keyTitle.includes(normTitle);
    const artistMatch = normArtist === keyArtist || normArtist.includes(keyArtist) || keyArtist.includes(normArtist);
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
