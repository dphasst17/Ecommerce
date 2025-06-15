import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { ApiProvider } from './context/apiContext.tsx'
import { StateProvider } from './context/stateContext.tsx'
import { CartProvider } from './context/cartContext.tsx'
import GlobalStyles from './components/globalStyles/index.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StateProvider>
    <ApiProvider>
      <CartProvider>
        <NextUIProvider>
          <GlobalStyles>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE}>
              <App />
            </GoogleOAuthProvider>
          </GlobalStyles>
        </NextUIProvider>
      </CartProvider>
    </ApiProvider>
  </StateProvider>
)
