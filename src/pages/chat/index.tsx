import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Menu from '@/views/menu/Menu'
import ChatView from '@/views/chat/ChatView'
import GoogleAnalytics from '@/extentions/GoogleAnalytics'
import { ConfigProvider } from '@/context/ConfigContext'
import { MessagesProvider } from '@/context/MessagesContext'
import { useDocumentTitle, useEffectOnce } from 'usehooks-ts'

interface InitialProps {
  gtag: string | undefined
}

ChatPage.getInitialProps = async () => {
  const gtag = process.env.GTAG
  return { gtag: gtag }
}

function ChatPage({ gtag }: InitialProps) {
  useDocumentTitle('FakeGPT')
  const [isOpen, setIsOpen] = useState(false)

  // 避免 `.h-screen` 在移动端高度大于实际可视高度的问题
  useEffectOnce(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  })

  return (
    <>
      <ConfigProvider>
        <MessagesProvider>
          <div className="overflow-hidden w-screen h-screen relative">
            {gtag && <GoogleAnalytics gtag={gtag}/>}

            <div className='overflow-hidden w-full h-full relative flex'>
              <div className="flex h-full w-full flex-1 flex-col md:pl-[260px]">
                <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
                  <Transition show={isOpen} as={Fragment}>
                    <Dialog onClose={() => { setIsOpen(false) }} className="md:hidden">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className='fixed inset-0 z-40 flex'>
                          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                          <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 translate-x-0">
                            <div className="absolute top-0 right-0 -mr-12 pt-2 opacity-100">
                              <button type="button" className="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" tabIndex={0}
                                onClick={() => setIsOpen(false)}
                              >
                                <span className="sr-only">Close sidebar</span>
                                <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="h-6 w-6 text-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <line x1="18" y1="6" x2="6" y2="18">
                                  </line>
                                  <line x1="6" y1="6" x2="18" y2="18">
                                  </line>
                                </svg>
                              </button>
                            </div>
                            <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                              <Menu />
                            </div>
                          </Dialog.Panel>
                        </div>
                      </Transition.Child>
                    </Dialog>
                  </Transition>
                  <button type="button" className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white"
                    onClick={() => setIsOpen(true)}
                  >
                    <span className="sr-only">Open sidebar
                    </span>
                    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <line x1="3" y1="12" x2="21" y2="12">
                      </line>
                      <line x1="3" y1="6" x2="21" y2="6">
                      </line>
                      <line x1="3" y1="18" x2="21" y2="18">
                      </line>
                    </svg>
                  </button>
                  <h1 className="flex-1 text-center text-base font-normal">FakeGPT
                  </h1>
                  <button type="button" className="invisible -ml-0.5 -mt-0.5 inline-flex h-10 w-10"></button>
                </div>
                <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
                  <ChatView />
                </main>
              </div>

              <div className="dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col">
                <div className="flex h-full min-h-0 flex-col ">
                  <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                    <Menu />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MessagesProvider>
      </ConfigProvider>
    </>
  )
}

export default ChatPage