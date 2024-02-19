import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from '@langchain/openai'
import { getVectorStore } from './vector-store'
import { getPineconeClient } from './pinecone-client'
import { BufferMemory } from 'langchain/memory'
import { CallbackManager } from 'langchain/callbacks'
import { nonStreamingModel } from './llm'

import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from 'ai'

//import { streamingModel, nonStreamingModel } from './llm'

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
    //const outputParser = new BytesOutputParser()
    const { stream, handlers } = LangChainStream()

    const streamingModel = new ChatOpenAI({
      modelName: 'gpt-4',
      streaming: true,
      verbose: true,
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
      callbackManager: CallbackManager.fromHandlers(handlers),
    })

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,
      vectorStore.asRetriever(),
      {
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
          // template: STANDALONE_QUESTION_TEMPLATE,
        },

        memory: new BufferMemory({
          memoryKey: 'chat_history',
          inputKey: 'question', // The key for the input to the chain
          outputKey: 'text', // The key for the final conversational output of the chain
          returnMessages: true, // If using with a chat model (e.g. gpt-3.5 or gpt-4)
        }),

        verbose: true,
        returnSourceDocuments: false,
        qaChainOptions: {
          type: 'stuff',
          prompt: qa_prompt,
        },
      }
    )

    chain.invoke({
      question: sanitizedQuestion,
      chat_history: chatHistory,
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error)
  }
}
