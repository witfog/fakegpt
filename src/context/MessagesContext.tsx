import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export const MessagesContext = createContext<Message[]>([]);
export const MessagesDispatchContext = createContext<Dispatch<Action>>(() => { });

export type Message = {
  id: number
  role: "user" | "system" | "assistant"
  content: string
}

type AddMessageAction = {
  type: "added"
  role: "user" | "chatgpt" | "assistant"
  content: string
}
type ClearMessagesAction = { type: "clear" }
type Action = AddMessageAction | ClearMessagesAction

interface Props {
  children: ReactNode | ReactNode[]
};

export function MessagesProvider({ children }: Props) {
  const [localMsgs, setLocalMsgs] = useLocalStorage<Message[]>('chat', [])

  const MessagesReducer = (messages: Message[], action: Action) => {
    switch (action.type) {
      case "clear": {
        setLocalMsgs([])
        return []
      }
      case 'added': {
        const id = messages.length > 0 ? messages[messages.length - 1].id + 1 : 0
        const msgs = [...messages, {
          id: id,
          content: action.content,
          role: action.role
        }] as Message[]
        setLocalMsgs(msgs)
        return msgs;
      }
      default: {
        throw Error('Unknown action: ' + action);
      }
    }
  }

  const [messages, dispatch] = useReducer(
    MessagesReducer,
    localMsgs
  );


  return (
    <MessagesContext.Provider value={messages}>
      <MessagesDispatchContext.Provider value={dispatch}>
        {children}
      </MessagesDispatchContext.Provider>
    </MessagesContext.Provider>
  );
}

const initialMessages: Message[] = [
  // { id: 0, content: 'ingress nginx 如何配置覆盖 x-request-id header', role: 'user' },
  // { id: 1, content: 'Markdown', role: 'assistant' },
  // { id: 0, content: 'ingress nginx 如何配置覆盖 x-request-id header', role: 'user' },
  // { id: 1, content: 'Markdown', role: 'assistant' },
  // { id: 0, content: 'ingress nginx 如何配置覆盖 x-request-id header', role: 'user' },
  // { id: 1, content: 'Markdown', role: 'assistant' },
  // { id: 0, content: 'ingress nginx 如何配置覆盖 x-request-id header', role: 'user' },
  // { id: 1, content: 'Markdown', role: 'assistant' },
  // { id: 0, content: 'ingress nginx 如何配置覆盖 x-request-id header', role: 'user' },
  // { id: 1, content: 'Markdown', role: 'assistant' },
  // { id: 0, content: 'ingress nginx 如何配置覆盖 x-request-id header', role: 'user' },
  // { id: 1, content: 'Markdown', role: 'assistant' },
  // { id: 0, content: 'ingress nginx 如何配置覆盖 x-request-id header', role: 'user' },
  // { id: 1, content: 'Markdown', role: 'assistant' },
];