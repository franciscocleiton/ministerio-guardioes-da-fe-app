import { useState } from 'react'
import { supabase } from '../supabaseClient' 

export default function ServiceForm() {
  const [formData, setFormData] = useState({
    nome_solicitante: '',
    data_evento: '',
    horario: '',
    tipo_evento: '', // Alterado para texto vazio
    local: '',       // NOVO CAMPO
    detalhes: ''
  })

  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)

    try {
      const dadosParaEnvio = {
        ...formData,
        horario: formData.horario + ':00' 
      }

      const { error } = await supabase
        .from('solicitacoes')
        .insert([dadosParaEnvio])

      if (!error) {
        // --- INÍCIO DA LÓGICA DO WHATSAPP ---
        
        // Formata a data para ficar bonita na mensagem (DD/MM/AAAA)
        const dataFormatada = new Date(formData.data_evento + 'T00:00:00').toLocaleDateString('pt-BR');
        
        const mensagem = `*NOVA SOLICITAÇÃO - APP GUARDIÕES*%0A%0A` +
          `*De:* ${formData.nome_solicitante}%0A` +
          `*Evento:* ${formData.tipo_evento}%0A` +
          `*Local:* ${formData.local}%0A` +
          `*Data:* ${dataFormatada}%0A` +
          `*Hora:* ${formData.horario}h%0A` +
          `*Detalhes:* ${formData.detalhes || 'Sem detalhes'}`;

        // Substitua pelo número da coordenação (com DDD e sem espaços)
        const numeroCoordenacao = "+5585989234207"; 
        
        // Abre o WhatsApp em uma nova aba
        window.open(`https://api.whatsapp.com/send?phone=${numeroCoordenacao}&text=${mensagem}`, '_blank');
        
        // --- FIM DA LÓGICA DO WHATSAPP ---

        alert('Solicitação enviada e redirecionando para o WhatsApp da coordenação!');
        
        // Limpa o formulário
        setFormData({
          nome_solicitante: '',
          data_evento: '',
          horario: '',
          tipo_evento: '',
          local: '',
          detalhes: ''
        })
      } else {
        console.error("Erro do Supabase:", error)
        alert('Erro ao enviar a solicitação.')
      }
    } catch (error) {
      console.error("Erro inesperado:", error)
      alert('Não foi possível conectar ao banco de dados.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="bg-neutral-900/80 border border-amber-900/30 p-6 rounded-lg shadow-2xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif font-bold mb-2 text-amber-400">Solicitar Serviço</h2>
      <p className="text-neutral-400 mb-6">
        Preencha os dados abaixo para solicitar o ministério em seu evento. Entraremos em contato em breve.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-amber-200/70 mb-1">Nome do Solicitante / Pastoral</label>
          <input 
            type="text" 
            required 
            value={formData.nome_solicitante}
            onChange={(e) => setFormData({...formData, nome_solicitante: e.target.value})}
            className="w-full p-3 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
            placeholder="Ex: Pastoral Familiar"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-amber-200/70 mb-1">Data do Evento</label>
            <input 
              type="date" 
              required 
              value={formData.data_evento}
              onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
              className="w-full p-3 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200/70 mb-1">Horário</label>
            <input 
              type="time" 
              required 
              value={formData.horario}
              onChange={(e) => setFormData({...formData, horario: e.target.value})}
              className="w-full p-3 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Campos de Tipo de Evento e Local agrupados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-amber-200/70 mb-1">Tipo de Evento</label>
            <input 
              type="text" 
              required 
              value={formData.tipo_evento}
              onChange={(e) => setFormData({...formData, tipo_evento: e.target.value})}
              className="w-full p-3 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="Ex: Missa, Coroação"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200/70 mb-1">Local</label>
            <input 
              type="text" 
              required 
              value={formData.local}
              onChange={(e) => setFormData({...formData, local: e.target.value})}
              className="w-full p-3 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="Ex: Matriz, Candeia"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-200/70 mb-1">Detalhes Adicionais</label>
          <textarea 
            rows="4" 
            value={formData.detalhes}
            onChange={(e) => setFormData({...formData, detalhes: e.target.value})}
            className="w-full p-3 bg-black border border-neutral-800 rounded text-neutral-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
            placeholder="Descreva qualquer necessidade específica de repertório ou observação..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={enviando}
          className={`w-full mt-4 font-bold text-lg py-3 px-4 rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all transform hover:scale-[1.01] ${
            enviando 
              ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-black'
          }`}
        >
          {enviando ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </form>
    </div>
  )
}