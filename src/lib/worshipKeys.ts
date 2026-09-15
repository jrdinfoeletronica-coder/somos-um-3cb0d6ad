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
  // MINISTÉRIO SARANDO A TERRA FERIDA
  // ═══════════════════════════════════════════════
  "o haja de deus|ministerio sarando a terra ferida": "G",
  "haja de deus|ministerio sarando a terra ferida": "G",
  "espírito santo|ministerio sarando a terra ferida": "D",
  "deus do secreto|ministerio sarando a terra ferida": "G",

  // ═══════════════════════════════════════════════
  // ALINE BARROS (Adicionais)
  // ═══════════════════════════════════════════════
  "o agir de deus|aline barros": "G",
  "haja de deus|aline barros": "G",
  "o haja de deus|aline barros": "G",
  "caminho de milagre|aline barros": "C",

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

  // ═══════════════════════════════════════════════
  // MORADA
  // ═══════════════════════════════════════════════
  "e tudo sobre voce|morada": "E",
  "pra onde eu irei|morada": "G",
  "uma coisa|morada": "C",
  "so tu es santo|morada": "D",
  "ele me ama|morada": "G",

  // ═══════════════════════════════════════════════
  // ISAIAS SAAD
  // ═══════════════════════════════════════════════
  "ousado amor|isaias saad": "Em",
  "incondicional|isaias saad": "G",
  "vou alem|isaias saad": "C",
  "o carpinteiro|isaias saad": "D",
  "bondade de deus|isaias saad": "G",

  // ═══════════════════════════════════════════════
  // NIVEA SOARES
  // ═══════════════════════════════════════════════
  "me esvaziar|nivea soares": "G",
  "teu amor nao falha|nivea soares": "A",
  "em tua presenca|nivea soares": "D",
  "filho do deus vivo|nivea soares": "F",
  "reina sobre mim|nivea soares": "G",
  "nenhum deus como tu|nivea soares": "D",

  // ═══════════════════════════════════════════════
  // ANDERSON FREIRE
  // ═══════════════════════════════════════════════
  "raridade|anderson freire": "G",
  "igreja vem|anderson freire": "Am",
  "a igreja vem|anderson freire": "Am",
  "efesios 6|anderson freire": "Em",
  "cancao do ceu|anderson freire": "C",

  // ═══════════════════════════════════════════════
  // THALLES ROBERTO
  // ═══════════════════════════════════════════════
  "deus da minha vida|thalles roberto": "G",
  "meu mundo|thalles roberto": "C",
  "ardendo em fogo|thalles roberto": "Em",
  "ele e contigo|thalles roberto": "D",
  "cheios do espirito santo|thalles roberto": "E",

  // ═══════════════════════════════════════════════
  // KEMUEL
  // ═══════════════════════════════════════════════
  "algo novo|kemuel": "D",
  "oceanos|kemuel": "E",
  "oh quao lindo esse nome e|kemuel": "D",
  "facanos um|kemuel": "G",

  // ═══════════════════════════════════════════════
  // BRUNA KARLA
  // ═══════════════════════════════════════════════
  "advogado fiel|bruna karla": "D",
  "sou humano|bruna karla": "G",
  "quando eu chorar|bruna karla": "C",
  "deixar a lagrima rolar|bruna karla": "A",
  "cicatrizes|bruna karla": "G",

  // ═══════════════════════════════════════════════
  // PRISCILLA ALCANTARA
  // ═══════════════════════════════════════════════
  "espirito santo|priscilla alcantara": "G",
  "me refez|priscilla alcantara": "D",
  "liberdade|priscilla alcantara": "Em",
  "empata|priscilla alcantara": "A",

  // ═══════════════════════════════════════════════
  // HELOISA ROSA
  // ═══════════════════════════════════════════════
  "jesus e o caminho|heloisa rosa": "G",
  "ha um lugar|heloisa rosa": "D",
  "se andarmos na luz|heloisa rosa": "E",
  "lindo jesus|heloisa rosa": "C",

  // ═══════════════════════════════════════════════
  // CORINHOS DE FOGO E CLASSICOS PENTECOSTAIS
  // ═══════════════════════════════════════════════
  "fogo no pe|": "Em",
  "jacob segurou o anjo|": "Em",
  "tem anjo passeando|": "Em",
  "o sangue de jesus tem poder|": "Am",
  "caiam por terra agora|": "Am",
  "ele e o leao da tribo de juda|": "Em",
  "vencendo vem jesus|": "G",
  "alvo mais que a neve|": "C",
  "grandioso es tu|": "G",
  "porque ele vive|": "G",
  "a cruz sagrada|": "C",
  "conta as bencaos|": "D",
  "firme nas promessas|": "G",
  "ha poder no sangue|": "G",
  "foi na cruz|": "G",

  // ═══════════════════════════════════════════════
  // CASSIANE
  // ═══════════════════════════════════════════════
  "com muito louvor|cassiane": "Am",
  "500 graus|cassiane": "Em",
  "hino da vitoria|cassiane": "C",
  "oferta agradavel|cassiane": "G",
  "amigo espirito santo|cassiane": "D",
  "imagine|cassiane": "F",
  "todo poderoso|cassiane": "Dm",
  "louve sempre|cassiane": "G",
  "cachoeira de poder|cassiane": "Em",

  // ═══════════════════════════════════════════════
  // DAMARES
  // ═══════════════════════════════════════════════
  "sabor de mel|damares": "Cm",
  "um novo vencedor|damares": "G",
  "o maior trofeu|damares": "D",
  "diamante|damares": "Am",
  "consolador|damares": "F",
  "apocalipse|damares": "Em",

  // ═══════════════════════════════════════════════
  // LAURIETE
  // ═══════════════════════════════════════════════
  "palavras|lauriete": "Cm",
  "deus dos deuses|lauriete": "Am",
  "guarda o que tens|lauriete": "F",
  "dias de elias|lauriete": "G",

  // ═══════════════════════════════════════════════
  // OFICINA G3
  // ═══════════════════════════════════════════════
  "o tempo|oficina g3": "Em",
  "incondicional|oficina g3": "Am",
  "meu legado|oficina g3": "Em",
  "humanos|oficina g3": "E",
  "ate quando|oficina g3": "Am",

  // ═══════════════════════════════════════════════
  // RENASCER PRAISE
  // ═══════════════════════════════════════════════
  "promessa|renascer praise": "G",
  "plano melhor|renascer praise": "D",
  "nao ha outro igual|renascer praise": "G",
  "esperanca|renascer praise": "C",

  // ═══════════════════════════════════════════════
  // TOQUE NO ALTAR / APASCENTAR
  // ═══════════════════════════════════════════════
  "tua graca me basta|toque no altar": "G",
  "toda sorte de bencaos|toque no altar": "E",
  "abro mao|toque no altar": "C",
  "olha pra mim|toque no altar": "G",
  "deus de promessas|toque no altar": "G",
  "bendito serei|toque no altar": "G",
  "restitui|toque no altar": "G",

  // ═══════════════════════════════════════════════
  // TRAZENDO A ARCA
  // ═══════════════════════════════════════════════
  "sobre as aguas|trazendo a arca": "C",
  "toca na rocha|trazendo a arca": "Am",
  "pra tocar no manto|trazendo a arca": "D",
  "me entrego a ti|trazendo a arca": "G",

  // ═══════════════════════════════════════════════
  // MINISTÉRIO KOINONYA DE LOUVOR
  // ═══════════════════════════════════════════════
  "quem pode livrar|koinonya": "G",
  "ao unico|koinonya": "D",
  "espirito de deus|koinonya": "G",
  "leao de juda|koinonya": "Em",
  "ofereco minha vida|koinonya": "G",

  // ═══════════════════════════════════════════════
  // ASAPH BORBA
  // ═══════════════════════════════════════════════
  "jesus em tua presenca|asaph borba": "D",
  "alto preco|asaph borba": "G",
  "ensina me|asaph borba": "D",

  // ═══════════════════════════════════════════════
  // NOVO SOM
  // ═══════════════════════════════════════════════
  "escrevi|novo som": "G",
  "heroi dos herois|novo som": "C",
  "pra voce|novo som": "D",
  "por um segundo|novo som": "A",

  // ═══════════════════════════════════════════════
  // VOZ DA VERDADE
  // ═══════════════════════════════════════════════
  "projeto no deserto|voz da verdade": "Am",
  "sou um milagre|voz da verdade": "G",
  "sangue cor de carmim|voz da verdade": "Am",
  "pra que|voz da verdade": "Dm",
  "alem do rio azul|voz da verdade": "F",
  "chuva de sangue|voz da verdade": "Am",

  // ═══════════════════════════════════════════════
  // VENCEDORES POR CRISTO
  // ═══════════════════════════════════════════════
  "buscar me eis|vencedores por cristo": "G",
  "mente e coracao|vencedores por cristo": "C",
  "salmo 96|vencedores por cristo": "D",

  // ═══════════════════════════════════════════════
  // SHIRLEY CARVALHAES
  // ═══════════════════════════════════════════════
  "ha uma saida|shirley carvalhaes": "Fm",
  "vendavais|shirley carvalhaes": "Am",
  "deus prove|shirley carvalhaes": "Em",
  "esse adorador|shirley carvalhaes": "Cm",
  "farao ou deus|shirley carvalhaes": "Dm",
  "ditosa cidade|shirley carvalhaes": "Am",

  // ═══════════════════════════════════════════════
  // JULIO CESAR
  // ═══════════════════════════════════════════════
  "nao ha deus maior|julio cesar": "G",

  // ═══════════════════════════════════════════════
  // ALDA CELIA
  // ═══════════════════════════════════════════════
  "chuva de avivamento|alda celia": "C",
  "deus do impossivel|alda celia": "D",
  "mostra me tua gloria|alda celia": "G",

  // ═══════════════════════════════════════════════
  // LUO / APC 16
  // ═══════════════════════════════════════════════
  "muito amor|apc 16": "Am",
  "basta|apc 16": "Em",
  "ja posso suportar|pregador luo": "Am",
  "arvore de bons frutos|pregador luo": "Em",

  // ═══════════════════════════════════════════════
  // LIVRES PARA ADORAR
  // ═══════════════════════════════════════════════
  "vai valer a pena|livres": "D",
  "mais um dia|livres": "G",
  "quando o mundo cai ao meu redor|livres": "Em",
  "ele vive|livres": "A",
  "so em jesus|livres": "G",

  // ═══════════════════════════════════════════════
  // MARQUINHOS GOMES
  // ═══════════════════════════════════════════════
  "ele nao desiste de voce|marquinhos gomes": "D",
  "nao morrerei|marquinhos gomes": "Em",
  "rei da gloria|marquinhos gomes": "G",

  // ═══════════════════════════════════════════════
  // LUDMILA FERBER
  // ═══════════════════════════════════════════════
  "nunca pare de lutar|ludmila ferber": "C",
  "os sonhos de deus|ludmila ferber": "D",
  "aguas purificadoras|ludmila ferber": "G",
  "sopra espirito|ludmila ferber": "C",
  "buscar tua face e preciso|ludmila ferber": "D",

  // ═══════════════════════════════════════════════
  // SOSTENES / JOTTA A
  // ═══════════════════════════════════════════════
  "estou contigo|jotta a": "C",
  "extraordinario|jotta a": "G",

  // ═══════════════════════════════════════════════
  // GABRIELA GOMES
  // ═══════════════════════════════════════════════
  "o meu pai e bom|gabriela gomes": "G",

  // ═══════════════════════════════════════════════
  // THEO RUBIA
  // ═══════════════════════════════════════════════
  "eu so quero presenca|theo rubia": "G",

  // ═══════════════════════════════════════════════
  // STELLA LAURA
  // ═══════════════════════════════════════════════
  "descansa|stella laura": "G",
  "deixa comigo|stella laura": "C",
  "o segredo e louvar|stella laura": "D",

  // ═══════════════════════════════════════════════
  // JEFERSON PILLAR
  // ═══════════════════════════════════════════════
  "e so confiar|jeferson pillar": "D",
  "sabe filho|jeferson pillar": "G",

  // ═══════════════════════════════════════════════
  // DANIEL ALENCAR / DAVI SILVA
  // ═══════════════════════════════════════════════
  "nome sobre todo nome|davi silva": "G",
  "casa de davi|davi silva": "D",

  // ═══════════════════════════════════════════════
  // HILLSONG PORTUGUES (MAIS USADAS)
  // ═══════════════════════════════════════════════
  "o quao lindo esse nome e|hillsong": "D",
  "nome doce|hillsong": "D",
  "eu me rendo|hillsong": "C",
  "em teus bracos|hillsong": "G",

  // ═══════════════════════════════════════════════
  // ELEVATION WORSHIP PORTUGUES
  // ═══════════════════════════════════════════════
  "a bencao|elevation": "G",
  "deus de promessas|elevation": "G",
  "leao|elevation": "G",
  "sepulcros|elevation": "B",
  "aqui como no ceu|elevation": "D",
  "o mesmo deus|elevation": "D",

  // ═══════════════════════════════════════════════
  // ADAHABY / CENTRAL 3
  // ═══════════════════════════════════════════════
  "para que entre o rei|central 3": "Em",
  "eu me achego|central 3": "D",
  "tudo a ver com ele|central 3": "Em",
  "meu amado e|central 3": "Em",

  // ═══════════════════════════════════════════════
  // SOM DO REINO / ALESSANDRO VILAS BOAS
  // ═══════════════════════════════════════════════
  "quero conhecer jesus|alessandro vilas boas": "Am",
  "o fogo nunca dorme|alessandro vilas boas": "Em",
  "ser mudado|alessandro vilas boas": "C",
  "me fez amar|alessandro vilas boas": "G",
  "deixa queimar|alessandro vilas boas": "Am",

  // ═══════════════════════════════════════════════
  // FHOP / FLORIANOPOLIS HOUSE OF PRAYER
  // ═══════════════════════════════════════════════
  "maranata|fhop": "Am",
  "uma coisa|fhop": "C",
  "volte os olhos|fhop": "D",
  "somos teu povo|fhop": "G",

  // ═══════════════════════════════════════════════
  // DUNAMIS MUSIC
  // ═══════════════════════════════════════════════
  "queima de novo|dunamis": "Em",
  "meu melhor amigo|dunamis": "D",
  "muralhas|dunamis": "G",
  "fogo consolador|dunamis": "Am",

  // ═══════════════════════════════════════════════
  // OUTROS HITS RECENTES E LOUVORES
  // ═══════════════════════════════════════════════
  "caminho no deserto|": "C",
  "teu amor nao falha|": "A",
  "tudo e teu|": "D",
  "para que entre o rei|": "Em",
  "que ele cresca|": "C",
  "tu es bom|": "G",
  "dias de elias|": "G",
  "deus e deus|": "G",
  "nada alem do sangue|": "G",
  "poderoso deus|": "D",
  "tu es soberano|": "D",
  "a ti eu vou clamar|": "G",
  "vim para adorar te|": "E",
  "meu respirar|": "A",
  "a ele a gloria|": "Am",
  "espiritosanto|": "G",

  // ==========================================================
  // LOTE 1/4 - RUMO AOS 1000 LOUVORES
  // ==========================================================
  
  // ═══════════════════════════════════════════════
  // HARPA CRISTÃ - OS MAIS CANTADOS (GENÉRICOS)
  // ═══════════════════════════════════════════════
  "chuvas de graca|": "G",
  "saudosa lembranca|": "D",
  "o exilado|": "A",
  "a face adorada de jesus|": "D",
  "grato a ti|": "G",
  "guia me sempre meu senhor|": "D",
  "mansao sobre o monte|": "G",
  "plena paz|": "E",
  "os guerreiros se preparam|": "G",
  "em fervente oracao|": "A",
  "o sangue purificador|": "G",
  "vem cear|": "C",
  "sobre as ondas do mar|": "G",
  "a mensagem da cruz|": "A",
  "olhai pra o cordeiro de deus|": "D",
  "conversao|": "G",
  "mais grato a ti|": "G",
  "o rei esta voltando|": "G",
  "guarda o contacto|": "D",
  "so o sangue de jesus|": "E",
  "deus velara por ti|": "G",
  "vivifica tua igreja|": "G",
  "tudo entegarei|": "D",
  "a ovelha perdida|": "C",
  "ao passar o jordao|": "G",
  "os crentes marcham|": "G",
  "nao desanimes|": "F",
  "quando o nosso deus agir|": "D",
  "jesus e o caminho|": "G",
  "mais perto quero estar|": "G",
  "deixa a luz do ceu entrar|": "G",
  "jesus me transformou|": "D",
  "no jardim|": "Ab",
  "solta o cabo da nau|": "D",
  "flor gloriosa|": "E",
  "uma flor gloriosa|": "E",
  "cristo cura sim|": "A",
  "ao estrugir a trombeta|": "G",

  // ═══════════════════════════════════════════════
  // MINISTÉRIO AVIVAH
  // ═══════════════════════════════════════════════
  "maranata|avivah": "Em",
  "invocamos|avivah": "G",
  "eu me prostro|avivah": "D",
  "cancao do apocalipse|avivah": "A",
  "ninguem explica deus|avivah": "G",
  "exaltado|avivah": "C",
  "noites escuras|avivah": "Am",

  // ═══════════════════════════════════════════════
  // PEDRAS VIVAS
  // ═══════════════════════════════════════════════
  "pai nosso|pedras vivas": "Em",
  "fogo falador|pedras vivas": "Am",
  "o grito|pedras vivas": "Cm",
  "assentado no trono|pedras vivas": "C",
  "eu escolho deus|pedras vivas": "D",

  // ═══════════════════════════════════════════════
  // FERNANDA BRUM
  // ═══════════════════════════════════════════════
  "espirito santo|fernanda brum": "D",
  "cura me|fernanda brum": "Am",
  "o que tua gloria fez comigo|fernanda brum": "Em",
  "em tua presenca|fernanda brum": "C",
  "amada minha|fernanda brum": "G",
  "vinho novo|fernanda brum": "D",
  "sua digital|fernanda brum": "Em",
  "aleluia|fernanda brum": "A",
  "paviao|fernanda brum": "C",
  "nao e tarde|fernanda brum": "F",

  // ═══════════════════════════════════════════════
  // EYSHILA
  // ═══════════════════════════════════════════════
  "nada pode calar um adorador|eyshila": "E",
  "terremoto|eyshila": "Em",
  "fiel a mim|eyshila": "G",
  "deus no controle|eyshila": "C",
  "sonhos nao tem fim|eyshila": "D",
  "caminho de milagre|eyshila": "C", // Garantindo a variação com nome da Eyshila também
  "posso clamar|eyshila": "F",

  // ═══════════════════════════════════════════════
  // KLEBER LUCAS (MAIS HITS)
  // ═══════════════════════════════════════════════
  "aos pes da cruz|kleber lucas": "D",
  "vou deixar na cruz|kleber lucas": "G",
  "propocito|kleber lucas": "E",
  "o melhor esta por vir|kleber lucas": "A",
  "meu alvo|kleber lucas": "D",
  "cuida de mim|kleber lucas": "G",

  // ═══════════════════════════════════════════════
  // PREGADOR LUO / APOCALIPSE 16 (MAIS MÚSICAS)
  // ═══════════════════════════════════════════════
  "bagaça|pregador luo": "Em",
  "apaga a luz|pregador luo": "Am",
  "vou colher sorrindo|pregador luo": "Bm",
  "unico incompravel|pregador luo": "Fm",
  
  // ═══════════════════════════════════════════════
  // PG
  // ═══════════════════════════════════════════════
  "quem sou eu|pg": "Em",
  "meu universo|pg": "E",
  "eu quero estar|pg": "C",
  "posso ouvir|pg": "Am",
  "formoso es|pg": "G",
  "a arca|pg": "D",
  "faz chover|pg": "Em",
  
  // ═══════════════════════════════════════════════
  // RESGATE
  // ═══════════════════════════════════════════════
  "5 50 am|resgate": "D",
  "todo som|resgate": "G",
  "a voz do deserto|resgate": "E",
  "passo a passo|resgate": "C",
  "eu estou aqui|resgate": "Am",
  "lucifes|resgate": "Em",

  // ═══════════════════════════════════════════════
  // ROSA DE SARON
  // ═══════════════════════════════════════════════
  "sem voce|rosa de saron": "Bm",
  "do alto da pedra|rosa de saron": "Am",
  "as dores do silencio|rosa de saron": "Em",
  "cartas ao remetente|rosa de saron": "C",
  "monte inverno|rosa de saron": "Fm",
  "aurora|rosa de saron": "D",
  "meninos e leoes|rosa de saron": "C",
  "lembrancas|rosa de saron": "Em",

  // ═══════════════════════════════════════════════
  // KATSBARNEA
  // ═══════════════════════════════════════════════
  "extra|katsbarnea": "Em",
  "grito de alerta|katsbarnea": "Am",
  "cristo ou barrabas|katsbarnea": "E",
  "apocalipse now|katsbarnea": "Dm",
  
  // ═══════════════════════════════════════════════
  // SORAYA MORAES
  // ═══════════════════════════════════════════════
  "quao grande e o meu deus|soraya moraes": "G",
  "som da chuva|soraya moraes": "Em",
  "sobre as aguas|soraya moraes": "A",
  "cadete do espirito|soraya moraes": "Cm",

  // ═══════════════════════════════════════════════
  // BANDA GERD
  // ═══════════════════════════════════════════════
  "esconderijo do altissimo|gerd": "G",
  "santo de israel|gerd": "E",

  // ═══════════════════════════════════════════════
  // GRUPO LOGOS
  // ═══════════════════════════════════════════════
  "portas abertas|logos": "A",
  "autor da minha fe|logos": "G",
  "situaçoes|logos": "D",

  // ═══════════════════════════════════════════════
  // MINISTÉRIO APASCENTAR DE NOVA IGUAÇU / TOQUE NO ALTAR (MAIS)
  // ═══════════════════════════════════════════════
  "leao de juda|apascentar": "Em",
  "tuas aguas|apascentar": "F",
  "te adoramos|apascentar": "C",
  "faz chover|apascentar": "Am",
  "coroa de justica|apascentar": "G",
  
  // ═══════════════════════════════════════════════
  // CHRIS DURAN
  // ═══════════════════════════════════════════════
  "sonhos|chris duran": "E",
  "tu es meu deus|chris duran": "C",
  "um amor pra recordar|chris duran": "G",

  // ═══════════════════════════════════════════════
  // RODOLFO ABRANTES
  // ═══════════════════════════════════════════════
  "isaias 9|rodolfo abrantes": "Em",
  "o misterio|rodolfo abrantes": "Am",
  "beija flor|rodolfo abrantes": "D",
  "eu vibro por ti|rodolfo abrantes": "C",

  // ═══════════════════════════════════════════════
  // NIVEA SOARES (MAIS HITS)
  // ═══════════════════════════════════════════════
  "encharca me|nivea soares": "G",
  "fogo e gloria|nivea soares": "D",
  "aguas do trono|nivea soares": "E",
  "aquele que e|nivea soares": "F",
  "rio|nivea soares": "Am",
  
  // ═══════════════════════════════════════════════
  // MARIANE
  // ═══════════════════════════════════════════════
  "se nao for pra te adorar|mariane": "G",
  
  // ═══════════════════════════════════════════════
  // DISCOPRAISE
  // ═══════════════════════════════════════════════
  "se eu me humilhar|discopraise": "A",
  "ouca o meu clamor|discopraise": "C",
  "favor de deus|discopraise": "G",

  // ═══════════════════════════════════════════════
  // JERSON RUFINO
  // ═══════════════════════════════════════════════
  "barraba|jerson rufino": "Am",
  "filho pródigo|jerson rufino": "G",
  "o anjo do egito|jerson rufino": "Dm",

  // ==========================================================
  // LOTE 2/4 - LOUVORES ATUAIS (CONTEMPORÂNEOS / HITS)
  // ==========================================================

  // ═══════════════════════════════════════════════
  // VALESCA MAYSSA
  // ═══════════════════════════════════════════════
  "dias de guerra|valesca mayssa": "Am",
  "arvore cortada|valesca mayssa": "Em",
  "ta chorando por que|valesca mayssa": "C",
  "eu sou teu pai|valesca mayssa": "G",
  "boa obra|valesca mayssa": "C",
  "o encontro|valesca mayssa": "Em",

  // ═══════════════════════════════════════════════
  // MARIA MARÇAL
  // ═══════════════════════════════════════════════
  "deserto|maria marcal": "Cm",
  "deixa|maria marcal": "Em",
  "enquanto deus trabalha|maria marcal": "Am",
  "uma coisa nova|maria marcal": "Fm",
  "infinito|maria marcal": "G",

  // ═══════════════════════════════════════════════
  // JEFFERSON E SUELLEN
  // ═══════════════════════════════════════════════
  "saudade de casa|jefferson e suellen": "Am",
  "profetiza|jefferson e suellen": "Dm",
  "labareda|jefferson e suellen": "Em",

  // ═══════════════════════════════════════════════
  // CASA WORSHIP
  // ═══════════════════════════════════════════════
  "eu te vejo em tudo|casa worship": "C",
  "faz arraial|casa worship": "Am",
  "era eu|casa worship": "C",
  "vento impetuoso|casa worship": "Am",
  "yeshua|casa worship": "D",

  // ═══════════════════════════════════════════════
  // LEANDRO BORGES
  // ═══════════════════════════════════════════════
  "deus e eu|leandro borges": "C",
  "cresca|leandro borges": "F",
  "o silencio de deus|leandro borges": "Am",
  "um refrão pra sua alma|leandro borges": "C",
  "deixa eu te usar|leandro borges": "Em",

  // ═══════════════════════════════════════════════
  // JULLIANY SOUZA / LEO BRANDÃO
  // ═══════════════════════════════════════════════
  "lindo momento|julliany souza": "G",
  "eu me atraiu|julliany souza": "A",
  "sinto fluir|julliany souza": "D",
  "teu toque|leo brandao": "F",
  "a mesa|julliany souza": "G",

  // ═══════════════════════════════════════════════
  // KEMILLY SANTOS
  // ═══════════════════════════════════════════════
  "fica tranquilo|kemilly santos": "D",
  "o jogo virou|kemilly santos": "Cm",
  "a promessa|kemilly santos": "C",
  "tem cheiro de milagre|kemilly santos": "Am",

  // ═══════════════════════════════════════════════
  // JULIA VITORIA
  // ═══════════════════════════════════════════════
  "alem do rio azul|julia vitoria": "D",
  "tuas aguas|julia vitoria": "C",
  "somos teu povo|julia vitoria": "Em",

  // ═══════════════════════════════════════════════
  // TALES ROBERTO / OUTROS ATUAIS
  // ═══════════════════════════════════════════════
  "deus da minha vida|tales": "G",
  "cheios do espirito santo|tales": "Em",
  
  // ═══════════════════════════════════════════════
  // MIDIAN LIMA
  // ═══════════════════════════════════════════════
  "jo|midian lima": "Dm",
  "prioridade|midian lima": "C",
  "olhai pra cruz|midian lima": "F",

  // ═══════════════════════════════════════════════
  // DELINO MARÇAL
  // ═══════════════════════════════════════════════
  "guarda meu coracao|delino marcal": "D",
  "vim falar com deus|delino marcal": "A",

  // ═══════════════════════════════════════════════
  // ISAIAH SAAD / GABRIEL GUEDES
  // ═══════════════════════════════════════════════
  "ousado amor|gabriel guedes": "Em",
  "ele vem|gabriel guedes": "C",
  "noiva|gabriel guedes": "Em",
  "minhas guerras|gabriel guedes": "Am",
  "vitorioso es|gabriel guedes": "D",

  // ═══════════════════════════════════════════════
  // ISADORA POMPEO
  // ═══════════════════════════════════════════════
  "minha morada|isadora pompeo": "D",
  "bencaos que nao tem fim|isadora pompeo": "A",
  "oi jesus|isadora pompeo": "G",
  "seja forte|isadora pompeo": "Am",
  "toca em mim de novo|isadora pompeo": "C",
  "cicatrizes|isadora pompeo": "E",

  // ═══════════════════════════════════════════════
  // THIAGO MAKARIE
  // ═══════════════════════════════════════════════
  "ate que o senhor venha|thiago makarie": "G",
  "tu es tudo|thiago makarie": "D",

  // ═══════════════════════════════════════════════
  // VICTIN / RAP GOSPEL ATUAL
  // ═══════════════════════════════════════════════
  "ja agradeco|victin": "Em",
  "chamado|victin": "Am",
  "nobreza|victin": "Em",

  // ═══════════════════════════════════════════════
  // VITORIA SOUZA
  // ═══════════════════════════════════════════════
  "você vai ver|vitoria souza": "G",
  "não desista|vitoria souza": "C",

  // ═══════════════════════════════════════════════
  // HITS "CORINHOS" MODERNOS E RETETÉ (ATUAIS)
  // ═══════════════════════════════════════════════
  "eu vou passar pela cruz|": "Am",
  "quem te viu passar na prova|": "Cm",
  "santo es tu|": "D",
  "havera um amanhecer|": "F",
  "pode ser hoje|": "C",
  "a promessa|": "Em",
  "ta chorando porque|": "G",
  "o nazareno|": "Dm",
  "rejeitados|": "Am",
  "so quero ver voce|": "D",

  // ═══════════════════════════════════════════════
  // LUKAS AGUSTINHO
  // ═══════════════════════════════════════════════
  "algo novo|lukas agustinho": "C",
  "louve|lukas agustinho": "G",
  "em fervente oracao|lukas agustinho": "A",
  
  // ═══════════════════════════════════════════════
  // SAMUEL MESSIAS
  // ═══════════════════════════════════════════════
  "voce nao vai parar|samuel messias": "C",
  "os planos de deus|samuel messias": "G",

  // ═══════════════════════════════════════════════
  // SARAH FARIAS
  // ═══════════════════════════════════════════════
  "deixa eu te usar|sarah farias": "Em",
  "sobrevivi|sarah farias": "Am",
  "renovo|sarah farias": "F",
  "so quem tem raiz|sarah farias": "C",

  // ═══════════════════════════════════════════════
  // ELIAS SILVA / CLÁSSICOS PENTECOSTAIS CANTADOS HOJE
  // ═══════════════════════════════════════════════
  "livramento|elias silva": "G",
  "o agir de deus|elias silva": "Cm",
  
  // ═══════════════════════════════════════════════
  // MINISTÉRIO ZOE
  // ═══════════════════════════════════════════════
  "aquieta minh'alma|ministerio zoe": "G",
  "voce foi o primeiro a me amar|ministerio zoe": "D",
  "nunca foi sobre nos|ministerio zoe": "E",
  "fogo chora|ministerio zoe": "Am",

  // ═══════════════════════════════════════════════
  // TON CARFI
  // ═══════════════════════════════════════════════
  "porque eu te amei|ton carfi": "E",
  "orei por voce|ton carfi": "C",
  "historia de davi|ton carfi": "G",
  "infinitamente mais|ton carfi": "D",

  // ═══════════════════════════════════════════════
  // ALISSON E NEIDE
  // ═══════════════════════════════════════════════
  "sinceridade|alisson e neide": "Fm",
  "paulo e silas|alisson e neide": "Am",
  "dependente|alisson e neide": "G",

  // ═══════════════════════════════════════════════
  // EULA PAULA
  // ═══════════════════════════════════════════════
  "se a igreja orar|eula paula": "C",

  // ═══════════════════════════════════════════════
  // IGREJA BATISTA ATITUDE
  // ═══════════════════════════════════════════════
  "nada temerei|batista atitude": "E",
  "vitorioso es|batista atitude": "D",
  "meu amado|batista atitude": "G",

  // ═══════════════════════════════════════════════
  // ADAHABY / CENTRAL 3 (HITS)
  // ═══════════════════════════════════════════════
  "me leva pra casa|central 3": "Em",
  "nao ha outro lugar|central 3": "G",
  "eu me rendo|central 3": "D",

  // ==========================================================
  // LOTE 3/4 - GRANDES MINISTÉRIOS E CONGREGAÇÃO CLÁSSICA (ANOS 90/2000)
  // ==========================================================

  // ═══════════════════════════════════════════════
  // DIANTE DO TRONO (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "preciso de ti|diante do trono": "D",
  "aguas purificadoras|diante do trono": "G",
  "nos bracos do pai|diante do trono": "D",
  "quero subir|diante do trono": "Am",
  "tempo de festa|diante do trono": "E",
  "me amou primeiro|diante do trono": "C",
  "cançao do amor|diante do trono": "G",
  "a vitoria da cruz|diante do trono": "Em",
  "cordeiro e leao|diante do trono": "D",
  "esperanca|diante do trono": "C",
  "manancial|diante do trono": "A",
  "aos olhos do pai|diante do trono": "E",
  "te agradeco|diante do trono": "G",

  // ═══════════════════════════════════════════════
  // VINEYARD BRASIL
  // ═══════════════════════════════════════════════
  "vem esta e a hora|vineyard": "D",
  "me derramar|vineyard": "D",
  "senhor te quero|vineyard": "G",
  "reina em mim|vineyard": "C",
  "teu nome e santo|vineyard": "Am",
  "mais que um amigo|vineyard": "C",
  "quebrantado|vineyard": "E",
  "fome|vineyard": "G",
  "meu respirar|vineyard": "A",
  "entrega|vineyard": "D",
  "aleluia gloria|vineyard": "G",

  // ═══════════════════════════════════════════════
  // ADHEMAR DE CAMPOS
  // ═══════════════════════════════════════════════
  "ele e exaltado|adhemar de campos": "F",
  "tributo a yehovah|adhemar de campos": "Em",
  "bem supremo|adhemar de campos": "D",
  "grande e o senhor|adhemar de campos": "A",
  "homem de guerra|adhemar de campos": "Am",
  "o leao da tribo de juda|adhemar de campos": "Em",
  "pela fe|adhemar de campos": "D",

  // ═══════════════════════════════════════════════
  // ALINE BARROS E CIA / INFANTIL CLÁSSICO
  // ═══════════════════════════════════════════════
  "homenzinho torto|aline barros": "C",
  "pula pula|aline barros": "G",
  "arca de noe|aline barros": "D",
  "dança do pinguim|aline barros": "E",
  "sou um milagre|aline barros": "C",
  "consagraçao|aline barros": "G",

  // ═══════════════════════════════════════════════
  // CORINHOS CLÁSSICOS DE IGREJA (ANOS 80 E 90)
  // ═══════════════════════════════════════════════
  "estamos aqui senhor|": "G",
  "a alegria esta no coracao|": "D",
  "posso pisar numa tropa|": "Em",
  "se o espirito de deus se move em mim|": "Em",
  "eu tenho um amigo que me ama|": "E",
  "vem com josue lutar em jerico|": "Am",
  "jesus em tua presenca|": "D",
  "leao de juda prevaleceu|": "Em",
  "os que confiam no senhor|": "Am",
  "cada passo que dás|": "C",

  // ═══════════════════════════════════════════════
  // ASAPH BORBA (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "infinitamente mais|asaph borba": "D",
  "o meu louvor|asaph borba": "G",
  "jesus e o rei da gloria|asaph borba": "E",

  // ═══════════════════════════════════════════════
  // LUDMILA FERBER (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "ouco deus me chamar|ludmila ferber": "C",
  "uncao sem limites|ludmila ferber": "G",
  "a docura do teu falar|ludmila ferber": "E",

  // ═══════════════════════════════════════════════
  // TOQUE NO ALTAR / TRAZENDO A ARCA (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "meu amado|toque no altar": "D",
  "nao importa o dia|trazendo a arca": "A",
  "desperta|trazendo a arca": "Em",
  "cruz|trazendo a arca": "C",
  "o chao vai tremer|trazendo a arca": "Dm",
  "invoca-me|trazendo a arca": "G",
  "celebre|trazendo a arca": "E",

  // ═══════════════════════════════════════════════
  // PASTOR ANTÔNIO CIRILO / SANTA GERAÇÃO
  // ═══════════════════════════════════════════════
  "poderoso deus|antonio cirilo": "D",
  "intencidade|antonio cirilo": "A",
  "fogo e gloria|antonio cirilo": "E",
  "nao ha outro como tu|antonio cirilo": "C",
  "teu fluxo de amor|antonio cirilo": "G",

  // ═══════════════════════════════════════════════
  // NENEA SOARES (NÍVEA) - MAIS ANTIGAS
  // ═══════════════════════════════════════════════
  "meu amor maior|nivea soares": "G",
  "centro da tua vontade|nivea soares": "D",
  "eis me aqui|nivea soares": "E",
  "gloria e honra|nivea soares": "A",

  // ═══════════════════════════════════════════════
  // DAVID QUINLAN
  // ═══════════════════════════════════════════════
  "abracame|david quinlan": "G",
  "aguas profundas|david quinlan": "D",
  "fogo e gloria|david quinlan": "E",
  "geracao que danca|david quinlan": "Am",
  "te amo|david quinlan": "C",

  // ═══════════════════════════════════════════════
  // HELOISA ROSA (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "estou livre|heloisa rosa": "G",
  "vaidade|heloisa rosa": "Em",
  "quero dancar|heloisa rosa": "D",
  "estantes de uma vida|heloisa rosa": "Am",
  "teu fluir|heloisa rosa": "C",

  // ═══════════════════════════════════════════════
  // CLAMOR PELAS NAÇÕES
  // ═══════════════════════════════════════════════
  "mergulhar|clamor pelas nacoes": "E",
  "o deserto|clamor pelas nacoes": "Bm",
  "que amor e esse|clamor pelas nacoes": "G",

  // ═══════════════════════════════════════════════
  // FERNANDINHO (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "abundante chuva|fernandinho": "Dm",
  "danca dos pinguins|fernandinho": "C",
  "galileu|fernandinho": "Dm",
  "seda rocha|fernandinho": "G",
  "eu vou subir a montanha|fernandinho": "A",
  "ainda que a figueira|fernandinho": "Em",
  "faz chover|fernandinho": "Em",

  // ═══════════════════════════════════════════════
  // LUIZ DE CARVALHO / VITORINO SILVA (TRADICIONAIS)
  // ═══════════════════════════════════════════════
  "alvo mais que a neve|luiz de carvalho": "C",
  "cem ovelhas|vitorino silva": "G",
  "o rei esta voltando|vitorino silva": "E",

  // ═══════════════════════════════════════════════
  // MARA LIMA
  // ═══════════════════════════════════════════════
  "alem da medicina|mara lima": "D",
  "daniel|mara lima": "Am",
  "uncao divina|mara lima": "Fm",
  "sabe filho|mara lima": "G",

  // ═══════════════════════════════════════════════
  // ROZEANE RIBEIRO
  // ═══════════════════════════════════════════════
  "e deus|rozeane ribeiro": "Am",
  "o hino da vitoria|rozeane ribeiro": "C",
  "jeova jireh|rozeane ribeiro": "Dm",

  // ═══════════════════════════════════════════════
  // CASSIANE (EXPANSÃO CORINHOS/ANTIGAS)
  // ═══════════════════════════════════════════════
  "a cura|cassiane": "G",
  "recompensa|cassiane": "E",
  "ele e o rei|cassiane": "Dm",
  "sementes da fe|cassiane": "Am",
  "lugar cheio de gloria|cassiane": "C",

  // ═══════════════════════════════════════════════
  // EYSHILA (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "jesus o brasil quer te adorar|eyshila": "G",
  "falando de vida|eyshila": "D",
  "deus cuida de mim|eyshila": "C", // cover
  "eu quero ser santo|eyshila": "Em",

  // ==========================================================
  // LOTE 4/4 - MAIS LOUVORES ATUAIS / VIRAL (TIKTOK/REELS) / RECENTES
  // ==========================================================

  // ═══════════════════════════════════════════════
  // NATHÁLIA BRAGA (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "deus te escondeu|nathalia braga": "Am",
  "o choro dura uma noite|nathalia braga": "G",
  "eu nao desisto|nathalia braga": "Em",

  // ═══════════════════════════════════════════════
  // KELLEN BYANCA
  // ═══════════════════════════════════════════════
  "esta tudo bem|kellen byanca": "C",
  "o tempo e de deus|kellen byanca": "Am",
  "pode dormir tranquilo|kellen byanca": "G",

  // ═══════════════════════════════════════════════
  // THALES ROBERTO / ATUAIS (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "mesmo sem entender|thalles roberto": "D",
  "nada alem do sangue|thalles roberto": "G",
  "quando o mundo cai ao meu redor|thalles roberto": "Em",

  // ═══════════════════════════════════════════════
  // ISADORA POMPEO (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "como nunca antes|isadora pompeo": "Am",
  "nem um segundo|isadora pompeo": "C",
  "historia|isadora pompeo": "G",
  "resultado|isadora pompeo": "Dm",
  "guia me|isadora pompeo": "D",
  "pra te contar os meus segredos|isadora pompeo": "Am",

  // ═══════════════════════════════════════════════
  // STELLA LAURA (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "meu socorro|stella laura": "Em",
  "plano perfeito|stella laura": "C",
  "conta pra mim|stella laura": "Am",

  // ═══════════════════════════════════════════════
  // JEFFERSON E SUELLEN (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "esperança|jefferson e suellen": "C",
  "fogo no pe|jefferson e suellen": "Em",

  // ═══════════════════════════════════════════════
  // LUKAS AGUSTINHO (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "meu irmao|lukas agustinho": "C",
  "foi a mao de deus|lukas agustinho": "G",

  // ═══════════════════════════════════════════════
  // ALESSANDRO VILAS BOAS (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "encontrei o meu lugar|alessandro vilas boas": "G",
  "tu es tudo que eu preciso|alessandro vilas boas": "C",
  "me leva mais alto|alessandro vilas boas": "D",

  // ═══════════════════════════════════════════════
  // ISAÍAS SAAD (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "enquanto eu viver|isaias saad": "C",
  "agua viva|isaias saad": "G",
  "nao ha outro|isaias saad": "F",

  // ═══════════════════════════════════════════════
  // LULLY
  // ═══════════════════════════════════════════════
  "o que o mundo nao pode dar|lully": "Am",
  "perdao|lully": "C",

  // ═══════════════════════════════════════════════
  // ELI SOARES
  // ═══════════════════════════════════════════════
  "me ajude a melhorar|eli soares": "G",
  "se eu cair|eli soares": "C",
  "os anjos te louvam|eli soares": "D",
  "tudo que eu sou|eli soares": "A",
  "graca|eli soares": "Em",
  "promessa|eli soares": "D",

  // ═══════════════════════════════════════════════
  // PRISCILLA ALCANTARA (FASE GOSPEL)
  // ═══════════════════════════════════════════════
  "girassol|priscilla alcantara": "G",
  "sobrevivi|priscilla alcantara": "Em",
  "inteiro|priscilla alcantara": "D",
  "correntes|priscilla alcantara": "C",

  // ═══════════════════════════════════════════════
  // JULIA VITORIA (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "tu es bom|julia vitoria": "D",
  "fome e sede|julia vitoria": "C",
  "se o espirito santo|julia vitoria": "Am",

  // ═══════════════════════════════════════════════
  // BE ONE MUSIC / IGREJA DA CIDADE
  // ═══════════════════════════════════════════════
  "deixa queimar|be one": "C",
  "bom bom pai|be one": "G",
  "fogo|be one": "Am",

  // ═══════════════════════════════════════════════
  // TON CARFI (ATUAIS E FEATS)
  // ═══════════════════════════════════════════════
  "minha vez|ton carfi": "G",
  "hospital|ton carfi": "Dm",
  "a cruz|ton carfi": "A",

  // ═══════════════════════════════════════════════
  // PAULO NETO
  // ═══════════════════════════════════════════════
  "tua presenca|paulo neto": "Em",
  "nao foi por acaso|paulo neto": "Am",
  "ressurreicao em naim|paulo neto": "Fm",
  "ze e marta|paulo neto": "Cm",

  // ═══════════════════════════════════════════════
  // VITORIA SOUZA
  // ═══════════════════════════════════════════════
  "processo|vitoria souza": "Em",
  "ele trabalha|vitoria souza": "G",

  // ═══════════════════════════════════════════════
  // GABRIEL GUEDES (EXPANSÃO)
  // ═══════════════════════════════════════════════
  "nada mais|gabriel guedes": "C",
  "te exaltamos|gabriel guedes": "D",
  "dono do meu ser|gabriel guedes": "G",
  "meu coracao te pertence|gabriel guedes": "Am",

  // ═══════════════════════════════════════════════
  // SARAH BEATRIZ
  // ═══════════════════════════════════════════════
  "todavia me alegrarei|sarah beatriz": "E", // Cover
  "basta acreditar|sarah beatriz": "G",
  "promessas|sarah beatriz": "Am", // Cover
  "o maior vilão sou eu|sarah beatriz": "Em",

  // ═══════════════════════════════════════════════
  // MARIANA VALADÃO
  // ═══════════════════════════════════════════════
  "hosana|mariana valadao": "C",
  "se eu apenas te tocar|mariana valadao": "D",
  "vai brilhar|mariana valadao": "G",

  // ═══════════════════════════════════════════════
  // NVI (NOVA VERSÃO INTERNACIONAL) / VERSÕES ATUAIS
  // ═══════════════════════════════════════════════
  "jeova jireh|": "Em", // Aline Barros versão atual
  "leao da tribo de juda|": "Em",
  "tu es rei|": "G",
  "nada temerei|": "Em",

  // ═══════════════════════════════════════════════
  // MAIS CORINHOS DE FOGO / AVIVAMENTO ATUAL (RETETÉ)
  // ═══════════════════════════════════════════════
  "eu marquei um encontro com deus|": "Am",
  "fogo no altar|": "Em",
  "vai tremer|": "Am",
  "canta que eu cuido|": "C",
  "pisa no inimigo|": "Em",
  "marcha marchando|": "G",
  "vem espirito santo|": "C",
  "toca-me|": "D",

  // ═══════════════════════════════════════════════
  // HITS GERAIS DA INTERNET (TIKTOK/REELS GOSPEL)
  // ═══════════════════════════════════════════════
  "deus ta te ensinando a ser forte|": "Em",
  "ta chorando por que|": "C",
  "calma, deus esta cuidando de tudo|": "G",
  "deixa deus fazer|": "Am",
  "voce vai vencer|": "C",
  "nao e o fim|": "D",
  "haverá milagres|": "F",
  "deus vai te surpreender|": "G",
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
 * Mapa normalizado em tempo de execução para garantir que acentos 
 * inseridos no hardcode não quebrem a busca exata ou parcial.
 */
const NORMALIZED_WORSHIP_KEYS: Record<string, string> = {};
for (const [key, tone] of Object.entries(WORSHIP_KEYS)) {
  const [title, artist] = key.split("|");
  const normKey = `${normalize(title)}|${artist ? normalize(artist) : ""}`;
  NORMALIZED_WORSHIP_KEYS[normKey] = tone;
}

/**
 * Busca a tonalidade de uma musica no banco interno.
 * Retorna o tom se encontrado, ou null caso nao encontre.
 */
export function lookupWorshipKey(title: string, artist: string): string | null {
  const normTitle = normalize(title);
  const normArtist = normalize(artist);

  // 1. Busca exata titulo|artista
  const exactKey = `${normTitle}|${normArtist}`;
  if (NORMALIZED_WORSHIP_KEYS[exactKey]) return NORMALIZED_WORSHIP_KEYS[exactKey];

  // 2. Busca parcial: titulo e artista contidos na chave
  for (const [key, tone] of Object.entries(NORMALIZED_WORSHIP_KEYS)) {
    const [keyTitle, keyArtist] = key.split("|");
    if (!keyArtist) continue;
    const titleMatch = normTitle === keyTitle || normTitle.includes(keyTitle) || keyTitle.includes(normTitle);
    const artistMatch = normArtist === keyArtist || normArtist.includes(keyArtist) || keyArtist.includes(normArtist);
    if (titleMatch && artistMatch) return tone;
  }

  // 3. Busca so por titulo (fallback)
  for (const [key, tone] of Object.entries(NORMALIZED_WORSHIP_KEYS)) {
    const [keyTitle] = key.split("|");
    if (keyTitle && (normTitle === keyTitle || normTitle.includes(keyTitle) || keyTitle.includes(normTitle))) {
      return tone;
    }
  }

  return null;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/**
 * Tenta buscar o tom original da música diretamente na página do Cifra Club em tempo real.
 */
export async function fetchCifraClubKey(artist: string, title: string): Promise<string | null> {
  if (!title) return null;

  // Limpa o nome do artista principal (remove feat, &, etc)
  const mainArtist = (artist || "").split(/&|feat|ft\.|,|\b-\b|\be\b/i)[0].trim();

  const rawSlugArtist = slugify(mainArtist);
  const rawSlugTitle = slugify(title);
  if (!rawSlugTitle) return null;

  // Variações inteligentes de slugs para contornar remoção de artigos pelo Cifra Club (ex: "sarando-terra-ferida")
  const artistVariants = new Set<string>();
  if (rawSlugArtist) {
    artistVariants.add(rawSlugArtist);
    // Remove artigos intermediários (-a-, -o-, -de-, -da-, -do-)
    artistVariants.add(rawSlugArtist.replace(/-a-|-o-|-de-|-da-|-do-|-e-/g, "-"));
    // Remove prefixos como ministerio-, banda-, grupo-
    const noPrefix = rawSlugArtist.replace(/^(ministerio|min|banda|grupo)-/i, "");
    artistVariants.add(noPrefix);
    artistVariants.add(noPrefix.replace(/-a-|-o-|-de-|-da-|-do-|-e-/g, "-"));
  }

  const titleVariants = new Set<string>();
  titleVariants.add(rawSlugTitle);
  // Remove artigos iniciais no título (o-haja-de-deus -> haja-de-deus)
  const noTitleArticle = rawSlugTitle.replace(/^(o|a|os|as)-/i, "");
  if (noTitleArticle !== rawSlugTitle) {
    titleVariants.add(noTitleArticle);
  }

  // Gera todas as combinações possíveis de URLs
  const candidateUrls: string[] = [];
  for (const aSlug of Array.from(artistVariants)) {
    for (const tSlug of Array.from(titleVariants)) {
      candidateUrls.push(`https://www.cifraclub.com.br/${aSlug}/${tSlug}/`);
    }
  }
  for (const tSlug of Array.from(titleVariants)) {
    candidateUrls.push(`https://www.cifraclub.com.br/${tSlug}/`);
  }

  for (const targetUrl of candidateUrls) {
    // Tenta fetch direto primeiro. Se der erro de CORS/rede no navegador, tenta os proxies.
    const urlsToTry = [
      targetUrl,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
    ];

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!res.ok) continue;
        const html = await res.text();
        if (!html || html.length < 500) continue;

        // 1. Novo layout do Cifra Club
        const match1 = html.match(/data-anchor="--chord-tone"[^>]*>([A-G][#b]?m?)</i);
        if (match1) return match1[1];

        // 2. Layout clássico do Cifra Club
        const match2 = html.match(/id="js-c-key"[^>]*>([A-G][#b]?m?)</i);
        if (match2) return match2[1];

        // 3. Fallback scan: palavra "Tom" seguida da nota
        const match3 = html.match(/Tom[\s\S]{0,150}?>\s*([A-G][#b]?m?)\s*</i);
        if (match3) return match3[1];
      } catch (e) {
        // Falha de CORS ou rede -> tenta próximo proxy
      }
    }
  }

  return null;
}

/**
 * Converte uma string de tom (ex: "Am", "F#m", "C", "C Menor") em { key: "A", keyMode: "Menor", fullKey: "A Menor" }
 */
export function parseKeyAndMode(rawKey: string | null): { key: string; keyMode: "Maior" | "Menor"; fullKey: string } {
  if (!rawKey) return { key: "C", keyMode: "Maior", fullKey: "C" };
  const clean = rawKey.trim();

  const isMinor = clean.endsWith("m") || clean.endsWith(" Menor") || clean.endsWith(" minor");
  let baseKey = clean
    .replace(/m$/, "")
    .replace(/\s+Menor$/i, "")
    .replace(/\s+minor$/i, "")
    .replace(/\s+Maior$/i, "")
    .trim();

  if (baseKey.length >= 1) {
    baseKey = baseKey.charAt(0).toUpperCase() + baseKey.slice(1);
  }

  if (isMinor) {
    return { key: baseKey, keyMode: "Menor", fullKey: `${baseKey} Menor` };
  }
/**
 * Identifica o tom original usando EXCLUSIVAMENTE o banco de dados interno local.
 * Isso garante que a busca seja instantânea (0 milissegundos) e não dependa da internet ou do Cifra Club.
 */
export async function getBestSongKey(artist: string, title: string): Promise<{ key: string; keyMode: "Maior" | "Menor"; fullKey: string }> {
  // 1. Tenta banco de dados local (instantâneo)
  const localKey = lookupWorshipKey(title, artist);
  if (localKey) {
    return parseKeyAndMode(localKey);
  }

  // 2. Se não encontrar no banco local, retorna C Maior imediatamente
  return { key: "C", keyMode: "Maior", fullKey: "C" };
}

