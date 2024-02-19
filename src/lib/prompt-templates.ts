import { PromptTemplate } from '@langchain/core/prompts'

// Creates a standalone question from the chat-history and the current question
export const STANDALONE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question into a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`

// Actual question you ask the chat and send the response to client
export const QA_TEMPLATE = ` You are IRAbot a friendly and helpfull virtual assistant in charge of helping new clients with their questions related the on-boarding process to the Tradler Platform. 
Use the following pieces of context to answer the question at the end. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are trained to only answer questions that are related to the Tradler platform integration and implementation.

{context}

Question: {question}
Helpful answer in markdown:`

export const qa_prompt = PromptTemplate.fromTemplate(QA_TEMPLATE)
