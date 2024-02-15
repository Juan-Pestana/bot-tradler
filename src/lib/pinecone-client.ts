import { Pinecone } from '@pinecone-database/pinecone'
import { env } from './config'

let pineconeClientInstance: Pinecone | null

async function initPineconeClient() {
  const pineconeClient = new Pinecone({
    apiKey: env.PINECONE_API_KEY,
  })
  return pineconeClient
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient()
  }

  return pineconeClientInstance
}
