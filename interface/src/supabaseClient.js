import { createClient } from '@supabase/supabase-js'

// Você pega esses dados acessando o painel do seu projeto no Supabase -> Project Settings -> API
const supabaseUrl = 'https://ywrknrwzzpqpvwaugyee.supabase.co'
const supabaseKey = 'sb_publishable_ywWPXKAcn6uj4BjQIDIo3A_L1BsYmmY'

export const supabase = createClient(supabaseUrl, supabaseKey)