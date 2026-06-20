const sharp = require('sharp')
const path = require('path')

const sizes = [192, 512]

async function main() {
  for (const size of sizes) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="64" fill="#ec7d1a"/>
      <text x="256" y="340" text-anchor="middle" font-size="300" fill="white">📚</text>
    </svg>`

    await sharp(Buffer.from(svg))
      .resize(size, size)
      .toFile(path.join(__dirname, '..', 'public', 'icons', `icon-${size}.png`))

    console.log(`icon-${size}.png created`)
  }
}

main().catch(console.error)
