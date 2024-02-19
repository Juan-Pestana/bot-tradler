import { Pinecone } from '@pinecone-database/pinecone'
//import { env } from './config'

let pineconeClientInstance: Pinecone | null

async function initPineconeClient() {
  const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  })
  return pineconeClient
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient()
  }

  return pineconeClientInstance
}
