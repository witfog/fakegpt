import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message"
import { MessagesContext } from "@/context/MessagesContext";
import { useIsClient } from "usehooks-ts";

export default function Output() {
  const messages = useContext(MessagesContext)
  const bottomViewRef = useRef<HTMLDivElement | null>(null)
  const isClient = useIsClient()

  useEffect(() => {
    scrollToBottom()
  })

  const scrollToBottom = () => {
    bottomViewRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="h-full w-full dark:bg-gray-800">
          <div className="flex flex-col items-center text-sm dark:bg-gray-800">
            {
              isClient && messages.map((message, index) =>
                <Message msg={message} key={index} />
              )
            }
            <div className="w-full h-32 md:h-48 flex-shrink-0" ref={(el) => { bottomViewRef.current = el; }}>
            </div>
          </div>
          <button className="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200"
            onClick={() => { scrollToBottom() }}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 m-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19">
              </line>
              <polyline points="19 12 12 19 5 12">
              </polyline>
            </svg>
          </button>
          <button className="react-scroll-to-bottom--css-conaf-1tj0vk3 scroll-convo" type="button">
          </button>
        </div>
      </div>

    </>
  )
}