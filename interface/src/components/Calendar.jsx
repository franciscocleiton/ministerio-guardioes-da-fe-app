import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // <-- Importando o Supabase

export default function Calendar() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os eventos reais do Supabase assim que o componente é montado
  useEffect(() => {
    const buscarEventos = async () => {
      try {
        // 1. Pegamos a data de hoje no formato YYYY-MM-DD (horário local)
        const hoje = new Date().toLocaleDateString('en-CA');
        // 2. Adicionamos o filtro .gte (Greater Than or Equal)
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .gte('data', hoje) // <-- TRADUÇÃO: "data maior ou igual a hoje"
          .order('data', { ascending: true });

        if (error) throw error;
        if (data) setEventos(data);
        
      } catch (error) {
        console.error("Erro ao buscar a agenda:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarEventos();
  }, []);
  
  // Função para formatar a data (Ex: "10 de Maio, Domingo")
  const formatarData = (dataString) => {
    const data = new Date(dataString + 'T00:00:00'); // Força fuso horário local
    const dia = data.toLocaleDateString('pt-BR', { day: '2-digit' });
    const mes = data.toLocaleDateString('pt-BR', { month: 'long' });
    const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
    
    return {
      dia,
      mes: mes.charAt(0).toUpperCase() + mes.slice(1),
      diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)
    };
  };

  return (
    <div className="bg-neutral-900/80 border border-amber-900/30 p-4 sm:p-6 rounded-lg shadow-2xl h-full flex flex-col">
      <h2 className="text-2xl font-serif font-bold mb-2 text-amber-400">Nossa Agenda</h2>
      <p className="text-neutral-400 mb-8">
        Acompanhe nossas próximas ministrações e eventos paroquiais.
      </p>
      
      {carregando ? (
        <div className="text-center py-10 text-amber-500 animate-pulse">
          Carregando agenda sagrada...
        </div>
      ) : (
        <div className="flex-col space-y-4">
          {eventos.map((evento) => {
            const dataFormatada = formatarData(evento.data);
            
            return (
              <div 
                key={evento.id} 
                className="bg-black border border-neutral-800 hover:border-amber-900/50 rounded-lg p-4 transition-all group flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                {/* Bloco de Data (Destaque Visual) */}
                <div className="flex-shrink-0 bg-neutral-900 border border-amber-900/40 rounded-md w-24 h-24 flex flex-col justify-center items-center text-center shadow-inner">
                  <span className="text-amber-500 font-serif text-sm uppercase tracking-wider">{dataFormatada.mes.substring(0, 3)}</span>
                  <span className="text-3xl font-bold text-neutral-100 leading-none my-1">{dataFormatada.dia}</span>
                  <span className="text-neutral-500 text-xs">{dataFormatada.diaSemana.split('-')[0]}</span>
                </div>

                {/* Informações do Evento */}
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-amber-300 font-serif">{evento.tipo}</h3>
                    {evento.status === 'interno' && (
                      <span className="text-[10px] uppercase tracking-wider bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700">Interno</span>
                    )}
                  </div>
                  
                  <div className="text-sm text-neutral-300 space-y-1 mb-2">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {evento.hora.substring(0, 5)}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {evento.local}
                    </p>
                  </div>

                  {evento.detalhes && (
                    <div className="text-sm mt-2 border-t border-neutral-800 pt-2">
                      {evento.detalhes.startsWith('http') ? (
                        <a 
                          href={evento.detalhes} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-amber-500 hover:text-amber-400 underline flex items-center gap-1 w-max"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          Acessar Repertório / Drive
                        </a>
                      ) : (
                        <p className="text-neutral-500 italic">{evento.detalhes}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!carregando && eventos.length === 0 && (
        <div className="text-center py-10 text-neutral-500 italic border border-dashed border-neutral-800 rounded-lg">
          Nenhum evento programado no momento.
        </div>
      )}
    </div>
  )
}