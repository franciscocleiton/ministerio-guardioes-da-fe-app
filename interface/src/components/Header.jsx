export default function Header({ currentTab, setCurrentTab, isAdmin, setIsAdmin }) {
  return (
    <header className="bg-black border-b border-amber-900/50 sticky top-0 z-10 shadow-lg shadow-black">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Bloco da Logo + Títulos */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left mb-6 md:mb-0">
          {/* Imagem puxada da pasta public */}
          <img 
            src="/logo.png" 
            alt="Logo Ministério Guardiões da Fé" 
            className="w-20 h-20 md:w-24 md:h-24 object-cover border-amber-700/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-400 tracking-wide drop-shadow-md">
              Ministério Guardiões da Fé
            </h1>
            <p className="text-sm md:text-base font-serif text-amber-200/70 mt-1 uppercase tracking-widest">
              Paróquia Cristo Rei de Baturité
            </p>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentTab('calendar')}
            className={`px-4 py-2 rounded transition-all font-medium border ${
              currentTab === 'calendar'
                ? 'bg-amber-900/40 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-transparent border-transparent text-neutral-400 hover:text-amber-300 hover:border-amber-900/50'
            }`}
          >
            Ver Calendário
          </button>

          <button
            onClick={() => setCurrentTab('about')}
            className={`px-4 py-2 rounded transition-all font-medium border ${
              currentTab === 'about'
                ? 'bg-amber-900/40 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-transparent border-transparent text-neutral-400 hover:text-amber-300 hover:border-amber-900/50'
            }`}
          >
            Quem Somos
          </button>

          <button
            onClick={() => setCurrentTab('form')}
            className={`px-4 py-2 rounded transition-all font-medium border ${
              currentTab === 'form'
                ? 'bg-amber-900/40 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-transparent border-transparent text-neutral-400 hover:text-amber-300 hover:border-amber-900/50'
            }`}
          >
            Solicitar Serviço
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-4 py-2 rounded transition-all font-medium border ${
                currentTab === 'admin'
                  ? 'bg-amber-900/40 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-transparent border-transparent text-neutral-400 hover:text-amber-300 hover:border-amber-900/50'
              }`}
            >
              Painel Admin
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}