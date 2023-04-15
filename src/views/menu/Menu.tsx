import React, { Fragment, useContext, useState } from "react";
import { RiSettingsLine } from 'react-icons/ri';
import { SiTraefikproxy } from 'react-icons/si';
import TokenSetupDialog from "./TokenSetupDialog";
import { ConfigContext, ConfigDispatchContext } from "@/context/ConfigContext";
import { MessagesDispatchContext } from "@/context/MessagesContext";
import { useIsClient } from "usehooks-ts";
import useConfirmDialog from "@/hooks/dialogs/UseConfirmDialog";
import { Switch } from "@headlessui/react";
import Image from 'next/image'

export default function Menu() {
  const isClient = useIsClient()
  const [tokenSetupDialogOpen, setTokenSetupDialogOpen] = useState(false)
  const config = useContext(ConfigContext)
  const configDispatch = useContext(ConfigDispatchContext)
  const dispatch = useContext(MessagesDispatchContext)

  const clearRecordsDialog = useConfirmDialog({
    title: "Sure to clear all chat records?",
    onYes: () => { dispatch({ type: "clear" }) }
  })

  const enableProxyConfirmDialog = useConfirmDialog({
    title: "Sure to enable proxy mode?",
    description: "If enabled, your OpenAI Key and Chat Records will send over our server to openai. Please don't enable this mode if you don't trust this site.",
    onYes: () => {
      configDispatch({ type: "setProxyMode", enabled: true })
    }
  })

  const onProxyModeToggle = (b: boolean) => {
    if (b) {
      enableProxyConfirmDialog.setOpen(true)
    } else {
      configDispatch({ type: "setProxyMode", enabled: false })
    }
  }

  return (
    <>
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        {clearRecordsDialog.dialog}
        {enableProxyConfirmDialog.dialog}
        <TokenSetupDialog open={tokenSetupDialogOpen} setOpen={b => { setTokenSetupDialogOpen(b) }}></TokenSetupDialog>
        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
          <a className="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all hover:pr-4 group">
            <Image src='/logo.svg' alt={"Logo"} width={240} height={150} className="px-20 md:px-10" />
          </a>
        </div>
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          onClick={() => clearRecordsDialog.setOpen(true)}
        >
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <polyline points="3 6 5 6 21 6">
            </polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
            </path>
            <line x1="10" y1="11" x2="10" y2="17">
            </line>
            <line x1="14" y1="11" x2="14" y2="17">
            </line>
          </svg>Clear Chat Record
        </a>
        {/* <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              { theme === 'dark' ? <><MdOutlineLightMode/>Light mode</> : <><MdOutlineDarkMode/>Dark mode</>}
            </a> */}
        {isClient &&
          <>
            <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
              <SiTraefikproxy /><div className="flex-1">Proxy Mode</div>
              <Switch checked={config.proxyModeEnabled} onChange={onProxyModeToggle} as={Fragment}>
                {
                  ({ checked }) => (
                    <button
                      className={`${checked ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Enable notifications</span>
                      <span
                        className={`${checked ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </button>
                  )
                }
              </Switch>
            </a>
            <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
              onClick={() => setTokenSetupDialogOpen(true)}
            >
              <RiSettingsLine />{isClient && (config.token === '' ? 'Setup OpenAI API Key' : 'API Key is Set!')}
            </a>
          </>
        }
      </nav>
    </>
  )
}