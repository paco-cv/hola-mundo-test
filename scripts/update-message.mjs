// Uso: node scripts/update-message.mjs "nuevo texto"
// Solo local. Usa la secreta de .env (SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY).
// Nunca exponer al frontend ni subir a Git/Netlify.
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const text = process.argv[2]
if (!text) {
  console.error('Falta texto: node scripts/update-message.mjs "texto"')
  process.exit(1)
}

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)

const url = env.VITE_SUPABASE_URL
const secret = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !secret) {
  console.error('Faltan VITE_SUPABASE_URL o SUPABASE_SECRET_KEY en .env local')
  process.exit(1)
}

const sb = createClient(url, secret)
const { error } = await sb.from('messages').update({ message: text }).eq('id', 1)
if (error) {
  console.error('ERROR: ' + error.message)
  process.exit(1)
}
console.log('OK actualizado a: ' + text)
