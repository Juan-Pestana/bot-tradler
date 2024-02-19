'use client'
import Balancer from 'react-wrap-balancer'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Message } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import { formattedText } from '@/lib/utils'
import { useEffect, useState } from 'react'

const convertNewLines = (text: string) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))

interface ChatLineProps extends Partial<Message> {
  sources: string[]
}

export function ChatLine({
  role = 'assistant',
  content,
  sources,
}: ChatLineProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (!content) {
    return null
  }
  const formattedMessage = convertNewLines(content)

  return (
    <div className="my-4">
      <Card
        className={`mb-2 w-max max-w-[75%]  ${
          role !== 'assistant' && 'ml-auto '
        }`}
      >
        <CardHeader>
          <CardTitle
            className={`text-xl ${
              role != 'assistant'
                ? 'text-amber-500 dark:text-amber-200 ml-auto'
                : 'text-blue-500 dark:text-blue-200'
            }`}
          >
            {role == 'assistant' ? (
              <div className="flex items-center gap-4">
                <img
                  className="w-14 h-14 rounded-full"
                  src="https://media.licdn.com/dms/image/C4D03AQFCoZ-hb_OVnA/profile-displayphoto-shrink_800_800/0/1628612939050?e=1714003200&v=beta&t=7aPTH4X5ia5EWkAjHmAX1zWTp0g2y0PNrrLXGIgZTDM"
                  alt="Rounded avatar"
                />{' '}
                IraBot
              </div>
            ) : (
              'You'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-lg">
          <Balancer>{formattedMessage}</Balancer>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full">
            {sources && sources.length ? (
              <Accordion type="single" collapsible className="w-full">
                {sources.map((source, index) => (
                  <AccordionItem value={`source-${index}`} key={index}>
                    <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                    <AccordionContent>
                      <ReactMarkdown>{formattedText(source)}</ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : null}
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}
