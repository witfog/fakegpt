

import React, { useState } from "react";
import IconChatGPT from "../../icons/IconChatGPT";
import IconUser from "../../icons/IconUser";
import type { Message } from "@/context/MessagesContext"
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useCopyToClipboard, useEffectOnce } from "usehooks-ts";
import { MdOutlineDone } from 'react-icons/md';


interface Props {
  msg: Message
}

export default function Message(props: Props) {
  const { role, content } = props.msg
  const [copiedId, setCopiedId] = useState(-1)
  const [_value, copy] = useCopyToClipboard()

  let codeBlockId = 0

  const onCopy = (id: number, text: string) => {
    copy(text)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(-1)
    }, 2000)
  }

  const [style, setStyle] = useState({})
  useEffectOnce(() => {
    import('react-syntax-highlighter/dist/esm/styles/prism')
      .then(mod => setStyle(mod.vscDarkPlus));
  })

  return (
    <>
      {role == 'assistant' && (
        <div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-100 dark:bg-[#444654]">
          <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
            <div className="w-[30px] flex flex-col relative items-end">
              <IconChatGPT />
            </div>
            <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
              <ReactMarkdown className="markdown prose w-full break-words dark:prose-invert light overflow-scroll"
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const id = codeBlockId++
                    return !inline ? (
                      <div className="bg-black rounded-md mb-4">
                        <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                          {match && <span>{match[1]}</span>}
                          <button id={`code-${id}`} className="flex ml-auto gap-2"
                            disabled={copiedId != -1}
                            onClick={() => onCopy(id, children as string)}
                          >
                            {
                              copiedId === id ? <><MdOutlineDone className="h-4 w-4"/>Copied!</> :
                                <><svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2">
                                  </path>
                                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1">
                                  </rect>
                                </svg>Copy code</>
                            }
                          </button>
                        </div>
                        <SyntaxHighlighter
                          {...props}
                          style={style}
                          language={match ? match[1] : ''}
                          PreTag="div"
                          customStyle={{ background: '#000000', borderRadius: '0.375rem' }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>)
      }
      {role == 'user' && (
        <div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800">
          <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
            <div className="w-[30px] flex flex-col relative items-end">
              <div className="relative flex">
                <div className="w-[30px] flex flex-col relative items-end">
                  <IconUser />
                </div>
              </div>
            </div>
            <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
              <div className="flex flex-grow flex-col gap-3">
                <div className="min-h-[20px] flex flex-col items-start gap-4">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>)
      }
    </>
  )
}