import { env } from './config'
import { OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
// Replace 'your-document-package' with the appropriate package name

export async function embedAndStoreDocs(
  client: Pinecone,
  //@ts-ignore
  docs: Document<Record<string, any>>[]
) {
  try {
    const embeddings = new OpenAIEmbeddings()
    const index = client.index(env.PINECONE_INDEX_NAME)

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    })
  } catch (error) {
    console.error(error)
    throw new Error('error when uploading the data')
  }
}

export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new OpenAIEmbeddings()
    const index = client.index(env.PINECONE_INDEX_NAME)

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    })
    return vectorStore
  } catch (error) {
    console.error(error)
    throw new Error(
      'Something went wrong when trying to instantiate the vectorstore'
    )
  }
}
