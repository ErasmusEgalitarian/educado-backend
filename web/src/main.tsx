import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// styles
import './index.css'
import { NotificationProvider } from './components/notification/NotificationContext'
import { ToastContainer } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NotificationProvider>
      <ToastContainer />
        <App/>
    </NotificationProvider>
  </React.StrictMode>
  
)
