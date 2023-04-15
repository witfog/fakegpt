import { ConfigContext } from "@/context/ConfigContext";
import { MessagesContext, MessagesDispatchContext } from "@/context/MessagesContext";
import useAlertDialog from "@/hooks/dialogs/UseAlertDialog";
import React, { useContext, useState } from "react";
import { MdOutlineRefresh } from 'react-icons/md';
import { Configuration, OpenAIApi } from "openai";
import { useIsClient } from "usehooks-ts";

export default function Input() {
  const isClient = useIsClient()
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false)
  const messages = useContext(MessagesContext)
  const dispatch = useContext(MessagesDispatchContext)
  const config = useContext(ConfigContext)
  const alertDialog = useAlertDialog()

  let openai: OpenAIApi | undefined = undefined

  const handleSubmit = async () => {
    if (openai == undefined && config.token.length > 0) {
      const configuration = config.proxyModeEnabled ?
        new Configuration({
          apiKey: config.token,
          basePath: '/api/v1'
        }) :
        new Configuration({
          apiKey: config.token,
        });
      delete configuration.baseOptions.headers['User-Agent'];
      openai = new OpenAIApi(configuration)
    }
    if (openai === undefined || loading || input.trim() === "") { return }
    let msgs = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    msgs = [...msgs, {
      role: "user",
      content: input
    }]
    if (msgs.length > 10) {
      msgs = msgs.slice(-10)
    }
    dispatch(
      {
        type: "added",
        role: "user",
        content: input
      }
    )

    setInput("")
    setLoading(true)

    await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: msgs,
    }).then(completion => {
      dispatch(
        {
          type: "added",
          role: "assistant",
          content: completion.data.choices[0].message?.content || ""
        }
      )
    }).catch(reason => {
      console.log(reason)
      let alertMessage = ''
      if (reason.response) {
        if (reason.response.data?.error?.message) { // Error message from OpenAI.
          alertMessage = `${reason.response.data.error.message}`
        } else if (reason.response.status === 500) { 
          alertMessage = `Unknown Error. Response Code: ${reason.response.status}. The answer may take longer than 1 minute to generate.`
        } else {
          alertMessage = `Unknown Error. Response Code: ${reason.response.status}`
        }
      } else {
        alertMessage = `${reason}. Your network may be broken or you may not be allowed to access OpenAI.`
      }
      const alertTitle = 'Reqeust Failed'
      alertDialog.show(alertTitle, alertMessage)
    }).finally(() => {
      setLoading(false)
    });
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    await handleSubmit()
  }

  const keyPress: React.KeyboardEventHandler<HTMLTextAreaElement> = async (e) => {
    if (e.keyCode == 13) {
      e.preventDefault()
      await handleSubmit()
    }
  }

  return (
    <>
      {alertDialog.dialog}
      {isClient &&
        <div className="absolute z-10 bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
          <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl" onSubmit={onSubmit}>
            <div className="relative flex h-full flex-1 md:flex-col">
              <div className="hidden md:flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                {loading && <button disabled={true} className="btn relative btn-neutral border-0 md:border">
                  <div className="flex w-full items-center justify-center gap-2">
                    <MdOutlineRefresh className="animate-spin" />Loading ...
                  </div>
                </button>}
              </div>
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea tabIndex={0} data-id="f46b1562-b349-4cdf-89ca-ecf758c69357" rows={1} className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0" style={{ maxHeight: "200px", height: "24px", overflowY: "hidden" }}
                  value={input}
                  onKeyDown={keyPress}
                  onChange={e => setInput(e.target.value)}
                  disabled={config.token === ''}
                  placeholder={config.token === '' ? "Setup your openai token first!" : "Send a message..."}
                ></textarea>
                <button disabled={loading} className="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40">
                  {loading ?
                    <MdOutlineRefresh className="animate-spin" /> :
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <line x1="22" y1="2" x2="11" y2="13">
                      </line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2">
                      </polygon>
                    </svg>}
                </button>
              </div>
            </div>
          </form>
          <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
            <span>
              {"Powered by OpenAI's GPT-3 model [gpt-3.5-turbo]."}
            </span>
          </div>
        </div>
      }
    </>
  )
}