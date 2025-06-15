import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { StateProvider } from './context/state.tsx'
import { ApiProvider } from './context/api.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StateProvider>
      <ApiProvider>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </ApiProvider>
    </StateProvider>
)
