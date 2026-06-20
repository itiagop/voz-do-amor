import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const books = [
  {
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    pageCount: 8,
    category: 'clássico',
    description: 'Um piloto cai no deserto e conhece um pequeno príncipe de outro planeta.',
    pages: [
      'Era uma vez um pequeno príncipe que vivia em um planeta do tamanho de uma casa. Ele tinha três vulcões — dois ativos e um extinto — e uma rosa muito vaidosa que achava ser a flor mais linda do universo.',
      'O pequeno príncipe cuidava do seu planeta todos os dias. Arrancava as árvores gigantes chamadas baobás que cresciam sem parar e limpava seus vulcõezinhos com muito capricho. A rosa exigia atenção constante.',
      'Mas a rosa era muito orgulhosa e difícil de entender. Um dia, o pequeno príncipe decidiu viajar para conhecer outros planetas. Disse adeus à sua rosa, mesmo triste, e partiu com um bando de pássaros selvagens.',
      'Ele visitou vários planetas. Em um, morava um rei que mandava em tudo, mas não tinha súditos. Em outro, um acendedor de lampiões que acendia e apagava sem parar porque o planeta girava muito rápido.',
      'Depois visitou o planeta do geógrafo, que lhe disse: — Vá visitar a Terra, ela é famosa! O principezinho então seguiu viagem, curioso para conhecer esse planeta tão especial.',
      'Na Terra, ele encontrou uma serpente que falava em enigmas e uma flor que tinha apenas três pétalas. Depois caminhou pelo deserto até encontrar um aviador que havia caído com seu avião.',
      '— Faz de conta que sou teu amigo? — perguntou o principezinho. O aviador, que estava consertando seu avião, aceitou a amizade. O principezinho contou então todas as suas aventuras.',
      'Foi a raposa que ensinou ao principezinho a grande lição: — O essencial é invisível aos olhos. Só se vê bem com o coração. E ele entendeu que, em todo o universo, a sua rosa era única.',
    ],
  },
  {
    title: 'A Lagartinha Comilona',
    author: 'Eric Carle',
    pageCount: 8,
    category: 'infantil',
    description: 'Uma lagartinha muito comilona come de tudo até virar uma linda borboleta.',
    pages: [
      'Numa linda noite de luar, uma folha verdinha descansava em um galho. Sobre ela, um ovo minúsculo e branquinho brilhava sob a luz da lua. Dentro dele, uma lagartinha estava prestes a nascer.',
      'No domingo de manhã, o sol quentinho apareceu no céu. Ploc! Um barulhinho gostoso. Da casca do ovo saiu uma lagartinha muito pequena, mas muito, mas muito faminta.',
      'Ela começou a procurar comida. Na segunda-feira, ela comeu uma maçã vermelha e crocante. Mas ainda estava com fome. Na terça, comeu duas peras doces e suculentas. Ainda com fome!',
      'Na quarta-feira, ela comeu três ameixas roxas. Na quinta, quatro morangos vermelhinhos. Na sexta-feira, cinco laranjas bem doces. Mas ainda assim, ela estava com fome!',
      'No sábado, ela comeu um pedaço de bolo de chocolate, uma bola de sorvete de creme, um picolé de limão, uma fatia de queijo, uma salsicha quentinha, um cupcake com glacê e uma fatia de melancia.',
      'Ela comeu tanto que ficou com uma enorme dor de barriga! Coitada da lagartinha. No dia seguinte, que era domingo, ela comeu uma folha verde bem fresquinha e se sentiu muito melhor.',
      'Depois de comer tanto, ela não era mais uma lagartinha pequena. Estava grande e gordinha. Então ela construiu um casulo bem apertado, chamado crisálida, e ficou lá dentro por muitas semanas.',
      'Um belo dia, ela deu uma mordidinha no casulo. Primeiro saiu uma anteninha, depois outra. E então, lentamente, saiu uma linda borboleta com asas coloridas que voou para o alto do céu!',
    ],
  },
  {
    title: 'O Sítio do Picapau Amarelo',
    author: 'Monteiro Lobato',
    pageCount: 8,
    category: 'infantil',
    description: 'Emília, Narizinho e Pedrinho vivem aventuras no sítio mais mágico do Brasil.',
    pages: [
      'No Sítio do Picapau Amarelo, dona Benta morava com Tia Nastácia, sua neta Narizinho e seu neto Pedrinho. O sítio era um lugar encantado onde a imaginação não tinha limites e tudo podia acontecer.',
      'Narizinho era uma menina muito sapeca, com um narizinho arrebitado cheio de sardas. Ela passava os dias brincando no quintal com sua boneca Emília, que era feita de pano mas tinha vida própria.',
      'Emília era a boneca mais levada e tagarela do mundo. Um dia ela tomou a pílula falante do Doutor Caramujo e desde então não parava de falar nem por um minuto. Dava opinião sobre tudo!',
      'Pedrinho, primo de Narizinho, adorava aventuras. Ele já tinha enfrentado o Saci Pererê na floresta, a Cuca na caverna e até viajado para o país da Fábula para enfrentar o Minotauro.',
      'No sítio, até os animais falavam. O Visconde de Sabugosa era um sábio feito de sabugo de milho que usava cartola e dava conselhos. O Marquês de Rabicó era um porquinho guloso que só pensava em comer.',
      'Tia Nastácia fazia os bolinhos mais gostosos do mundo. Era famosa pelos seus bolinhos de chuva, curau, pamonha e paçoca. A cozinha do sítio era o lugar mais cheiroso que existia.',
      'Dona Benta era a avó mais sábia de todas. Contava histórias incríveis para as crianças debaixo da jabuticabeira. Histórias de princesas, fadas, heróis e monstros que pareciam reais de tão bem contadas.',
      'No Sítio do Picapau Amarelo, cada dia era uma aventura nova. Narizinho, Pedrinho e Emília viviam voando na imaginação, provando que a verdadeira magia está em acreditar que tudo é possível.',
    ],
  },
  {
    title: 'Branca de Neve',
    author: 'Irmãos Grimm',
    pageCount: 8,
    category: 'conto de fadas',
    description: 'Uma princesa, uma maçã envenenada e sete amigos anões.',
    pages: [
      'Era uma vez, em um reino muito distante, uma princesa chamada Branca de Neve. Ela tinha a pele branca como a neve, os lábios vermelhos como o sangue e os cabelos pretos como o ébano.',
      'A rainha má, sua madrasta, era muito vaidosa. Todas as manhãs ela perguntava ao seu espelho mágico: — Espelho, espelho meu, existe alguém mais bela do que eu? E o espelho sempre dizia que não.',
      'Até que um dia o espelho respondeu: — Ó rainha, vós sois bela, mas Branca de Neve é mil vezes mais bela! A rainha ficou furiosa e mandou um caçador levar a princesa para a floresta e matá-la.',
      'O caçador, porém, teve pena de Branca de Neve. — Fuja, princesa, e nunca mais volte! — disse ele. Branca de Neve correu pela floresta escura, com medo, até chegar a uma clareira iluminada.',
      'Na clareira havia uma casinha muito fofa e acolhedora. Tudo dentro dela era pequenino: sete pratinhos, sete copinhos, sete camas, sete cadeirinhas. Branca de Neve comeu um pouco e adormeceu.',
      'Quando voltaram do trabalho, os sete anões encontraram Branca de Neve. — Não precisa ter medo! — disseram. — Pode ficar conosco. Todos os dias eles iam minerar diamantes e ela cuidava da casa.',
      'A rainha má descobriu que Branca de Neve estava viva. Disfarçada de velhinha, ofereceu uma maçã vermelha e brilhante para a princesa. A maçã estava envenenada! Branca de Neve caiu num sono profundo.',
      'Um príncipe que passava por ali viu Branca de Neve e se apaixonou perdidamente. Deu um beijo de amor verdadeiro nela e o feitiço se quebrou. Acordaram, casaram-se e viveram felizes para sempre!',
    ],
  },
  {
    title: 'Chapeuzinho Vermelho',
    author: 'Irmãos Grimm',
    pageCount: 8,
    category: 'conto de fadas',
    description: 'Uma menina de capa vermelha, um lobo mau e uma vovó querida.',
    pages: [
      'Era uma vez uma menina muito querida que morava com sua mãe perto de uma floresta. A avó dela, que morava do outro lado da floresta, lhe deu de presente uma capa vermelha com capuz. Por isso, todos a chamavam de Chapeuzinho Vermelho.',
      'A menina amava sua capa vermelha e vivia usando-a para tudo. Ela era muito bondosa e adorava visitar sua avó, que era velhinha e morava sozinha em uma cabana no meio da floresta.',
      'Um dia, a mamãe preparou uma cesta com doces, bolos e uma garrafa de suco de uva. — Chapeuzinho, leve estes doces para a vovó que está doentinha. Mas não pare no caminho e não fale com estranhos!',
      'Pelo caminho, Chapeuzinho encontrou o lobo mau. Ele era grande, peludo e tinha olhos brilhantes. — Aonde você vai, menina? — perguntou o lobo, fingindo ser muito bonzinho e educado.',
      '— Vou à casa da vovó levar doces! — respondeu Chapeuzinho, inocente. O lobo sorriu com maldade e disse: — Que tal colher algumas flores para a vovó? Enquanto Chapeuzinho colhia flores, o lobo correu para a cabana.',
      'O lobo chegou primeiro, engoliu a pobre velhinha de uma só vez e se vestiu com as roupas dela. Deitou na cama e puxou a coberta até o nariz. Quando Chapeuzinho chegou, estranhou tudo.',
      '— Vovó, que orelhas grandes você tem! — É para te ouvir melhor! — Vovó, que olhos grandes você tem! — É para te ver melhor! — Vovó, que boca grande você tem! — É para te comer!',
      'O lobo pulou da cama, mas um caçador que passava ouviu os gritos. Entrou correndo na cabana, deu uma palmada no lobo que fugiu pela floresta e nunca mais voltou. Chapeuzinho aprendeu a lição: nunca converse com estranhos!',
    ],
  },
  {
    title: 'Os Três Porquinhos',
    author: 'Joseph Jacobs',
    pageCount: 8,
    category: 'infantil',
    description: 'Três porquinhos constroem casas e um lobo soprador aparece.',
    pages: [
      'Era uma vez três porquinhos irmãos que viviam felizes com sua mãe em uma casinha no campo. Um dia, eles cresceram e a mãe disse: — Meus filhos, chegou a hora de cada um construir sua própria casa.',
      'O primeiro porquinho era muito preguiçoso. — Vou construir a casa mais rápida do mundo! — disse ele. Juntou um monte de palha e em poucas horas já estava pronto. A casa de palha era frágil mas estava de pé.',
      'O segundo porquinho era um pouco menos preguiçoso. — Vou fazer uma casa de madeira! — disse. Cortou alguns troncos, martelou pregos e em dois dias a casa de madeira ficou pronta, mais firme que a de palha.',
      'O terceiro porquinho era o mais trabalhador e sábio. — Vou construir uma casa de tijolos bem forte! — disse. Misturou cimento, empilhou tijolo por tijolo e trabalhou duro por muitas semanas.',
      'Os dois primeiros porquinhos riam do irmão: — Olha ele trabalhando sem parar! Nós já terminamos e estamos nos divertindo! Mas o terceiro porquinho não ligava e continuava construindo sua casa resistente.',
      'Um dia, o lobo mau apareceu. Foi até a casa de palha e disse: — Porquinho, porquinho, me deixa entrar! — Não, pelo queixo do meu queixo! — Então vou soprar! E soprou a casa de palha inteira.',
      'O primeiro porquinho correu para a casa de madeira do irmão. O lobo foi atrás: — Porquinhos, me deixem entrar! — Não! — Então vou soprar! E soprou a casa de madeira que caiu em pedaços.',
      'Os dois porquinhos correram para a casa de tijolos do terceiro irmão. O lobo soprou com toda força, mas a casa nem se mexeu. Tentou entrar pela chaminé, mas caiu numa panela de água quente e fugiu para sempre!',
    ],
  },
  {
    title: 'João e Maria',
    author: 'Irmãos Grimm',
    pageCount: 8,
    category: 'conto de fadas',
    description: 'Dois irmãos perdidos na floresta encontram uma casa de doces.',
    pages: [
      'João e Maria eram irmãos que viviam com o pai lenhador e a madrasta numa casinha perto de uma floresta escura e misteriosa. Eles eram muito pobres e muitas vezes não tinham o que comer.',
      'A madrasta, que não gostava das crianças, convenceu o pai a abandoná-las na floresta. — Não temos comida para todos! — disse ela. O pai ficou triste, mas acabou concordando.',
      'João, que era muito esperto, ouviu a conversa. Na manhã seguinte, enquanto caminhavam para a floresta, ele guardou pedrinhas brancas no bolso. Pelo caminho, foi deixando cada pedrinha cair no chão.',
      'O pai deixou as crianças no meio da floresta e foi embora. Quando a noite chegou, João e Maria ficaram com medo. Mas a lua cheia iluminou as pedrinhas brancas e eles conseguiram voltar para casa.',
      'A madrasta ficou furiosa e convenceu o pai a tentar de novo. Desta vez, João não conseguiu guardar pedrinhas. Os dois se perderam na floresta e caminharam por dias sem encontrar o caminho de volta.',
      'Cansados e famintos, avistaram algo incrível: uma casa feita toda de doces! As paredes eram de biscoito, o telhado de chocolate e as janelas de açúcar cristalizado. Maria correu para morder uma parede.',
      'Dentro da casa morava uma bruxa malvada. Ela prendeu João numa gaiola e obrigou Maria a cozinhar para engordar o irmão. — Quando ele estiver gordinho, vou comer ele! — dizia a bruxa, rindo.',
      'Maria fingiu obedecer, mas era muito esperta. Quando a bruxa se aproximou do forno para verificar o pão, Maria deu um empurrão e a trancou lá dentro! Pegaram o tesouro da bruxa e voltaram para casa, onde o pai os abraçou emocionado.',
    ],
  },
  {
    title: 'A Bela e a Fera',
    author: 'Jeanne-Marie Leprince de Beaumont',
    pageCount: 8,
    category: 'conto de fadas',
    description: 'Uma jovem descobre o amor verdadeiro por trás de uma aparência monstruosa.',
    pages: [
      'Era uma vez um mercador muito pobre que tinha três filhas. As duas mais velhas eram vaidosas e preguiçosas, mas a mais nova, Bela, era tão bondosa quanto bonita. Ela adorava ler livros e sonhar com grandes aventuras.',
      'Um dia, o mercador se perdeu na floresta durante uma tempestade. Encontrou um castelo enorme e assustador. Como estava chovendo muito, entrou para se abrigar. No castelo, encontrou uma mesa farta de comida.',
      'Na manhã seguinte, ao sair, colheu uma rosa linda do jardim para levar para Bela. De repente, um monstro apareceu. Ele tinha cara de fera, mas falava com educação: — Você roubou minha rosa! Pagará com sua vida!',
      'O mercador contou a história para as filhas. Bela decidiu ir ao castelo no lugar do pai. A Fera a recebeu com muita gentileza. Ele preparou um quarto lindo e todas as noites jantavam juntos.',
      'Todas as noites, a Fera perguntava: — Bela, você aceita se casar comigo? — Não, Fera, você é muito feia! — respondia ela com medo. Mesmo assim, a Fera continuava tratando-a com muito carinho e respeito.',
      'Com o tempo, Bela começou a enxergar a bondade no coração da Fera. Ele era gentil, generoso, atencioso e a amava de verdade. Bela percebeu que a verdadeira beleza estava dentro do coração.',
      'Certo dia, Bela olhou no espelho mágico e viu seu pai doente. — Fera, deixe-me ir cuidar do meu pai! — pediu. A Fera, mesmo triste, deixou-a partir. Bela cuidou do pai até ele melhorar.',
      'Bela sonhou que a Fera estava morrendo de tristeza. Voltou correndo ao castelo e encontrou a Fera desmaiada no jardim. — Eu amo você! — declarou Bela, abraçando-o. Naquele instante, o feitiço se quebrou e a Fera se transformou num lindo príncipe!',
    ],
  },
  {
    title: 'Alice no País das Maravilhas',
    author: 'Lewis Carroll',
    pageCount: 8,
    category: 'clássico',
    description: 'Uma menina curiosa cai em um buraco e encontra um mundo mágico e maluco.',
    pages: [
      'Alice estava sentada na margem do rio ao lado de sua irmã, que lia um livro sem figuras. — Para que serve um livro sem figuras? — pensou Alice, entediada. Foi quando viu um coelho branco passando correndo.',
      '— Oh, meu Deus! Vou me atrasar! — disse o Coelho Branco, tirando um relógio do bolso do colete. Alice nunca tinha visto um coelho falar ou usar roupas. Curiosa, ela seguiu o coelho até uma grande toca.',
      'A toca era um túnel que descia em espiral. Alice caiu, caiu, caiu... A queda parecia não ter fim. Ela passou por estantes de livros, mapas e quadros nas paredes. Finalmente, chegou ao fundo com um ploft!',
      'Alice entrou em uma sala com muitas portas minúsculas. Sobre uma mesa de vidro, havia uma garrafinha com o rótulo "Beba-me". Alice bebeu e começou a encolher! Depois comeu um bolinho "Coma-me" e cresceu até o teto!',
      'Ela começou a chorar, e seu choro formou uma poça enorme. De repente, o Coelho Branco apareceu novamente, todo atrasado. Alice perguntou: — Para onde vai essa estrada? — Para qualquer lugar! — respondeu ele, sumindo.',
      'Alice encontrou uma lagarta azul fumando narguilé em cima de um cogumelo. — Quem é você? — perguntou a lagarta. — Eu... eu não sei mais! — respondeu Alice. — Aprendi tantas coisas hoje que não sou mais a mesma!',
      'Depois encontrou o Gato de Cheshire, que aparecia e desaparecia deixando apenas seu sorriso no ar. — Poderia me dizer, por favor, que caminho devo tomar? — perguntou Alice. — Depende de onde quer chegar — respondeu o gato.',
      'Alice participou de um chá maluco com o Chapeleiro Maluco e a Lebre de Março. Depois jogou croqué com a Rainha de Copas, que mandava cortar cabeças por qualquer motivo. Alice acordou e percebeu que tudo não passou de um sonho maravilhoso.',
    ],
  },
  {
    title: 'Pinóquio',
    author: 'Carlo Collodi',
    pageCount: 8,
    category: 'clássico',
    description: 'Um boneco de madeira que sonha em se tornar um menino de verdade.',
    pages: [
      'Era uma vez um velho carpinteiro chamado Gepeto que vivia sozinho em sua oficina. Ele era muito pobre, mas tinha um coração enorme. Um dia, ele esculpiu um boneco de madeira e o chamou de Pinóquio.',
      '— Você será o meu filho! — disse Gepeto, emocionado. Naquela noite, uma fada azul apareceu na oficina e, com sua varinha mágica, deu vida ao boneco. — Você pode falar, andar e dançar! — disse a fada.',
      '— Para ser um menino de verdade, Pinóquio, você precisa ser corajoso, sincero e generoso. E lembre-se: toda vez que você mentir, seu nariz vai crescer! — avisou a fada. Pinóquio prometeu ser bonzinho.',
      'No dia seguinte, Gepeto comprou uma cartilha para Pinóquio estudar. — Vá para a escola e aprenda muitas coisas! — disse. Mas no caminho, Pinóquio encontrou um teatro de fantoches e vendeu a cartilha para comprar um ingresso.',
      'No teatro, Pinóquio subiu ao palco e começou a dançar com os fantoches. O dono do teatro, um homem chamado Mangiafoco, queria usar Pinóquio para lenha. Mas o boneco contou sua história e Mangiafoco se emocionou e o libertou.',
      'No caminho de volta, Pinóquio encontrou a Raposa e o Gato, dois malandros que queriam roubar suas moedas de ouro. Disseram que ele poderia plantar as moedas no Campo dos Milagres e elas virariam uma árvore de moedas.',
      'Pinóquio foi enganado, perdeu as moedas e acabou preso. Depois foi para a Terra dos Brinquedos, onde as crianças só brincavam e viravam burros. Pinóquio virou um burrinho e foi vendido para um circo.',
      'A fada azul salvou Pinóquio, que finalmente aprendeu a lição. Voltou para casa e encontrou Gepeto dentro da baleia Monstro. Salvou seu pai e, por seu ato de coragem e amor, a fada o transformou num menino de verdade!',
    ],
  },
  {
    title: 'O Mágico de Oz',
    author: 'L. Frank Baum',
    pageCount: 8,
    category: 'aventura',
    description: 'Dorothy viaja para uma terra mágica em busca do grande Mágico de Oz.',
    pages: [
      'Dorothy morava no Kansas com seu tio Henry, sua tia Em e seu cachorrinho Totó. Um dia, um ciclone enorme chegou. Dorothy não conseguiu entrar no abrigo e foi levada pelos ventos, dentro de sua casa, para bem longe.',
      'A casa caiu em uma terra linda e colorida: o País de Oz. Dorothy esmagou a Bruxa Má do Leste com a queda. A Bruxa Boa do Norte apareceu e disse: — Você libertou nosso povo! Vá para a Cidade das Esmeraldas, o Mágico de Oz pode ajudar você.',
      'Pelo caminho, Dorothy encontrou um Espantalho plantado num campo. — Se eu tivesse um cérebro! — suspirou ele. — Venha comigo até Oz, ele pode dar um cérebro para você! — convidou Dorothy. O Espantalho foi junto.',
      'Mais adiante, encontraram um Homem de Lata, todo enferrujado. Dorothy o oleou e ele pôde se mover. — Se eu tivesse um coração! — disse ele. — Venha conosco! — disse Dorothy. O Homem de Lata foi junto.',
      'Depois encontraram um Leão Covarde que chorava. — Eu queria ter coragem! — rugiu ele, tremendo. — Venha, o Mágico de Oz pode dar coragem para você! — disse Dorothy. O Leão foi junto, ainda com medo de tudo.',
      'Os quatro amigos enfrentaram muitos perigos: um rio perigoso, um campo de papoulas que dava sono e macacos voadores. Mas eles se ajudavam e venciam cada desafio juntos, mostrando que a união faz a força.',
      'Chegando na Cidade das Esmeraldas, o Mágico de Oz apareceu como uma cabeça gigante e assustadora. — Matem a Bruxa Má do Oeste e eu realizarei seus desejos! — disse ele. Eles partiram para enfrentar a bruxa.',
      'Dorothy derrubou a bruxa com um balde de água. Voltaram a Oz e descobriram que o mágico era apenas um homem comum atrás de uma cortina. Mas ele deu ao Espantalho um cérebro (de palha), ao Homem de Lata um coração (de seda) e ao Leão coragem (um elixir). Dorothy voltou para casa usando os sapatinhos mágicos!',
    ],
  },
  {
    title: 'Cinderela',
    author: 'Irmãos Grimm',
    pageCount: 8,
    category: 'conto de fadas',
    description: 'Uma jovem bondosa, uma fada madrinha e um sapatinho de cristal.',
    pages: [
      'Era uma vez uma jovem muito bondosa chamada Cinderela. Ela morava com seu pai, sua madrasta e duas irmãs malvadas. Desde que seu pai morreu, a madrasta e as irmãs tratavam Cinderela como empregada.',
      'Cinderela tinha que limpar a casa, lavar a roupa, cozinhar e ainda atender a todos os caprichos das irmãs. Ela dormia no sótão, perto das cinzas da lareira — por isso a chamavam de Cinderela.',
      'Mas Cinderela não era infeliz. Ela tinha seus amigos animais: os passarinhos, os ratinhos e até os cavalos do estábulo. Eles a ajudavam em tudo e cantavam para ela quando estava triste.',
      'Um dia, o rei anunciou um grande baile no palácio para que o príncipe escolhesse sua noiva. As irmãs de Cinderela ficaram eufóricas. — Eu vou usar meu vestido azul! — Eu vou usar o vermelho! — gritavam.',
      'Cinderela também queria ir, mas a madrasta disse: — Você? Ir ao baile? Só se conseguir limpar esta casa e separar todas as lentilhas! Os passarinhos ajudaram Cinderela em um instante, mas a madrasta a proibiu de ir mesmo assim.',
      'Cinderela foi para o jardim chorar. De repente, uma luz brilhante apareceu. Era sua fada madrinha! — Não chore, minha querida! Você vai ao baile! — Abracadabra, ela transformou uma abóbora em carruagem, os ratinhos em cavalos e os trapos de Cinderela em um lindo vestido azul com sapatinhos de cristal.',
      'No baile, o príncipe só dançou com Cinderela. Eles dançaram a noite inteira e o príncipe se apaixonou perdidamente. Mas à meia-noite, o feitiço acabaria! Cinderela fugiu correndo e perdeu um sapatinho de cristal na escadaria.',
      'O príncipe usou o sapatinho para encontrar sua amada. Provou em todas as moças do reino. Quando chegou na casa de Cinderela, as irmãs tentaram usar o sapato, mas não coube. Cinderela calçou o sapatinho e serviu perfeitamente. O príncipe a reconheceu e os dois se casaram numa grande festa!',
    ],
  },
]

async function main() {
  // Delete in correct order
  await prisma.magicLink.deleteMany()
  await prisma.pageRecording.deleteMany()
  await prisma.recording.deleteMany()
  await prisma.reader.deleteMany()
  await prisma.child.deleteMany()
  await prisma.book.deleteMany()
  await prisma.user.deleteMany()

  for (const book of books) {
    await prisma.book.create({ data: book })
  }
  console.log(`${books.length} livros criados com sucesso!`)

  const hash = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: { name: 'Administrador', email: 'admin@admin.com', password: hash, role: 'admin' },
  })
  console.log('Admin criado: admin@admin.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
