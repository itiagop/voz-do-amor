const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const books = [
  {
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    pageCount: 12,
    category: 'clássico',
    description: 'Um piloto cai no deserto e conhece um pequeno príncipe de outro planeta.',
  },
  {
    title: 'A Lagartinha Comilona',
    author: 'Eric Carle',
    pageCount: 10,
    category: 'infantil',
    description: 'Uma lagartinha muito comilona come de tudo até virar uma linda borboleta.',
  },
  {
    title: 'O Sítio do Picapau Amarelo',
    author: 'Monteiro Lobato',
    pageCount: 14,
    category: 'infantil',
    description: 'Emília, Narizinho e Pedrinho vivem aventuras incríveis no sítio mais mágico do Brasil.',
  },
  {
    title: 'Branca de Neve',
    author: 'Irmãos Grimm',
    pageCount: 10,
    category: 'conto de fadas',
    description: 'Uma princesa, uma maçã envenenada e sete amigos anões.',
  },
  {
    title: 'Chapeuzinho Vermelho',
    author: 'Irmãos Grimm',
    pageCount: 8,
    category: 'conto de fadas',
    description: 'Uma menina de capa vermelha, um lobo mau e uma vovó.',
  },
  {
    title: 'Os Três Porquinhos',
    author: 'Joseph Jacobs',
    pageCount: 8,
    category: 'infantil',
    description: 'Três porquinhos constroem casas e um lobo soprador aparece.',
  },
  {
    title: 'João e Maria',
    author: 'Irmãos Grimm',
    pageCount: 10,
    category: 'conto de fadas',
    description: 'Dois irmãos perdidos na floresta encontram uma casa de doces.',
  },
  {
    title: 'A Bela e a Fera',
    author: 'Jeanne-Marie Leprince de Beaumont',
    pageCount: 12,
    category: 'conto de fadas',
    description: 'Uma jovem descobre o amor verdadeiro por trás de uma aparência monstruosa.',
  },
]

async function main() {
  for (const book of books) {
    await prisma.book.create({ data: book })
  }
  console.log('8 livros criados com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
