import { getChunkedDocsFromPDF } from '@/lib/pdf-loader'
import { embedAndStoreDocs } from '@/lib/vector-store'
import { getPineconeClient } from '@/lib/pinecone-client'

;(async () => {
  try {
    const pineconeClient = await getPineconeClient()
    console.log('Preparing Chunks from PDF')
    const docs = await getChunkedDocsFromPDF()
    console.log(`loading ${docs.length} chunks into pinecone`)
    await embedAndStoreDocs(pineconeClient, docs)
    console.log('Data embeded and Stored')
  } catch (error) {
    console.error('Init client script failed')
  }
})()
