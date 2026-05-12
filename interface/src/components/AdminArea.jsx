import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient' // <-- Importando o Supabase

export default function AdminArea({ isAdmin, setIsAdmin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // Estados para as solicitações vindas do banco
  const [solicitacoes, setSolicitacoes] = useState([])

  // Estados para o formulário de Nova Escala
  const [novoEvento, setNovoEvento] = useState({
    tipo: '',
    data: '',
    hora: '',
    local: '',
    detalhes: '',
    status: 'confirmado'
  })

  const [expandedId, setExpandedId] = useState(null);

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // --- EFEITO PARA BUSCAR DADOS (ATUALIZADO PARA SUPABASE) ---
  useEffect(() => {
    if (isAdmin) {
      carregarSolicitacoes()
    }
  }, [isAdmin])

  const carregarSolicitacoes = async () => {
    try {
      // Fazendo um SELECT direto na tabela do Supabase
      const { data, error } = await supabase
        .from('solicitacoes')
        .select('*')
        .order('data_evento', { ascending: true }) // Já traz ordenado pela data!

      if (error) throw error
      if (data) setSolicitacoes(data)
      
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error)
    }
  }

  // --- FUNÇÕES DE LOGIN/LOGOUT ---
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'guardioes2025A@') { 
      setIsAdmin(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setPassword('')
  }

  // --- FUNÇÃO PARA SALVAR NOVO EVENTO (ATUALIZADA PARA SUPABASE) ---
  const handleSalvarEvento = async (e) => {
    e.preventDefault()
    
    try {
      // O banco exige formato HH:MM:SS, então garantimos aqui antes de enviar
      const eventoParaSalvar = {
        ...novoEvento,
        hora: novoEvento.hora.length === 5 ? novoEvento.hora + ':00' : novoEvento.hora
      }

      // Fazendo um INSERT direto na tabela eventos
      const { error } = await supabase
        .from('eventos')
        .insert([eventoParaSalvar])

      if (!error) {
        alert('Escala cadastrada com sucesso!')
        // Limpa o formulário
        setNovoEvento({ tipo: '', data: '', hora: '', local: '', detalhes: '', status: 'confirmado' })
      } else {
        console.error("Erro do Supabase:", error)
        alert('Erro ao salvar. Verifique os dados.')
      }
    } catch (error) {
      console.error("Erro inesperado:", error)
      alert('Erro de conexão com o banco de dados.')
    }
  }

  const handleAprovar = async (solic) => {
    const confirmar = window.confirm(`Deseja aprovar o pedido de ${solic.nome_solicitante}?`);
    if (!confirmar) return;

    try {
      // 1. Prepara os dados para a tabela 'eventos'
      // Mapeamos os nomes das colunas da tabela de solicitações para a de eventos
      const novoEventoData = {
        tipo: solic.tipo_evento,
        data: solic.data_evento,
        hora: solic.horario.length === 5 ? solic.horario + ':00' : solic.horario,
        local: solic.local || "Paróquia Cristo Rei", //
        detalhes: `Solicitante: ${solic.nome_solicitante}. Obs: ${solic.detalhes || 'Sem observações'}`,
        status: 'confirmado'
      };

      // 2. Insere na tabela de eventos
      const { error: erroInsert } = await supabase
        .from('eventos')
        .insert([novoEventoData]);

      if (erroInsert) throw erroInsert;

      // 3. Se inseriu com sucesso, deleta da tabela de solicitações
      const { error: erroDelete } = await supabase
        .from('solicitacoes')
        .delete()
        .eq('id', solic.id);

      if (erroDelete) throw erroDelete;

      // 4. Atualiza a lista na tela para o card sumir
      setSolicitacoes(prev => prev.filter(item => item.id !== solic.id));
      alert('Solicitação aprovada e adicionada à agenda!');

    } catch (error) {
      console.error("Erro ao aprovar:", error);
      alert('Erro ao processar aprovação.');
    }
  };

  // --- FUNÇÃO PARA RECUSAR SOLICITAÇÃO ---
  const handleRecusar = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja recusar e excluir esta solicitação?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('solicitacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualiza a lista na tela
      setSolicitacoes(prev => prev.filter(item => item.id !== id));
      alert('Solicitação removida.');

    } catch (error) {
      console.error("Erro ao recusar:", error);
      alert('Erro ao excluir solicitação.');
    }
  };

  // TELA DE LOGIN
  if (!isAdmin) {
    return (
      <div className="bg-neutral-900/80 border border-amber-900/30 p-8 rounded-lg shadow-2xl max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-serif font-bold mb-6 text-amber-400 text-center">Acesso Restrito</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-200/70 mb-1">Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
              placeholder="••••••••"
            />
            {error && <p className="text-red-500 text-xs mt-2">Senha incorreta. Tente novamente.</p>}
          </div>
          <button 
            type="submit" 
            className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    )
  }

  // PAINEL DE ADMINISTRAÇÃO
  return (
    <div className="bg-neutral-900/80 border border-amber-900/30 p-6 rounded-lg shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b border-amber-900/30 pb-4">
        <h2 className="text-2xl font-serif font-bold text-amber-400">Painel de Administração</h2>
        <button 
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-300 font-medium border border-red-900/50 px-3 py-1 rounded"
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Formulário para Adicionar Serviço/Escala */}
        <div>
          <h3 className="text-xl font-serif font-bold text-neutral-200 mb-4">Cadastrar Nova Escala</h3>
          <form onSubmit={handleSalvarEvento} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-200/70 mb-1">Título do Evento</label>
              <input 
                type="text" 
                required
                value={novoEvento.tipo}
                onChange={(e) => setNovoEvento({...novoEvento, tipo: e.target.value})}
                className="w-full p-2 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-200/70 mb-1">Local</label>
              <input 
                type="text" 
                required
                value={novoEvento.local}
                onChange={(e) => setNovoEvento({...novoEvento, local: e.target.value})}
                className="w-full p-2 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-200/70 mb-1">Data</label>
                <input 
                  type="date" 
                  required
                  value={novoEvento.data}
                  onChange={(e) => setNovoEvento({...novoEvento, data: e.target.value})}
                  className="w-full p-2 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-200/70 mb-1">Hora</label>
                <input 
                  type="time" 
                  required
                  value={novoEvento.hora}
                  onChange={(e) => setNovoEvento({...novoEvento, hora: e.target.value})}
                  className="w-full p-2 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-200/70 mb-1">Repertório (Link)</label>
              <input 
                type="url" 
                placeholder="Link do Drive/Cifras" 
                value={novoEvento.detalhes}
                onChange={(e) => setNovoEvento({...novoEvento, detalhes: e.target.value})}
                className="w-full p-2 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:outline-none" 
              />
            </div>

            <button type="submit" className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition-colors">
              Salvar no Sistema
            </button>
          </form>
        </div>

        {/* Lista de Solicitações Recebidas */}
        <div>
          <h3 className="text-xl font-serif font-bold text-neutral-200 mb-4">Solicitações Pendentes</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            
            {solicitacoes.length === 0 ? (
               <p className="text-sm text-neutral-500 italic mt-4 border border-dashed border-neutral-800 p-4 rounded text-center">
                 Nenhuma solicitação no momento.
               </p>
            ) : (
              solicitacoes.map((solic) => (
                <div key={solic.id} className="p-4 bg-black border border-neutral-800 rounded transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-amber-400 font-bold text-sm">{solic.nome_solicitante} - {solic.tipo_evento}</p>
                      <p className="text-neutral-400 text-xs mt-1">
                        {new Date(solic.data_evento + 'T00:00:00').toLocaleDateString('pt-BR')} às {solic.horario.substring(0,5)}
                      </p>
                    </div>
                  {/* Botão para expandir/recolher */}
                  <button 
                    onClick={() => toggleDetails(solic.id)}
                    className="text-[10px] text-amber-600 hover:text-amber-500 underline uppercase tracking-tighter"
                  >
                    {expandedId === solic.id ? 'Fechar' : 'Ver Detalhes'}
                  </button>
                </div>

                {/* ÁREA DE DETALHES EXPANSÍVEL */}
                {expandedId === solic.id && (
                  <div className="mt-4 p-4 bg-neutral-900/80 border border-amber-900/20 rounded-lg animate-in fade-in slide-in-from-top-1">
                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 border-b border-amber-900/30 pb-1">
                      Resumo da Solicitação
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-y-2 text-sm">
                      <div className="flex justify-between border-b border-neutral-800 pb-1">
                        <span className="text-neutral-500">Data:</span>
                        <span className="text-neutral-200 font-medium">
                          {new Date(solic.data_evento + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-neutral-800 pb-1">
                        <span className="text-neutral-500">Horário:</span>
                        <span className="text-neutral-200 font-medium">{solic.horario.substring(0, 5)}h</span>
                      </div>

                      <div className="flex justify-between border-b border-neutral-800 pb-1">
                        <span className="text-neutral-500">Local Previsto:</span>
                        <span className="text-amber-200/70 italic">{solic.local || "Local não especificado"}</span>
                      </div>

                      <div className="mt-2">
                        <span className="text-neutral-500 block mb-1">Observações do Solicitante:</span>
                        <div className="p-2 bg-black/50 rounded text-neutral-300 italic text-xs leading-relaxed">
                          {solic.detalhes || "Nenhuma observação adicional."}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => handleAprovar(solic)}
                      className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded hover:bg-green-900/60 border border-green-900/50"
                    >
                      Aprovar
                    </button>
                    
                    <button 
                      onClick={() => handleRecusar(solic.id)}
                      className="text-xs bg-red-900/40 text-red-400 px-2 py-1 rounded hover:bg-red-900/60 border border-red-900/50"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  )
}