'use client'
import { useEffect } from 'react'
import { scrollToBottom } from '@/lib/utils'
import { initialMessages } from '@/lib/utils'
import { ChatLine } from './Chat-bubble'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Message, useChat } from 'ai/react'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
    })
  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100)
  }, [messages])
  return (
    <div className="rounded-2xl border h-[75vh] flex flex-col justify-between">
      <div className="p-6 overflow-auto">
        {messages.map((message, index) => (
          <ChatLine
            key={message.id}
            role={message.role}
            content={message.content}
            sources={[]}
            // Start from the third message of the assistant
            //sources={message.role !== 'assistant' ? [] : sources}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex clear-both">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={'Type to chat with AI...'}
          className="mr-2"
        />

        <Button type="submit" className="w-24" disabled={isLoading}>
          {isLoading ? '...' : 'Ask'}
        </Button>
      </form>
    </div>
  )
}
