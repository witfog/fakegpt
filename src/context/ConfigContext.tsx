import { Dispatch, ReactNode, createContext, useEffect, useReducer, useState } from 'react';
import { Configuration, OpenAIApi } from "openai";
import { useEffectOnce, useLocalStorage } from 'usehooks-ts';

interface Props {
  children: ReactNode | ReactNode[]
};


type Config = {
  token: string
  proxyModeEnabled: boolean
}

type Action = {
  type: "setToken"
  data: string
} | {
  type: "setProxyMode"
  enabled: boolean
}

interface Props {
  children: ReactNode | ReactNode[]
};

const initialConfig: Config = {
  token: "",
  proxyModeEnabled: false,
}

export const ConfigContext = createContext<Config>(initialConfig);
export const ConfigDispatchContext = createContext<Dispatch<Action>>(() => { });

export function ConfigProvider({ children }: Props) {
  const [lsConfig, setLsConfig] = useLocalStorage('fakegpt-config', initialConfig)

  // Remove unused data from v0.3.4, token store inside "config" item
  useEffectOnce(() => {
    if(localStorage.getItem('token') != null) {
      localStorage.removeItem('token')
    }
  })

  const configReducer = (config: Config, action: Action) => {
    let newConfig: Config
    switch (action.type) {
      case 'setProxyMode': {
        newConfig = {
          ...config,
          proxyModeEnabled: action.enabled
        }
        break
      }
      case 'setToken': {
        newConfig = {
          ...config,
          token: action.data
        }
        break
      }
      default: {
        throw Error('Unknown action: ' + action);
      }
    }
    setLsConfig(newConfig)
    return newConfig
  }

  const [config, dispatch] = useReducer(
    configReducer,
    lsConfig
  );

  return (
    <ConfigContext.Provider value={config}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
}