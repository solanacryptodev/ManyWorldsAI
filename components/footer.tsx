'use client'
import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'
import { VoiceCapture } from "@/components/voice-capture";

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
      <>
        <div className='flex flex-col justify-centeru'>
          <VoiceCapture />
          <p
              className={cn(
                  'px-2 text-center text-xs leading-normal text-muted-foreground',
                  className
              )}
              {...props}
          >
            Open source AI chatbot built with{' '}
            <ExternalLink href="https://nextjs.org">Next.js</ExternalLink> and{' '}
            <ExternalLink href="https://github.com/vercel/ai">
              Vercel AI SDK
            </ExternalLink>
            .
          </p>
        </div>
      </>
  )
}
