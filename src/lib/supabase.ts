import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Função para criar um cliente mock seguro contra quebra de encadeamento
const createMockClient = () => {
  const mockBuilder: any = {
    then: (onfulfilled: any) => {
      onfulfilled({ data: [], error: null });
      return Promise.resolve({ data: [], error: null });
    },
  };

  const proxy: any = new Proxy(mockBuilder, {
    get(target, prop) {
      if (prop === 'then') {
        return target.then;
      }
      return () => proxy;
    }
  });

  return proxy;
};

let supabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Erro ao inicializar o cliente do Supabase:", error);
    supabaseClient = createMockClient();
  }
} else {
  console.warn("Variáveis do Supabase não encontradas. Utilizando cliente simulado.");
  supabaseClient = createMockClient();
}

export const supabase = supabaseClient;
