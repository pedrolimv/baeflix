/* ==========================================================================
   BAEFLIX — arquivo de conteúdo
   --------------------------------------------------------------------------
   É só editar este arquivo para trocar textos, vídeos e capas.

   Convenção de arquivos (não precisa escrever o caminho se seguir ela):
     • Capa (horizontal 16:9, com título)  →  imagens/capas/<id>.jpg
     • Pôster (vertical 2:3, com título)   →  imagens/posters/<id>.jpg
     • Vídeo                               →  videos/<id>.mp4
   Opcionais, para o banner grande com o título separado da imagem:
     • fundo:       imagem horizontal SEM título
     • fundoMobile: imagem vertical SEM título (celular)

   data: 'AAAA-MM-DD' → aparece como data de lançamento e o ano no banner.
   mostrarTitulo: false → a capa já tem o título desenhado, o site não escreve por cima.
   ========================================================================== */

window.BAEFLIX = {
  inicioNamoro: '2022-10-22',
  autor: 'Pedro',
  homenageada: 'Bae',
  elenco: 'Beatriz Nakamura, Pedro Lima',

  // Login (email OU celular + senha), guardado só como hash SHA-256 para não ficar legível no GitHub.
  // Para trocar, gere o hash de 'baeflix|email|<email minúsculo>', 'baeflix|tel|<DDD+número, 11 dígitos>'
  // e 'baeflix|senha|<SENHA EM MAIÚSCULAS>' (ex.: no console do navegador: Baeflix.sha256('baeflix|senha|NOVA')).
  acesso: {
    contas: [
      'c80fae30c84af87083deb313fd820941529aa6c9c8db411e1c2809183706e24c', // email
      'c39228898a557a3c8b587191195afacd572b657c75080940ab70b755cbea069b'  // celular
    ],
    senha: 'a2469fe7ccd4134bd08aa798e2068d3c723f187ae54754f93810ada73b8bda18'
  },

  // Perfis da tela "Quem está assistindo?"
  // avatar: foto quadrada. Se não existir, usa o rostinho padrão na cor escolhida.
  perfis: [
    { id: 'pedro', nome: 'pedro the fato', avatar: 'imagens/perfis/pedro.webp', cor: '#2b7bd6' },
    { id: 'bae',   nome: 'bae the fato',   avatar: 'imagens/perfis/bae.webp',   cor: '#e50914' }
  ],

  // Banner grande da tela Início
  destaque: {
    id: 'simplesmente-acontece',
    tituloHero: 'simplesmente|acontece',  // | quebra a linha
    estiloTitulo: 'sa',                   // fonte igual à do pôster
    chips: ['Top 1 em filmes hoje', 'Achamos que você vai amar isto!']
    // video: 'videos/simplesmente-acontece.mp4', // opcional: vídeo tocando no fundo do banner
  },

  // Fileiras da tela Início (na ordem). top10: true = fileira com números gigantes.
  categorias: [
    { titulo: 'Principais escolhas do dia para você', itens: ['simplesmente-acontece', 'para-unica-garota-que-amarei', 'nossa-vibe', 'a-minha-noite-estrelada', 'a-minha-escolha-perfeita', 'spider-verse-baeverse', 'prints-para-beatriz', 'ferias-de-verao', 'preto-e-branco-combina', 'amizade-em-quarentena'] },
    { titulo: 'Brasil: top 10 em filmes hoje', top10: true, itens: ['simplesmente-acontece', 'nossa-vibe', 'preto-e-branco-combina', 'para-unica-garota-que-amarei', 'a-minha-noite-estrelada', 'spider-verse-baeverse', 'a-minha-escolha-perfeita', 'prints-para-beatriz', 'ferias-de-verao', 'amizade-em-quarentena'] },
    { titulo: 'Filmes românticos', itens: ['simplesmente-acontece', 'para-unica-garota-que-amarei', 'a-minha-escolha-perfeita', 'a-minha-noite-estrelada', 'preto-e-branco-combina', 'nossa-vibe'] },
    { titulo: 'Filmes com forte protagonista feminina', itens: ['a-minha-noite-estrelada', 'a-minha-escolha-perfeita', 'para-unica-garota-que-amarei', 'simplesmente-acontece', 'prints-para-beatriz'] },
    { titulo: 'Comédias para assistir juntinhos', itens: ['prints-para-beatriz', 'spider-verse-baeverse', 'nossa-vibe', 'ferias-de-verao', 'amizade-em-quarentena'] },
    { titulo: 'Histórias de amizade', itens: ['prints-para-beatriz', 'ferias-de-verao', 'amizade-em-quarentena', 'preto-e-branco-combina', 'simplesmente-acontece'] },
    { titulo: 'Em breve', itens: ['days-before-the-day'] }
  ],

  // Cria uma fileira por ano de lançamento
  linhasPorAno: true,
  titulosAnos: {
    2018: '2018: onde tudo começou',
    2019: '2019: as férias que mudaram tudo',
    2020: '2020: juntos, mesmo de longe',
    2021: '2021: até que aconteceu',
    2022: '2022: o começo de nós',
    2023: '2023: nosso primeiro ano',
    2026: '2026: quatro anos de nós'
  },

  // Títulos "Em breve" (aparecem em Bombando e na fileira acima)
  emBreve: [
    { id: 'days-before-the-day', titulo: 'Days Before the Day', data: '2027-05-10', generos: ['Romance'], estiloTitulo: 1,
      capa: 'imagens/capas/days-before-the-day.webp', poster: 'imagens/posters/days-before-the-day.webp',
      clima: ['Misterioso', 'Romântico', 'Imperdível'],
      descricao: 'Os dias que antecedem o grande dia. O próximo capítulo da nossa história já está sendo escrito.' }
  ],

  /* ------------------------------------------------------------------------
     FILMES
     classificacao: 'L','10','12','14','16','18'  •  novidade: true → selo vermelho "Novidade"
     top10: true → selo TOP 10
     ------------------------------------------------------------------------ */
  videos: [
    { id: 'simplesmente-acontece', titulo: 'Simplesmente Acontece', tipo: 'filme', data: '2026-10-22', duracao: '', generos: ['Romance', 'Drama'], classificacao: 'L', top10: true, novidade: true, mostrarTitulo: false,
      fundo: 'imagens/fundos/simplesmente-acontece.jpg', fundoMobile: 'imagens/fundos/simplesmente-acontece-mobile.jpg',
      clima: ['Romântico', 'Emocionante', 'De amigos a namorados'],
      descricao: 'Beatriz e Pedro cresceram na mesma igreja, cantando os mesmos louvores e passando pelos mesmos corredores desde pequenos, mas só foram se conhecer de verdade na adolescência. Entre conversas que nunca acabavam, uma amizade sincera e alguns desencontros pelo caminho, os dois descobrem que as histórias mais bonitas não se planejam: simplesmente acontecem.' },

    { id: 'nossa-vibe', titulo: 'Nossa Vibe', tipo: 'filme', data: '2023-10-22', duracao: '3min', generos: ['Romance', 'Comédia'], classificacao: 'L', top10: true, mostrarTitulo: false,
      clima: ['Aconchegante', 'Divertido', 'Romântico'],
      descricao: 'Somos levados a uma jornada divertida e única através do primeiro ano de um namoro cheio de vida. O casal, apaixonado pela culinária, cinema e sessões de jogos, vive momentos de puro êxtase enquanto explora a beleza de compartilhar suas paixões e risadas. Juntos, criam uma história cativante sobre a construção de um relacionamento cheio de momentos incríveis, celebrando a vibe única entre os dois e iluminando a tela com o brilho do amor e da diversão.' },

    { id: 'preto-e-branco-combina', titulo: 'Preto & Branco Combina?', tipo: 'filme', data: '2021-09-26', duracao: '2min', generos: ['Romance', 'Drama'], classificacao: 'L', top10: true, mostrarTitulo: false,
      clima: ['Adorável', 'Intenso', 'Romântico'],
      descricao: 'Uma história adorável que gira em torno da vida de dois amigos. Ambos compartilham uma conexão especial e uma amizade profunda, mas são incapazes de perceber (até acontecer) que há algo mais entre eles: o amor.' },

    { id: 'para-unica-garota-que-amarei', titulo: 'Para a Única Garota que Amarei', tipo: 'filme', data: '2023-06-12', duracao: '4min', generos: ['Romance', 'Drama'], classificacao: 'L', top10: true, mostrarTitulo: false,
      clima: ['Romântico', 'Emocionante', 'Sincero'],
      descricao: 'Um namorado decidido a demonstrar seu amor pela namorada através de gestos românticos e criativos, em busca de manter o amor sempre aceso. Uma linda jornada que celebra a importância de expressar o amor de uma maneira genuína.' },

    { id: 'a-minha-noite-estrelada', titulo: 'A Minha Noite Estrelada', tipo: 'filme', data: '2023-10-22', duracao: '1min', generos: ['Romance', 'Arte'], classificacao: 'L', top10: true, mostrarTitulo: false,
      clima: ['Apaixonado', 'Artístico', 'Romântico'],
      descricao: 'Um filme romântico e apaixonado que se inspira na arte de Vincent van Gogh. A história segue a perspectiva de um namorado profundamente romântico e grande admirador de sua namorada, que enxerga sua amada como a estrela da sua noite, assim como Van Gogh via as estrelas no céu.' },

    { id: 'spider-verse-baeverse', titulo: 'Spider-Verse: Into the Baeverse', tipo: 'filme', data: '2023-10-22', duracao: '1min', generos: ['Comédia', 'Aventura', 'Ação'], classificacao: '10', top10: true, mostrarTitulo: false,
      clima: ['De tirar o fôlego', 'Divertido', 'Heroico'],
      descricao: 'Uma comédia e aventura de tirar o fôlego que narra a vida agitada de um casal aranha, Beatriz e Pedro, enquanto enfrentam os desafios da vida a dois. Unidos para manter o equilíbrio do Bae-Verse e o amor na relação, eles tornam suas teias de amor ainda mais fortes.' },

    { id: 'a-minha-escolha-perfeita', titulo: 'A Minha Escolha Perfeita', tipo: 'filme', data: '2022-10-22', duracao: '2min', generos: ['Romance', 'Drama'], classificacao: 'L', top10: true, mostrarTitulo: false,
      clima: ['Romântico', 'Emocionante', 'Corajoso'],
      descricao: 'Essa história romântica nos leva a acompanhar de perto a vida de Beatriz e Pedro, enquanto eles descobrem que o amor entre eles é mais forte do que nunca. Com uma mistura de emoção e incerteza, o filme nos envolve em uma jornada repleta de decisões importantes e da coragem necessária para seguir o coração.' },

    { id: 'prints-para-beatriz', titulo: 'Prints para Beatriz', tipo: 'filme', data: '2018-07-16', duracao: '1min', generos: ['Comédia'], classificacao: '12', top10: true, mostrarTitulo: false,
      clima: ['Fofoqueiro', 'Divertido', 'Venenoso'],
      descricao: 'Uma comédia que mergulha na vida de dois amigos fofoqueiros e suas venenosas conversas pelo WhatsApp. Conheça Pedro e Beatriz, uma dupla inseparável que, com suas fofocas, pode acabar com algumas vidas.' },

    { id: 'ferias-de-verao', titulo: 'Férias de Verão', tipo: 'filme', data: '2019-01-21', duracao: '1min', generos: ['Aventura', 'Amizade'], classificacao: 'L', top10: true, mostrarTitulo: false,
      clima: ['Ensolarado', 'Divertido', 'Leve'],
      descricao: 'A aventura que narra a vida de dois amigos durante as esperadas férias de verão. Juntos, eles embarcam em uma jornada de descoberta, diversão e amizade que os levará a diferentes lugares e os conectará de maneira especial.' },

    { id: 'amizade-em-quarentena', titulo: 'Amizade em Quarentena', tipo: 'filme', data: '2020-01-27', duracao: '1min', generos: ['Drama', 'Amizade'], classificacao: '10', top10: true, mostrarTitulo: false,
      clima: ['Tocante', 'Nostálgico', 'Inspirador'],
      descricao: 'O filme tocante que retrata a história de dois amigos inseparáveis que enfrentaram a pandemia de COVID-19 isolados, sem sair de casa. Durante um ano inteiro, eles mantiveram a amizade viva através de mensagens de texto e chamadas de vídeo.' }
  ]
};
