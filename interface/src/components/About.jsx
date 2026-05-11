import grupo from '/grupo.jpeg';

export default function About() {
  return (
    <div className="bg-neutral-900/80 border border-amber-900/30 p-6 md:p-10 rounded-lg shadow-2xl h-full">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-400 mb-4">QUEM SOMOS NÓS?</h2>
        <div className="w-24 h-1 bg-amber-700 mx-auto rounded mb-8"></div>

        <img 
          src={grupo}
          alt="Foto do Grupo Ministério Guardiões da Fé" 
          className="w-full max-w-2xl mx-auto rounded-lg shadow-xl border-2 border-amber-900/50 mb-10 object-cover"
          // Adicionamos uma altura máxima para garantir que fique bem em qualquer tela, sem quebrar o layout
          style={{ maxHeight: '400px' }}
        />
        
        <p className="text-neutral-300 text-lg leading-relaxed mb-6">
          O Ministério Guardiões da Fé nasceu de um grupo de oração. Servindo ativamente na Paróquia Cristo Rei de Baturité, da Diocese de Baturité-CE, buscamos ser um instrumento de Deus, levando a Palavra aos corações em cada missa e/ou evento paroquial.
        </p>
      </div>
    </div>
  )
}