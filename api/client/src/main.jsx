import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './pages/css/not.css'
import "./components/FeaturesSection.css";
import { store,persistor } from './redux/store.js'
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react"
import ThemeProvider from './components/ThemeProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
         <App />
      </ThemeProvider>
  </Provider>
  </PersistGate>
)


// we use provider becuse the store shuold availble  around of our app