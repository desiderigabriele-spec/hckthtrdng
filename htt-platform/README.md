# Team Zero Errori

Landing page di vendita e area riservata per i membri del corso.

- `/` landing pubblica
- `/accedi` login (solo credenziali create dal team, nessuna registrazione pubblica)
- `/area` area riservata con lezioni e strumenti

## Sviluppo

```bash
npm install
npm run dev
```

Serve un file `.env` con `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## Dove modificare i contenuti

- `src/config.ts` link chat, TikTok, backtest
- `src/data/corso.ts` moduli, lezioni (URL video) e risorse dell'area riservata
- `src/sections/` testi della landing

## Aggiungere un membro

Supabase → Authentication → Users → **Add user**: inserire email e password e spuntare
"Auto Confirm User", poi inviare le credenziali al cliente.
