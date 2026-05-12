import minhaLogo from '/logo.png';

export default function Header({ currentTab, setCurrentTab, isAdmin, setIsAdmin }) {
  return (
    <header className="bg-black border-b border-amber-900/50 sticky top-0 z-50 shadow-lg shadow-black">
      {/* Diminuímos o py-6 para py-3 no mobile para achatar o header */}
      <div className="container mx-auto px-4 py-3 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Bloco da Logo + Títulos: Agora em Row no Mobile */}
        <div className="flex flex-row items-center gap-3 md:gap-4 text-left">
          <img 
            src={minhaLogo}
            alt="Logo Ministério Guardiões da Fé" 
            /* Logo bem menor no mobile (w-12) e normal no desktop (md:w-24) */
            className="w-12 h-12 md:w-24 md:h-24 object-cover border-amber-700/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          />
          <div>
            {/* Título menor no mobile (text-lg) para caber ao lado da logo */}
            <h1 className="text-lg md:text-4xl font-serif font-bold text-amber-400 tracking-wide drop-shadow-md leading-tight">
              Ministério <span className="block md:inline">Guardiões da Fé</span>
            </h1>
            {/* Escondemos a Paróquia no mobile para ganhar altura vital */}
            <p className="hidden md:block text-sm md:base font-serif text-amber-200/70 mt-1 uppercase tracking-widest">
              Paróquia Cristo Rei de Baturité
            </p>
          </div>
        </div>

        {/* Menu de Navegação: Botões mais compactos no mobile */}
        <nav className="flex flex-row flex-wrap justify-center gap-1 md:gap-4 w-full md:w-auto">
          <NavButton 
            active={currentTab === 'calendar'} 
            onClick={() => setCurrentTab('calendar')}
            label="Calendário" // Texto mais curto no mobile ajuda
          />
          <NavButton 
            active={currentTab === 'about'} 
            onClick={() => setCurrentTab('about')}
            label="Sobre" 
          />
          <NavButton 
            active={currentTab === 'form'} 
            onClick={() => setCurrentTab('form')}
            label="Solicitar" 
          />
          
          {isAdmin && (
            <NavButton 
              active={currentTab === 'admin'} 
              onClick={() => setCurrentTab('admin')}
              label="Admin" 
            />
          )}
        </nav>
      </div>
    </header>
  )
}

/* Componente auxiliar para não repetir código e manter os botões limpos */
function NavButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm transition-all font-medium border ${
        active
          ? 'bg-amber-900/40 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
          : 'bg-transparent border-transparent text-neutral-400 hover:text-amber-300'
      }`}
    >
      {label}
    </button>
  );
}