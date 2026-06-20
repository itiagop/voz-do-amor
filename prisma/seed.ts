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
  {
    title: 'A Galinha Ruiva',
    author: 'Folclore Brasileiro',
    pageCount: 8,
    category: 'infantil',
    description: 'Uma galinha trabalhadeira ensina o valor da cooperação.',
    pages: [
      'Era uma vez uma galinha ruiva que morava em um sítio muito bonito. Ela acordava cedo todos os dias e gostava de manter tudo organizado. Seus vizinhos eram um porco, um pato e um gato.',
      'Um dia, a galinha encontrou alguns grãos de trigo no quintal. Teve uma ideia: — Vou plantar este trigo e fazer um delicioso pão!',
      'A galinha ruiva foi pedir ajuda: — Quem me ajuda a plantar o trigo? — Eu não! — disse o porco. — Eu não! — disse o pato. — Eu não! — disse o gato. — Então eu planto sozinha! — disse a galinha.',
      'O trigo cresceu bonito e forte. A galinha chamou os amigos: — Quem me ajuda a colher o trigo? — Eu não! — disseram todos. A galinha colheu sozinha.',
      'Depois levou o trigo para moer: — Quem me ajuda a moer o trigo? — Eu não! — disseram todos. Ela foi sozinha ao moinho.',
      'Com a farinha pronta, a galinha perguntou: — Quem me ajuda a fazer o pão? — Eu não! — disseram os amigos. Ela mesma sovou a massa, esperou crescer e assou o pão.',
      'O pão ficou dourado e cheiroso. A galinha perguntou: — Quem me ajuda a comer o pão? — Eu! Eu! Eu! — disseram todos, animados.',
      '— Ah, não! — disse a galinha ruiva. — Quem não ajudou no trabalho, não merece o resultado. E comeu o pão delicioso com seus pintinhos. Os outros aprenderam a lição: ajudar é importante!',
    ],
  },
  {
    title: 'A Princesa e o Sapo',
    author: 'Irmãos Grimm',
    pageCount: 10,
    category: 'conto de fadas',
    description: 'Uma princesa aprende que promessas devem ser cumpridas.',
    pages: [
      'Era uma vez uma princesa linda que vivia em um castelo enorme. Ela tinha todos os brinquedos e vestidos que podia imaginar, mas seu objeto mais precioso era uma bola de ouro.',
      'Todos os dias, a princesa brincava com sua bola de ouro perto de um lago no jardim do castelo. Ela jogava a bola para o alto e a pegava, rindo feliz.',
      'Um dia, a bola escapou de suas mãos e caiu no fundo do lago. A princesa chorou desesperada. — Por que está chorando? — perguntou uma vozinha.',
      'Era um sapo feio e verdinho. — Minha bola de ouro caiu no lago! — soluçou a princesa. — Eu posso pegar sua bola, mas em troca você vai me deixar comer no seu prato e dormir na sua cama.',
      'A princesa concordou, mas só queria a bola de volta. O sapo mergulhou e trouxe a bola. A princesa pegou a bola e correu para o castelo, esquecendo o sapo.',
      'No jantar, alguém bateu na porta. — Princesa, abra a porta! É o sapo! O rei ouviu e disse: — Promessa é promessa, minha filha. Deixe o sapo entrar.',
      'O sapo entrou, comeu no prato da princesa e disse: — Agora me leve para dormir no seu quarto. A princesa, com nojo, levou o sapo para seu quarto.',
      'No quarto, a princesa ficou com tanta raiva que pegou o sapo e o jogou contra a parede. Mas, em vez de se machucar, o sapo se transformou em um lindo príncipe!',
      '— Uma bruxa me enfeitiçou! — explicou o príncipe. — Só o beijo de uma princesa ou um ato de coragem quebraria o feitiço. Você me jogou na parede e quebrou a maldição!',
      'A princesa pediu desculpas e o príncipe a perdoou. Eles se apaixonaram, casaram e viveram felizes. A princesa aprendeu que toda promessa merece ser cumprida.',
    ],
  },
  {
    title: 'Os Músicos de Bremen',
    author: 'Irmãos Grimm',
    pageCount: 10,
    category: 'aventura',
    description: 'Quatro animais velhos realizam um sonho juntos.',
    pages: [
      'Em uma fazenda distante, vivia um burro muito velho e cansado. Seu dono não queria mais alimentá-lo. Triste, o burro decidiu fugir e realizar seu sonho: ser músico na cidade de Bremen.',
      'No caminho, encontrou um cachorro velho deitado na estrada. — Por que está tão triste, amigo? — perguntou o burro.',
      '— Meu dono me expulsou porque estou velho e não posso mais caçar — respondeu o cachorro. — Venha comigo! — disse o burro. — Vamos tocar música em Bremen!',
      'Mais adiante, encontraram um gato velho sentado com cara de poucos amigos. — Estou velho e sem dentes, meu dono me abandonou — miou o gato. — Venha conosco! — convidaram.',
      'Depois encontraram um galo que cantava para avisar o dia, mas seu dono queria transformá-lo em canja. — Venha, galo! Sua voz vai fazer falta na nossa banda!',
      'Os quatro amigos seguiram felizes pela estrada. Mas a noite chegou e eles estavam perdidos na floresta. — Vejo uma luz lá longe! — cantou o galo. Era uma casa.',
      'Ao se aproximarem, viram que era uma casa de ladrões. Os bandidos estavam comendo uma farta ceia. — Vamos ganhar esta casa! — disse o burro, bolando um plano.',
      'O burro colocou as patas na janela, o cachorro subiu no burro, o gato no cachorro e o galo no gato. Todos juntos fizeram a maior confusão: o burro zurrou, o cachorro latiu, o gato miou e o galo cantou.',
      'Os ladrões pensaram que era um monstro e fugiram apavorados! Os quatro amigos entraram, comeram a ceia deliciosa e dormiram em camas macias.',
      'Os ladrões tentaram voltar, mas o gato arranhou, o cachorro mordeu, o burro chutou e o galo cantou. Fugiram para sempre! Os quatro amigos viveram felizes na casa, fazendo música todos os dias.',
    ],
  },
  {
    title: 'A Pequena Sereia',
    author: 'Hans Christian Andersen',
    pageCount: 12,
    category: 'conto de fadas',
    description: 'Uma sereia descobre o verdadeiro significado do amor.',
    pages: [
      'Lá no fundo do mar, no reino das águas cristalinas, vivia o rei dos mares com suas seis filhas sereias. A mais nova era a mais curiosa e sonhadora de todas.',
      'A pequena sereia adorava ouvir as histórias da avó sobre o mundo dos humanos. — Lá em cima, as estrelas brilham e as flores exalam perfume — contava a avó.',
      'No seu aniversário de 15 anos, a pequena sereia finalmente pôde subir à superfície. Ela viu um navio enorme e, dentro dele, um príncipe lindo dançando.',
      'De repente, uma tempestade terrível surgiu. O navio quebrou e o príncipe caiu na água, desmaiado. A sereia nadou até ele e o levou para a praia, salvando sua vida.',
      'Ela ficou ao lado do príncipe até uma jovem aparecer na praia. A sereia escondeu-se atrás das rochas e viu a moça ajudar o príncipe. Ele nunca soube que foi a sereia quem o salvou.',
      'A pequena sereia voltou para o mar apaixonada. Ela precisava ficar perto do príncipe. Foi até a bruxa do mar, que vivia num redemoinho escuro.',
      '— Eu posso transformar sua cauda em pernas — disse a bruxa. — Mas cada passo será como andar sobre facas. E se o príncipe se casar com outra, você virará espuma do mar!',
      'Em troca, a bruxa queria a voz da sereia. — Sem sua voz, você não poderá cantar nem falar. Aceita? A sereia, por amor, aceitou.',
      'A pequena sereia ganhou pernas e foi para o palácio. O príncipe achava ela linda, mas sentia falta da moça que o salvou na praia. A sereia dançava para ele, mesmo com dor.',
      'O príncipe se casou com a moça da praia, pensando que era ela quem o havia salvo. A sereia ficou com o coração partido. Na noite do casamento, ela iria virar espuma.',
      'Suas irmãs vieram do mar com um punhal mágico da bruxa. — Se você matar o príncipe com esta faca, voltará a ser sereia! Mas ela não conseguiu machucar quem amava.',
      'A pequena sereia jogou o punhal no mar e se atirou nas ondas. Mas seu amor era tão puro que ela não virou espuma — virou uma filha do ar, que ganhou uma alma imortal. Seu sacrifício a tornou eterna.',
    ],
  },
  {
    title: 'A Bela Adormecida',
    author: 'Charles Perrault',
    pageCount: 10,
    category: 'conto de fadas',
    description: 'Um amor verdadeiro quebra o feitiço de cem anos.',
    pages: [
      'Era uma vez um rei e uma rainha que esperavam ansiosamente por um filho. Quando a princesa nasceu, fizeram uma grande festa e convidaram todas as fadas do reino.',
      'Havia treze fadas no reino, mas os reis tinham apenas doze pratos de ouro. Então convidaram doze fadas e esqueceram a décima terceira, que era muito poderosa e vingativa.',
      'Cada fada deu um presente à princesa: beleza, inteligência, graça, música, bondade. Quando a décima segunda fada se preparava para dar seu dom, a décima terceira apareceu furiosa.',
      '"A princesa vai crescer linda e perfeita, mas aos dezesseis anos vai espetar o dedo em um fuso e cair morta!" — gritou a fada malvada. Todos ficaram apavorados.',
      'A décima segunda fada, que ainda não tinha dado seu presente, amenizou a maldição: "Ela não morrerá, mas dormirá por cem anos até que um beijo de amor verdadeiro a desperte."',
      'O rei mandou queimar todos os fusos do reino. Mas ninguém conseguiu destruir todos. No dia do seu décimo sexto aniversário, a princesa explorava o castelo e encontrou uma torre escondida.',
      'Na torre, uma velhinha fiando. — O que é isso? — perguntou a princesa, curiosa. Ao tocar o fuso, espetou o dedo e caiu num sono profundo. O feitiço se cumpriu.',
      'A fada bondosa fez todos no castelo dormirem também. Uma floresta de espinhos cresceu ao redor, escondendo o castelo. Muitos príncipes tentaram atravessá-la e falharam.',
      'Cem anos se passaram. Um príncipe corajoso de outro reino ouviu a lenda e decidiu tentar. Os espinhos se abriram para ele. No castelo, encontrou todos dormindo, e no alto da torre viu a princesa.',
      'Encantado por sua beleza, o príncipe deu um beijo na princesa. Ela acordou, e com ela todo o castelo despertou. Casaram-se e viveram felizes para sempre, provando que o amor verdadeiro supera qualquer feitiço.',
    ],
  },
  {
    title: 'O Gato de Botas',
    author: 'Charles Perrault',
    pageCount: 10,
    category: 'aventura',
    description: 'Um gato esperto faz a fortuna do seu dono.',
    pages: [
      'Era uma vez um velho moleiro que tinha três filhos. Quando morreu, deixou seus bens: o moinho para o mais velho, o burro para o do meio e um gato para o caçula.',
      'O caçula ficou desolado. — De que adianta um gato? Posso fazer um par de luvas com sua pele... O gato, que era muito esperto, falou: — Não faça isso! Arranje-me um par de botas e você verá!',
      'O jovem, sem nada a perder, deu as botas ao gato. O gato as calçou, pegou um saco e foi para o campo. Encheu o saco de farelo e pegou um coelho.',
      'O gato levou o coelho ao palácio e disse: — Senhor rei, um presente do Marquês de Carabás (o nome inventado para seu dono). O rei ficou impressionado.',
      'O gato continuou levando presentes ao rei. Um dia, soube que o rei passearia pela região com sua filha. Mandou o dono nadar no rio e escondeu suas roupas.',
      'Quando a carruagem passou, o gato gritou: — Socorro! O Marquês de Carabás está se afogando! O rei reconheceu o gato e ordenou que salvassem o "marquês".',
      'O gato disse que ladrões haviam roubado as roupas do marquês. O rei deu ao jovem as mais belas roupas. A princesa se encantou com o jovem.',
      'O gato correu na frente da carruagem e mandou os camponeses dizerem que tudo pertencia ao Marquês de Carabás. Chegou ao castelo de um ogro que era o verdadeiro dono.',
      'O ogro, vaidoso, se transformou em leão para impressionar o gato. — Deve ser difícil virar um rato — provocou o gato. O ogro, furioso, virou um ratinho. O gato o devorou na hora!',
      'Quando a carruagem chegou, o gato recebeu o rei no "castelo do Marquês de Carabás". O rei, impressionado, deu a mão da princesa ao jovem. O gato virou um nobre e viveu feliz, caçando ratos só por diversão.',
    ],
  },
  {
    title: 'O Soldadinho de Chumbo',
    author: 'Hans Christian Andersen',
    pageCount: 10,
    category: 'clássico',
    description: 'Um soldadinho de uma perna só vive uma grande aventura por amor.',
    pages: [
      'Era uma vez um menino que ganhou uma caixa de soldadinhos de chumbo. Eram vinte e cinco soldadinhos todos iguais, com seus uniformes vermelhos e azuis e seus fuzis no ombro.',
      'O último soldadinho era diferente: foi feito com o pouco de chumbo que sobrou e tinha apenas uma perna. Mas ele ficava tão firme em sua única perna quanto os outros nas duas.',
      'Sobre a mesa, havia um lindo castelo de papel. Na porta, uma bailarina feita de papel e seda. Ela usava uma saia rodada e levantava as pernas tão alto que o soldadinho pensou que ela também tinha uma perna só.',
      'O soldadinho se apaixonou perdidamente pela bailarina. — Ela é minha alma gêmea! — pensou. Mas um duende malvado que estava numa caixinha de surpresas gritou: — Esqueça, soldadinho! Ela não é para você!',
      'O soldadinho fingiu não ouvir. No dia seguinte, o duende o derrubou da janela. O soldadinho caiu de cabeça, com o fuzil preso no ombro, e ficou na rua.',
      'Começou a chover forte. Dois meninos encontraram o soldadinho e o colocaram num barquinho de papel. — Navegue pelo mundo, soldadinho! — disseram. O barco desceu pela enxurrada.',
      'O barquinho foi parar num bueiro escuro. Ratos passaram correndo, mas o soldadinho não se assustou. — Mostre seu passe! — gritou um rato. O soldadinho ficou firme, em silêncio.',
      'O barco desaguou num rio e depois no mar. Um grande peixe engoliu o soldadinho inteiro. Lá dentro era escuro e apertado. O soldadinho não desistiu, mesmo no ventre do peixe.',
      'O peixe foi pescado e levado ao mercado. A cozinheira do menino o comprou. Quando abriu o peixe, encontrou o soldadinho! Ele foi colocado de volta na mesa do menino.',
      'O soldadinho reencontrou sua amada bailarina. Eles se olharam emocionados. O menino, sem querer, jogou o soldadinho na lareira. O vento jogou a bailarina também. O soldadinho derreteu em forma de coração ao lado dela. O amor deles foi eterno.',
    ],
  },
  {
    title: 'Rapunzel',
    author: 'Irmãos Grimm',
    pageCount: 10,
    category: 'conto de fadas',
    description: 'Uma menina de cabelos longos presa numa torre descobre a liberdade.',
    pages: [
      'Era uma vez um casal que esperava um filho. A mulher grávida via no jardim da vizinha (uma bruxa poderosa) uma plantação de raponços. Ela teve um desejo incontrolável de comê-los.',
      'O marido, para satisfazer a esposa, pulou o muro e colheu raponços. Mas a bruxa o pegou. — Pode levar todos os raponços que quiser, mas em troca, quando a criança nascer, será minha!',
      'Quando a menina nasceu, a bruxa a levou e a chamou de Rapunzel (que significa raponço). Ela cresceu e se tornou a menina mais linda do mundo, com cabelos dourados que tocavam o chão.',
      'Para manter Rapunzel longe do mundo, a bruxa a trancou numa torre alta no meio da floresta. A torre não tinha portas nem escadas — apenas uma janela no topo.',
      'Quando a bruxa queria subir, gritava: — Rapunzel, jogue suas tranças! E Rapunzel soltava suas longas tranças douradas pela janela. A bruxa subia por elas.',
      'Um dia, um príncipe passou pela floresta e ouviu Rapunzel cantar. Encantado pela voz, ele viu a bruxa subir pelas tranças. No dia seguinte, imitou a bruxa: — Rapunzel, jogue suas tranças!',
      'Rapunzel, assustada, viu o príncipe. Mas ele era gentil e eles conversaram por horas. O príncipe voltou todos os dias, e eles se apaixonaram.',
      'Certo dia, Rapunzel deixou escapar: — Madrinha, por que é tão mais pesado subir por você do que pelo príncipe? A bruxa descobriu tudo.',
      'Furiosa, a bruxa cortou os cabelos de Rapunzel e a abandonou no deserto. Quando o príncipe veio, a bruxa jogou as tranças cortadas para ele subir. No topo, encontrou a bruxa, que o empurrou. Ele caiu nos espinhos e ficou cego.',
      'O príncipe cego vagou anos pelo mundo. Um dia, ouviu uma voz conhecida cantando no deserto. Era Rapunzel! Seu choro de alegria molhou os olhos do príncipe, que recuperou a visão. Finalmente livres, voltaram ao reino e viveram felizes.',
    ],
  },
]

async function main() {
  const existingBooks = await prisma.book.count()
  if (existingBooks === 0) {
    for (const book of books) {
      await prisma.book.create({ data: book })
    }
    console.log(`${books.length} livros criados com sucesso!`)
  } else {
    const existingTitles = (await prisma.book.findMany({ select: { title: true } })).map(b => b.title)
    let added = 0
    for (const book of books) {
      if (!existingTitles.includes(book.title)) {
        await prisma.book.create({ data: book })
        added++
      }
    }
    console.log(`${added} novos livros adicionados! Total: ${existingBooks + added}`)
  }

  const adminExists = await prisma.user.findUnique({ where: { email: 'admin@admin.com' } })
  if (!adminExists) {
    const hash = await bcrypt.hash('admin123', 10)
    await prisma.user.create({
      data: { name: 'Administrador', email: 'admin@admin.com', password: hash, role: 'admin' },
    })
    console.log('Admin criado: admin@admin.com / admin123')
  } else {
    console.log('Admin já existe, pulando...')
  }

  const badges = [
    { slug: 'first_recording', name: 'Primeira Gravação', description: 'Completou sua primeira gravação', icon: '🎙️', criteria: '1' },
    { slug: 'three_recordings', name: 'Contador de Histórias', description: 'Completou 3 gravações', icon: '📖', criteria: '3' },
    { slug: 'five_recordings', name: 'Narrador Dedicado', description: 'Completou 5 gravações', icon: '⭐', criteria: '5' },
    { slug: 'ten_recordings', name: 'Mestre das Palavras', description: 'Completou 10 gravações', icon: '🏆', criteria: '10' },
    { slug: 'complete_book', name: 'Livro Completo', description: 'Gravou todas as páginas de um livro', icon: '📚', criteria: 'complete_book' },
    { slug: 'streak_3', name: 'Determinação', description: 'Manteve uma sequência de 3 dias gravando', icon: '🔥', criteria: 'streak_3' },
    { slug: 'streak_7', name: 'Foco Total', description: 'Manteve uma sequência de 7 dias gravando', icon: '🔥', criteria: 'streak_7' },
    { slug: 'streak_14', name: 'Inabalável', description: 'Manteve uma sequência de 14 dias gravando', icon: '💪', criteria: 'streak_14' },
    { slug: 'three_books', name: 'Explorador', description: 'Gravou em 3 livros diferentes', icon: '🗺️', criteria: '3_books' },
    { slug: 'donated', name: 'Coração Generoso', description: 'Fez uma doação', icon: '💛', criteria: 'donated' },
    { slug: 'premium', name: 'Apoiador Premium', description: 'Assinou o plano premium', icon: '👑', criteria: 'premium' },
    { slug: 'thirty_minutes', name: 'Hora do Conto', description: 'Gravou mais de 30 minutos no total', icon: '⏰', criteria: '30min' },
    { slug: 'one_hour', name: 'Voz Incansável', description: 'Gravou mais de 1 hora no total', icon: '🎯', criteria: '1h' },
  ]

  for (const badge of badges) {
    const exists = await prisma.badge.findUnique({ where: { slug: badge.slug } })
    if (!exists) {
      await prisma.badge.create({ data: badge })
    }
  }
  console.log(`${badges.length} badges sincronizados!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
