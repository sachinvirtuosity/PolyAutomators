import ReactDOM from 'react-dom'
import App from './App'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import 'tw-elements';
import { MetaMaskProvider } from "metamask-react";

ReactDOM.render(
  <BrowserRouter>
    <MetaMaskProvider>
      <App/>
    </MetaMaskProvider>
  </BrowserRouter>,
  document.getElementById('root')

)
