import fs from 'node:fs/promises'

export async function download(url, filename) {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await fs.writeFile(filename, buffer)
}
