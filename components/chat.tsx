'use client'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { useUIState, useAIState } from 'ai/rsc'
import { Message, Session } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'
import { useActions } from "ai/rsc";

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({ id, className, session, missingKeys }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useUIState()
  const [aiState] = useAIState()
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { submitToElevenLabs } = useActions();

  const data = async () => {
    const assistantMessages = aiState.messages.filter((message: any) => message.role === 'assistant');
    console.log('AI state:', aiState);
    const mostRecentAssistantMessage = assistantMessages.pop();
    console.log('Most recent assistant message:', mostRecentAssistantMessage);

    if (mostRecentAssistantMessage) {
      const aiVoiceText = mostRecentAssistantMessage.content;
      console.log('AI voice text:', aiVoiceText);
      await setAudio(aiVoiceText);
    }
  }

  const setAudio = async (content: string) => {
    try {
      const response = await submitToElevenLabs(content);
      const base64Audio = response.aiVoice;
      const audioBlob = base64ToBlob(base64Audio, 'audio/wav');
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
      console.log('Audio URL:', audioSrc);
      if (audioSrc)playAudio(audioSrc);
    } catch (error) {
      console.error('Error generating or playing audio:', error);
    }
  };

  const playAudio = (audioUrl: string) => {
    try {
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    } catch (error) {
      console.error('Error creating audio object:', error);
    }
  };

  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mimeType });
  };

  useEffect(() => {
    console.log('AI state: ', aiState);
    console.log('User messages: ', messages);
  }, [aiState, messages])

  useEffect(() => {
    data().then()
    // return () => {
    //   if (mediaRecorder) {
    //     mediaRecorder.stream.getTracks().forEach(track => track.stop());
    //   }
    // };
  }, [aiState, data, messages])

  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, path, session?.user, messages])

  useEffect(() => {
    setNewChatId(id)
  })

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`)
    })
  }, [missingKeys])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
      useScrollAnchor()

  return (
      <div
          className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
          ref={scrollRef}
      >
        <div
            className={cn('pb-[200px] pt-4 md:pt-10', className)}
            ref={messagesRef}
        >
          {messages.length > 0 ? (
              <ChatList messages={messages} isShared={false} session={session} />
          ) : (
              <EmptyScreen />
          )}
          <div className="w-full h-px" ref={visibilityRef} />
        </div>
        <ChatPanel
            id={id}
            input={input}
            setInput={setInput}
            isAtBottom={isAtBottom}
            scrollToBottom={scrollToBottom}
        />
      </div>
  )
}

