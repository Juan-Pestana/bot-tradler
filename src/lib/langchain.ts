import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { getVectorStore } from './vector-store'
import { getPineconeClient } from './pinecone-client'
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from 'ai'

import { streamingModel, nonStreamingModel } from './llm'
import {
  STANDALONE_QUESTION_TEMPLATE,
  QA_TEMPLATE,
  qa_prompt,
} from './prompt-templates'

type callChainArgs = {
  question: string
  chatHistory: string
}

export async function callChain({ question, chatHistory }: callChainArgs) {
  try {
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ')
    const pineconeClient = await getPineconeClient()
    const vectorStore = await getVectorStore(pineconeClient)
    const { stream, handlers } = LangChainStream()

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,
      vectorStore.asRetriever(),
      {
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
          template: STANDALONE_QUESTION_TEMPLATE,
        },
        // qaChainOptions: {
        //   prompt: qa_prompt,
        // },
        returnSourceDocuments: true,
      }
    )

    chain.stream({
      question: sanitizedQuestion,
      chat_history: chatHistory,
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error)
  }
}
