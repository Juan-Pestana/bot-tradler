import { LangChainStream } from 'ai'
import { CallbackManager } from 'langchain/callbacks'
import { ChatOpenAI } from '@langchain/openai'

const { handlers } = LangChainStream()

export const nonStreamingModel = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  streaming: false,
  verbose: true,
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
})
