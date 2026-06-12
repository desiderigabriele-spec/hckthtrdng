# HTT — STEP 04/05
## Classifica + Segnali
## Da incollare in Claude Code

---

Costruiamo gli ultimi due moduli core: **Classifica** e **Segnali**. Stessa estetica HTT già approvata negli step precedenti, mobile-first, dati mock realistici con layer astratto per collegare l'API dopo.

(Nota: assicurati di lavorare sul file giusto della piattaforma — quello che contiene chat/sfide/classifica/segnali, non quello dell'onboarding.)

---

## MODULO 04 — CLASSIFICA

La pagina che premia i migliori trader. Deve essere spettacolare ma leggibilissima.

### Struttura

**Top 3 — podio in evidenza**
I primi tre trader mostrati come podio stile terminale:
- 1° posto al centro, più grande, con glow verde intenso e badge TOP_TRADER
- 2° e 3° ai lati, leggermente più piccoli
- Per ognuno: avatar (con lo stesso stile glitch/scanline degli avatar sfida), username, pips totali (count-up animato all'apparire), win rate
- Effetto "corona" o marcatore visivo sul 1° (in stile HTT, niente emoji kitsch — qualcosa tipo `[ #01 ]` con glow)

**Lista completa sotto**
Righe che entrano in stagger dall'alto. Ogni riga:
- Posizione (#04, #05, ...) in JetBrains Mono
- Avatar + username
- Win rate, pips totali, streak
- Eventuale badge (RISING_STAR, STREAK_MASTER, etc.)
- Mini-indicatore di movimento posizione (▲2 verde / ▼1 rosso / = grigio)

**La TUA riga sempre evidenziata**
Ovunque sia l'utente in classifica, la sua riga ha bordo verde e resta visibile/sticky così si trova sempre. Se è fuori dalla top visibile, mostrala comunque ancorata in basso ("> tu: #47").

### Controlli

- **Ordinamento**: win rate / pips totali / vittorie / streak (toggle a bottoni stile terminale)
- **Filtro temporale**: settimanale / mensile / all time
- I numeri usano JetBrains Mono e fanno count-up quando la vista cambia

### Badge automatici (definiscili)
- `TOP_TRADER` — #1 attuale
- `RISING_STAR` — miglior scalata posizioni nel periodo
- `STREAK_MASTER` — streak di vittorie più lunga
- `SHARP` — win rate più alto (con minimo di sfide per evitare fluke)
- `VERIFIED` — conto AvaTrade verificato (tutti gli attivi, ma mostralo come marchio di legittimità)

---

## MODULO 05 — SEGNALI

Dove i trader verificati condividono analisi/segnali. Card stile terminale, coerenti col formato SIGNAL_DECODE già definito.

### Feed segnali

Lista di card segnale, le più recenti in alto. Ogni card:
```
📡 SIGNAL_DECODE — [ASSET]
📈 DIREZIONE : [BUY/SELL]
⏱ TIMEFRAME  : [TF]
🎯 ENTRY      : [min] — [max]
✅ TP1 / TP2 / TP3 / TP4
❌ SL
```
Più, in testa o piede card:
- **Autore**: avatar + username + posizione in classifica (es. "NEON_WOLF · #02"). I segnali dei top trader hanno più peso visivo (sottile bordo/glow più marcato per chi è in top 5).
- **Stato del segnale**: OPEN (ambra) / WIN (verde) / LOSS (rosso) / CANCELLED (grigio), aggiornato dal tracking prezzi
- **Timestamp** relativo ("2h fa")
- Se WIN/LOSS: i pips risultanti

### Filtri
- Per stato: tutti / open / chiusi
- Per asset
- "Solo top trader" (mostra solo segnali di chi è in top 10) — feature che valorizza la classifica

### Creazione segnale (per utenti verificati)
Bottone "+ NUOVO SEGNALE" → form strutturato:
- Asset (select)
- Direzione (BUY/SELL toggle)
- Timeframe (select)
- Entry min / max
- TP1, TP2, TP3, TP4 (TP4 può essere "OPEN")
- SL
- Anteprima live della card mentre compili
- Bottone "PUBBLICA SEGNALE" con animazione trasmissione ("> segnale trasmesso...")

Validazione sensata (es. per un BUY i TP sopra l'entry, SL sotto — avvisa se l'utente inserisce valori incoerenti, ma non bloccare in modo rigido).

### Dettaglio segnale
Tap su una card → vista dettaglio con:
- Il segnale completo
- Profilo sintetico dell'autore (link alla sua posizione in classifica, win rate sui segnali)
- Storico stato (quando aperto, quando ha toccato TP/SL)
- NIENTE sezione commenti per ora (eviti la moderazione qui; le discussioni stanno in chat)

---

## COLLEGAMENTO TRA MODULI (importante per il prodotto)

I moduli devono parlarsi — è ciò che rende HTT un sistema, non schermate isolate:
- Username in classifica → tap → profilo del trader (sfide vinte, segnali pubblicati, win rate)
- Autore di un segnale → mostra la sua posizione in classifica
- Profilo trader → bottone "SFIDA" che apre il flusso sfida verso di lui
- Vincere sfide e azzeccare segnali → entrambi alimentano la posizione in classifica

Predisponi una struttura dati coerente (un trader ha: stats sfide, stats segnali, posizione, badge) anche se per ora è mock.

---

## DATI (mock realistici)

Estendi il layer dati astratto già usato:
- Una ventina di trader con username stile HTT, stats sfide, stats segnali, posizione, badge, movimento posizione
- Una lista di segnali con autori, asset vari, stati misti (open/win/loss), timestamp realistici
- Strutturato così che collegare i dati reali dopo (AvaTrade per le sfide demo, tracking prezzi per i segnali) sia un solo punto da rimpiazzare

---

## REQUISITI TRASVERSALI

- **Mobile-first**, tutto bello e usabile su telefono
- **Animazioni** Framer Motion fluide e veloci (count-up sui numeri, stagger sulle righe), mai bloccanti
- **Niente localStorage** per lo stato
- **Gestione errori** con messaggi stile HTT
- **Coerenza** con gli step 01/02/03 approvati
- **Disclaimer educativo**: in fondo alla sezione segnali, riga discreta e sempre presente — "contenuto educativo · le decisioni operative sono dell'utente". (Importante per il posizionamento del prodotto.)

---

## COSA MOSTRARMI

Quando hai finito:
1. La classifica completa (podio + lista + la riga utente evidenziata)
2. Il feed segnali con stati misti (open/win/loss)
3. Il form creazione segnale con anteprima live

A questo punto i 5 moduli core sono completi e abbiamo il prototipo full della piattaforma HTT.

> decode the market.
