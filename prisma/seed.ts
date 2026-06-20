import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const books = [
  {
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    pageCount: 6,
    category: 'clássico',
    description: 'Um piloto cai no deserto e conhece um pequeno príncipe de outro planeta.',
    pages: [
      'Era uma vez um pequeno príncipe que vivia em um planeta do tamanho de uma casa. Ele tinha três vulcões e uma rosa muito vaidosa.',
      'O pequeno príncipe cuidava do seu planeta todos os dias. Arrancava as árvores gigantes que cresciam sem parar e limpava seus vulcõezinhos.',
      'Mas a rosa era muito orgulhosa. Um dia, o pequeno príncipe decidiu viajar para conhecer outros planetas. Disse adeus à sua rosa e partiu.',
      'Ele visitou vários planetas. Em um, morava um rei que mandava em tudo. Em outro, um acendedor de lampiões que acendia e apagava sem parar.',
      'Até que chegou na Terra. No deserto, encontrou um aviador. — Faz de conta que sou teu amigo? — perguntou o principezinho.',
      'O essencial é invisível aos olhos. Foi o que a raposa ensinou ao pequeno príncipe. E ele entendeu que a sua rosa era única no universo.',
    ],
  },
  {
    title: 'A Lagartinha Comilona',
    author: 'Eric Carle',
    pageCount: 6,
    category: 'infantil',
    description: 'Uma lagartinha muito comilona come de tudo até virar uma linda borboleta.',
    pages: [
      'Numa linda noite de luar, um ovo minúsculo descansava numa folha. Dentro dele, uma lagartinha estava prestes a nascer.',
      'No domingo de manhã, o sol quentinho apareceu. Ploc! Da casca do ovo saiu uma lagartinha muito, mas muito faminta.',
      'Na segunda-feira, ela comeu uma maçã. Mas ainda estava com fome. Na terça, comeu duas peras. Ainda com fome!',
      'Na quarta, comeu três ameixas. Na quinta, quatro morangos. Na sexta, cinco laranjas. Mas ainda assim, estava com fome!',
      'No sábado, ela comeu um pedaço de bolo, uma bola de sorvete, um picolé, um queijo, uma salsicha, um cupcake e uma melancia. Ficou com dor de barriga!',
      'Depois de comer tanto, ela construiu um casulo bem apertado. Duas semanas depois, ela deu uma mordidinha no casulo e saiu uma linda borboleta!',
    ],
  },
  {
    title: 'O Sítio do Picapau Amarelo',
    author: 'Monteiro Lobato',
    pageCount: 5,
    category: 'infantil',
    description: 'Emília, Narizinho e Pedrinho vivem aventuras incríveis no sítio mais mágico do Brasil.',
    pages: [
      'No Sítio do Picapau Amarelo, dona Benta morava com Tia Nastácia, Narizinho e Pedrinho. Lá tudo era possível e a imaginação não tinha limites.',
      'Narizinho era uma menina muito sapeca, com um narizinho arrebitado. Ela passava os dias brincando com a boneca Emília, que era de pano e falava!',
      'Emília era a boneca mais levada do mundo. Ela tomou a pílula falante do Doutor Caramujo e desde então não parava de falar um minuto.',
      'Pedrinho, primo de Narizinho, adorava aventuras. Ele já enfrentou o Saci Pererê, a Cuca e até o Minotauro no país da Fábula.',
      'No Sítio, os animais também falavam. O Visconde de Sabugosa era um sábio feito de sabugo de milho e o Rinoceronte Quindim era o mais gentil dos gigantes.',
    ],
  },
  {
    title: 'Branca de Neve',
    author: 'Irmãos Grimm',
    pageCount: 6,
    category: 'conto de fadas',
    description: 'Uma princesa, uma maçã envenenada e sete amigos anões.',
    pages: [
      'Era uma vez uma princesa chamada Branca de Neve. Ela tinha a pele branca como a neve, os lábios vermelhos como o sangue e os cabelos pretos como o ébano.',
      'A rainha má, sua madrasta, tinha um espelho mágico. Todas as manhãs ela perguntava: — Espelho, espelho meu, existe alguém mais bela do que eu?',
      'Até que um dia o espelho respondeu que Branca de Neve era a mais bela. A rainha ficou furiosa e mandou um caçador levar a princesa para a floresta.',
      'Branca de Neve correu pela floresta escura até encontrar uma casinha muito fofa. Lá dentro, tudo era pequenino: sete pratos, sete camas, sete cadeirinhas.',
      'Os sete anões deixaram Branca de Neve morar com eles. Mas a rainha má descobriu e deu para ela uma maçã envenenada. Branca de Neve caiu num sono profundo.',
      'Um príncipe que passava por ali viu Branca de Neve e se apaixonou. Deu um beijo nela e o feitiço se quebrou. Os dois viveram felizes para sempre!',
    ],
  },
  {
    title: 'Chapeuzinho Vermelho',
    author: 'Irmãos Grimm',
    pageCount: 5,
    category: 'conto de fadas',
    description: 'Uma menina de capa vermelha, um lobo mau e uma vovó.',
    pages: [
      'Era uma vez uma menina muito querida que ganhou da avó uma capa vermelha com capuz. Por isso, todos a chamavam de Chapeuzinho Vermelho.',
      'Um dia, a mamãe pediu: — Chapeuzinho, leve estes doces para a vovó que está doentinha. Não pare no caminho e não fale com estranhos!',
      'Pelo caminho, Chapeuzinho encontrou o lobo mau. — Aonde você vai, menina? — perguntou o lobo, fingindo ser bonzinho. — Vou à casa da vovó! — respondeu ela.',
      'O lobo correu mais rápido, chegou primeiro na casa da vovó, engoliu a pobre velhinha e se vestiu com as roupas dela. Quando Chapeuzinho chegou, estranhou: — Vovó, que olhos grandes você tem!',
      '— É para te ver melhor! — respondeu o lobo. — Que boca grande você tem! — É para te comer! Um caçador que passava ouviu os gritos, salvou as duas e o lobo fugiu para bem longe.',
    ],
  },
  {
    title: 'Os Três Porquinhos',
    author: 'Joseph Jacobs',
    pageCount: 5,
    category: 'infantil',
    description: 'Três porquinhos constroem casas e um lobo soprador aparece.',
    pages: [
      'Era uma vez três porquinhos que saíram de casa para construir suas próprias moradias. Cada um escolheu um material diferente para construir.',
      'O primeiro porquinho construiu uma casa de palha. Era rápida e fácil de fazer. Ele cantava e dançava enquanto trabalhava.',
      'O segundo porquinho construiu uma casa de madeira. Mais firme que a de palha, mas ainda não era muito resistente. Ele também cantava enquanto trabalhava.',
      'O terceiro porquinho construiu uma casa de tijolos. Trabalhou muito, mas sabia que sua casa seria forte e segura. Não teve tempo para cantar.',
      'O lobo mau soprou a casa de palha, que voou longe. Depois soprou a de madeira, que também caiu. Mas a casa de tijolos resistiu. Os três porquinhos viveram felizes e protegidos!',
    ],
  },
  {
    title: 'João e Maria',
    author: 'Irmãos Grimm',
    pageCount: 6,
    category: 'conto de fadas',
    description: 'Dois irmãos perdidos na floresta encontram uma casa de doces.',
    pages: [
      'João e Maria eram irmãos que viviam com o pai e a madrasta perto de uma floresta escura. Eles eram muito pobres e não tinham o que comer.',
      'A madrasta convenceu o pai a abandonar as crianças na floresta. Mas João, esperto, guardou pedrinhas brancas no bolso para marcar o caminho de volta.',
      'Na floresta, João e Maria se perderam. Caminharam por muito tempo até que avistaram algo incrível: uma casa feita toda de doces! As paredes eram de biscoito e o telhado de chocolate.',
      'Dentro da casa morava uma bruxa malvada. Ela prendeu João numa gaiola e obrigou Maria a cozinhar para engordar o irmão. Queria comer João!',
      'Maria fingiu obedecer, mas era muito esperta. Quando a bruxa se aproximou do forno, Maria deu um empurrão e a trancou lá dentro!',
      'João e Maria fugiram com um tesouro de doces. Encontraram o caminho de casa com as pedrinhas de João. O pai os abraçou e eles nunca mais passaram fome.',
    ],
  },
  {
    title: 'A Bela e a Fera',
    author: 'Jeanne-Marie Leprince de Beaumont',
    pageCount: 6,
    category: 'conto de fadas',
    description: 'Uma jovem descobre o amor verdadeiro por trás de uma aparência monstruosa.',
    pages: [
      'Era uma vez um mercador muito pobre que tinha três filhas. A mais nova, Bela, era tão bondosa quanto bonita. Ela adorava ler livros e sonhar.',
      'Um dia, o mercador se perdeu na floresta e encontrou um castelo encantado. Colheu uma rosa para Bela, mas um monstro apareceu: — Você pagará por isso com sua vida!',
      'O mercador contou a história para as filhas. Bela decidiu ir ao castelo no lugar do pai. A Fera a recebeu com gentileza e a tratava como uma princesa.',
      'Todas as noites, a Fera jantava com Bela e fazia perguntas: — Bela, você aceita se casar comigo? — Não, Fera, você é muito feia! — respondia ela com medo.',
      'Com o tempo, Bela começou a enxergar a bondade no coração da Fera. Ele era gentil, generoso e a amava de verdade. A beleza interior era o que importava.',
      'Bela declarou seu amor pela Fera. Naquele instante, o feitiço se quebrou e a Fera se transformou num lindo príncipe. Casaram-se e viveram felizes para sempre!',
    ],
  },
]

async function main() {
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
