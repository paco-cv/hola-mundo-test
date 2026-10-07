import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
// Moderna sb_publishable con fallback a la legacy anon para no romper Netlify
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
  ?? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)

export default function App() {
  const [msg, setMsg] = useState('cargando...')
  const [err, setErr] = useState('')

  useEffect(() => {
    async function load() {
      if (!url || !key) {
        setMsg('Faltan VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY en .env')
        return
      }
      try {
        const supabase = createClient(url, key)
        const { data, error } = await supabase.from('messages').select('message').limit(1).single()
        if (error) throw error
        setMsg(data?.message ?? '(tabla vacía)')
      } catch (e: any) {
        setMsg('Error conectando a Supabase')
        setErr(e?.message ?? String(e))
      }
    }
    load()
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '4rem auto', textAlign: 'center' }}>
      <h1>HOLA MUNDO V2</h1>
      <p>Prueba GitHub → Netlify → Supabase (React)</p>
      <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{msg}</p>
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
    </main>
  )
}
