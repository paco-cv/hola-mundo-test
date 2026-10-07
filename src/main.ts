import './style.css'
import { createClient } from '@supabase/supabase-js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main style="font-family: system-ui; max-width: 640px; margin: 4rem auto; text-align: center;">
    <h1>HOLA MUNDO V2</h1>
    <p>Prueba GitHub → Netlify → Supabase</p>
    <p id="msg" style="font-size: 1.4rem; font-weight: bold;">cargando...</p>
    <p id="err" style="color: crimson;"></p>
  </main>
`

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const msgEl = document.querySelector('#msg')!
const errEl = document.querySelector('#err')!

async function load() {
  if (!url || !anon) {
    msgEl.textContent = 'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en .env'
    return
  }
  try {
    const supabase = createClient(url, anon)
    const { data, error } = await supabase.from('messages').select('message').limit(1).single()
    if (error) throw error
    msgEl.textContent = data?.message ?? '(tabla vacía)'
  } catch (e: any) {
    msgEl.textContent = 'Error conectando a Supabase'
    errEl.textContent = e?.message ?? String(e)
  }
}

load()
