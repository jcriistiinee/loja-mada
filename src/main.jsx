import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './LojaApp.jsx';
import './index.css' // <-- Importa o Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
