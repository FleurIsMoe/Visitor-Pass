import fs from 'fs/promises'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'visitorCount.json')

export async function getVisitorCount(): Promise<number> {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true })

    const data = await fs.readFile(dataFilePath, 'utf8')
    const { count } = JSON.parse(data)

    const newCount = count + 1

    await fs.writeFile(dataFilePath, JSON.stringify({ count: newCount }))

    return newCount
  } catch (error) {
    await fs.writeFile(dataFilePath, JSON.stringify({ count: 1 }))
    return 1
  }
}