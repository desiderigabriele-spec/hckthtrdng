# HACK_THE_TRADING — PLATFORM SUPERPROMPT v2

## Per Claude Code

Copia tutto questo e incollalo come primo messaggio in Claude Code.

-----

## COSA STIAMO COSTRUENDO

Una piattaforma web per **HACK_THE_TRADING**, una community italiana di trader retail con estetica hacker/terminale.

Principio guida fondamentale, da rispettare in OGNI scelta:
**Deve essere spettacolare da vedere ma semplicissima da usare.**

L’estetica è hacker/terminale dark e cinematografica, piena di animazioni e dettagli — MA la navigazione deve essere immediata, intuitiva, zero attrito. Un utente non tecnico deve capire tutto al primo sguardo. La complessità è solo estetica, mai funzionale.

-----

## LE 5 FUNZIONI DELLA PIATTAFORMA

1. **Accesso verificato** — solo chi ha aperto conto AvaTrade tramite link affiliato HTT
1. **Chat community** moderata da AI (blocca contatti privati, spam, dati personali)
1. **Sfide tra trader** su conto DEMO (1v1 e tornei)
1. **Classifica** dei migliori trader (dati verificati)
1. **Segnali** condivisi dalla community

-----

## IL MODELLO (IMPORTANTE PER CAPIRE IL FLUSSO)

Le sfide si giocano su **conto DEMO** (nessun rischio, nessun problema legale).

MA per partecipare, l’utente deve prima aprire un conto reale + demo su AvaTrade tramite il link affiliato HTT. I dati del conto demo arrivano da AvaTrade (via API/MT5), quindi le performance in classifica sono verificate, non auto-dichiarate.

Flusso utente:

```
Registrazione → apre conto AvaTrade (link HTT)
→ conto demo collegato → fa sfide demo
→ sale in classifica → eventualmente passa al reale
```

-----

## STACK TECNICO

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Animazioni**: Framer Motion (motion/react)
- **Backend/DB**: Supabase (PostgreSQL + Auth + Realtime)
- **Chat realtime**: Supabase Realtime
- **Moderazione AI**: Anthropic Claude API (via Edge Function)
- **Dati trading**: AvaTrade API o MT5 bridge (per performance conto demo)
- **Deploy**: Netlify

Inizializza da zero. Struttura pulita e modulare.

-----

## DESIGN SYSTEM HTT (OBBLIGATORIO)

### Palette

```css
:root {
  --bg-primary: #0D0D0D;
  --bg-secondary: #1A1A1A;
  --bg-highlight: #0F2010;
  --terminal-green: #00FF41;
  --amber: #FFB800;
  --red: #FF0033;
  --text-primary: #E5E5E5;
  --text-dim: #888888;
  --border: #2A2A2A;
}
```

### Font

- **Display/titoli grandi**: Bebas Neue o Anton (importa da Google Fonts)
- **Body/testo**: Inter
- **Terminale/numeri/codice**: JetBrains Mono (OBBLIGATORIO per dati, prezzi, classifiche, elementi terminale)

### Direzione estetica

Terminale hacker cinematografico. Pensa a: schermo di un hacker in un film, ma curato e premium. Non un’app generica con tema scuro — un vero terminale vivo.

Elementi visivi richiesti:

- Sfondo nero profondo con sottile texture/noise overlay
- Effetto “matrix rain” leggero e discreto in background (NON invasivo, opacità bassa, non deve disturbare la lettura)
- Bordi sottili verdi `1px solid` sugli elementi attivi
- Glow verde sui CTA principali e sugli stati attivi
- Testo che “digita” (typewriter effect) sui titoli chiave al caricamento
- Cursore a blocco lampeggiante `▮` negli elementi terminale
- Scanline sottile opzionale come overlay

### Animazioni (Framer Motion)

Concentrati su momenti ad alto impatto, non su micro-animazioni sparse:

- **Page load**: rivelazione a cascata (stagger) degli elementi con delay progressivi
- **Transizioni di pagina**: fade + leggero slide, veloci (200-300ms)
- **Hover sui CTA**: glow che si intensifica + leggero scale
- **Classifica**: le righe entrano in sequenza dall’alto
- **Numeri/punteggi**: count-up animato quando appaiono
- **Nuovo messaggio chat**: slide-in fluido
- **Vittoria sfida**: animazione celebrativa in stile terminale (testo verde che scorre “WINNER DETECTED”)

Le animazioni devono essere fluide e veloci. Mai far aspettare l’utente. Se un’animazione rallenta l’uso, accorciala.

### Regola UX non negoziabile

Ogni schermata deve avere UN’azione principale chiara. Niente menu labirintici. Bottoni grandi e ovvi. Icone con etichette testuali. L’utente non deve mai chiedersi “e adesso cosa faccio?”. L’estetica è hacker, ma il flusso è da app consumer premium.

-----

## NAVIGAZIONE PRINCIPALE

Bottom navigation mobile-first (la maggior parte degli utenti è su telefono), con 5 sezioni chiare e icone + etichette:

```
[ CHAT ]  [ SFIDE ]  [ CLASSIFICA ]  [ SEGNALI ]  [ PROFILO ]
```

Su desktop: sidebar laterale verticale con le stesse 5 voci.

-----

## SCHEMA DATABASE SUPABASE

### users

```
id                  uuid (PK, da auth.users)
email               text
username            text (unique)
telegram_id         text
avatrade_account_id text   -- ID conto AvaTrade
avatrade_verified   boolean default false
demo_account_id     text   -- ID conto demo collegato
ruolo               text default 'viewer'  -- admin/trader/viewer
avatar_url          text
created_at          timestamp default now()
```

### rooms

```
id, nome, tipo (chat/segnali), accesso, created_at
```

### messages

```
id, user_id, room_id, content,
moderazione_status (ok/blocked), moderazione_reason,
created_at
```

### signals

```
id, user_id, asset, direzione (BUY/SELL),
entry_min, entry_max, tp1, tp2, tp3, tp4, sl,
timeframe, status (open/win/loss/cancelled),
pips_result, created_at, closed_at
```

### challenges

```
id              uuid (PK)
tipo            text   -- '1v1' / 'torneo'
challenger_id   uuid (FK users)
opponent_id     uuid (FK users, nullable per tornei)
asset           text
durata_ore      integer
stato           text default 'pending'  -- pending/active/completed
challenger_pips numeric default 0
opponent_pips   numeric default 0
winner_id       uuid (nullable)
inizio          timestamp
fine            timestamp
created_at      timestamp
```

### tournament_participants

```
id, challenge_id (FK), user_id (FK),
pips_totali numeric, posizione integer
```

### leaderboard

```
id, user_id, sfide_totali, vittorie, sconfitte,
win_rate, pips_totali, streak_attuale, rank,
periodo (weekly/monthly/alltime), updated_at
```

Imposta **Row Level Security**:

- Solo utenti con `avatrade_verified = true` accedono a chat, sfide, segnali
- Solo admin modifica `avatrade_verified`

-----

## MODULO 1 — ONBOARDING + ACCESSO

L’onboarding deve essere bellissimo e guidato passo-passo. È la prima impressione.

Flusso:

1. **Schermata di benvenuto** — animazione terminale che “si avvia” (boot sequence stile HTT: “> connessione neurale: OK / > sistema online”)
1. **Registrazione** — email + username (Supabase Auth)
1. **Step AvaTrade** — schermata che spiega in modo semplice: “Per accedere alle sfide apri il tuo conto AvaTrade gratuito”. Bottone grande con il link affiliato. Spiega che il deposito (250€) resta sul suo conto, è suo.
1. **Inserimento dati** — l’utente inserisce il suo username/ID AvaTrade
1. **Schermata “in verifica”** — animazione di attesa elegante (terminale che “scansiona”). Messaggio chiaro: “Il team sta verificando il tuo accesso. Riceverai conferma a breve.”
1. **Pannello admin** — schermata separata dove l’admin vede gli utenti in attesa e clicca “Verifica” → sblocca l’accesso

Dopo la verifica → animazione “ACCESS GRANTED” e ingresso alla piattaforma.

-----

## MODULO 2 — CHAT + MODERAZIONE AI

Chat di gruppo realtime (Supabase Realtime), interfaccia pulita stile terminale ma leggibilissima.

**Moderazione (CRITICO):** prima che ogni messaggio venga pubblicato, passa dalla Claude API via Edge Function.

System prompt moderazione:

```
Sei il moderatore di una community di trading.
Rispondi SOLO con JSON: {"status":"ok"} oppure {"status":"blocked","reason":"..."}

BLOCCA se il messaggio contiene:
- Numeri di telefono (qualsiasi forma, anche a parole)
- Username di social o Telegram
- Tentativi di spostare la conversazione in privato
- Nomi e cognomi per farsi identificare fuori dalla piattaforma
- Link esterni
- Promozione di altri broker/servizi/corsi
- Spam o messaggi ripetitivi

NON bloccare: discussioni normali di trading, analisi, domande sulla community.
Rispondi solo con il JSON.
```

UX: mentre il messaggio viene verificato, mostra un sottile indicatore (”> verifica…”). Se bloccato, l’utente vede un messaggio gentile ma chiaro sul perché. Veloce, <500ms percepiti.

-----

## MODULO 3 — SFIDE (IL CUORE DELLA PIATTAFORMA)

Deve essere divertente, chiaro, gamificato. Le sfide sono su conto DEMO.

### Tipi di sfida

- **1v1**: un trader sfida un altro su un asset per una durata (es. 24h). Chi fa più pips vince.
- **Torneo**: più trader competono sullo stesso asset/periodo. Classifica finale.

### Flusso sfida 1v1 (semplicissimo)

1. Schermata “SFIDE” con bottone grande **”+ NUOVA SFIDA”**
1. Selezioni: avversario (o “aperta a tutti”), asset, durata
1. L’avversario riceve la sfida e accetta con un tap
1. Countdown animato all’inizio
1. Durante la sfida: schermata live con i pips di entrambi che si aggiornano in tempo reale (dati da AvaTrade demo), barra di confronto visiva
1. Alla fine: animazione vincitore stile terminale + aggiornamento classifica

### Dati

I pips e i risultati arrivano dai conti demo AvaTrade (via API o MT5 bridge). NON auto-dichiarati. Predisponi l’integrazione con un layer astratto così è facile collegare l’API quando disponibile (per ora usa dati mock realistici per sviluppare l’interfaccia).

UX: la schermata sfida live deve essere emozionante — due colonne, i due trader, i pips che salgono con count-up, glow sul leader attuale. Come una gara.

-----

## MODULO 4 — CLASSIFICA

Pagina classifica spettacolare ma chiara.

- Top 3 in evidenza (podio stile terminale, con glow)
- Lista completa sotto, righe che entrano in stagger
- Per ogni trader: username, avatar, win rate, pips totali, streak, badge
- Ordinabile: win rate / pips / vittorie / streak
- Filtri temporali: settimanale / mensile / all time
- Badge automatici: TOP_TRADER, RISING_STAR, STREAK_MASTER, etc.
- Il tuo posto in classifica sempre evidenziato (riga con bordo verde)

I numeri usano JetBrains Mono e fanno count-up all’apparire.

-----

## MODULO 5 — SEGNALI

I trader verificati condividono segnali tramite form strutturato.

Formato visivo (card stile terminale):

```
📡 SIGNAL_DECODE — [ASSET]
📈 DIREZIONE : [BUY/SELL]
⏱ TIMEFRAME  : [TF]
🎯 ENTRY      : [min] — [max]
✅ TP1 / TP2 / TP3
❌ SL
```

Ogni segnale mostra chi l’ha pubblicato (link al profilo + posizione in classifica), così i segnali dei top trader hanno più peso. Stato del segnale aggiornato (open/win/loss) con tracking prezzi.

-----

## VARIABILI D’AMBIENTE

File `.env` con placeholder (MAI chiavi reali nel codice, MAI chiavi nel frontend):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
AVATRADE_API_KEY=
```

Claude API e dati trading passano SEMPRE da Supabase Edge Functions (server-side).

-----

## ORDINE DI COSTRUZIONE

Costruisci e mostrami ogni fase prima di proseguire:

1. **Setup + Design System + componenti base** (palette, font, animazioni base, matrix rain, navigazione). Mostrami una schermata demo del look prima di andare avanti.
1. **Modulo 1** — Onboarding + accesso + pannello admin
1. **Modulo 2** — Chat + moderazione AI
1. **Modulo 3** — Sfide (con dati mock realistici)
1. **Modulo 4** — Classifica
1. **Modulo 5** — Segnali
1. Rifinitura animazioni + test mobile

Parti dal punto 1. Voglio vedere il design system e una schermata d’esempio prima di tutto il resto.

-----

## PRINCIPI DA NON DIMENTICARE MAI

- **Bello E semplice**: estetica hacker spettacolare, uso da bambino. Mai sacrificare la chiarezza per l’effetto.
- **Mobile-first**: la maggior parte è su telefono. Tutto deve funzionare e essere bello sul piccolo schermo.
- **Animazioni fluide e veloci**: mai far aspettare. Framer Motion ben orchestrato.
- **Niente localStorage** per dati sensibili.
- **Gestione errori** su ogni chiamata API, con messaggi in stile HTT (”> errore di connessione. riprova.”).
- **Codice pulito**, modulare, commentato in italiano.
- L’estetica terminale HTT è l’anima del prodotto: ogni schermata deve sembrare un terminale hacker premium e vivo, mai un’app generica.

> decode the market.