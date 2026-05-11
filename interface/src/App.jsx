import { useState } from 'react'
import Header from './components/Header'
import Calendar from './components/Calendar'
import ServiceForm from './components/ServiceForm'
import AdminArea from './components/AdminArea'
import About from './components/About'

function App() {
  const [currentTab, setCurrentTab] = useState('calendar')
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {currentTab === 'calendar' && <Calendar />}
        {currentTab === 'form' && <ServiceForm />}
        {currentTab === 'admin' && <AdminArea isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
        {currentTab === 'about' && <About />}
      </main>

      <footer className="border-t border-amber-900/30 py-6 text-center text-sm text-neutral-500 font-serif">
        <p>© {new Date().getFullYear()} Ministério Guardiões da Fé. Todos os direitos reservados.</p>
        {/* Um atalho discreto no rodapé para acessar a área de login */}
        <button 
          onClick={() => setCurrentTab('admin')}
          className="mt-2 text-xs text-neutral-700 hover:text-amber-500 transition-colors"
        >
          Área Restrita
        </button>
      </footer>
    </div>
  )
}

export default App