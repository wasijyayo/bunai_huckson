import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider} from '@chakra-ui/react'
import App from './App.jsx'
import './firebase.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
