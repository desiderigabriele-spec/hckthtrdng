# HTT — SUPERPROMPT FASE FINALE

## Tutto il resto dopo Step 04/05 — decisioni finali

## Da incollare in Claude Code

-----

## CONTESTO — cosa è già costruito

La piattaforma HACK_THE_TRADING ha già:

- Step 01: design system + sfida live (estetica terminale HTT)
- Step 02: onboarding + verifica AvaTrade + pannello admin
- Step 03: flusso sfide (hub, creazione 1v1, risultato)
- Step 04/05: classifica + segnali + profilo trader
- Pagine Chi Siamo + Come Funziona + percorso conto finanziato

Questo superprompt aggiunge tutto il resto e applica le decisioni finali. Mantieni l’estetica HTT già approvata (palette #0D0D0D/#00FF41/#FFB800/#FF0033, font Bebas/Anton + Inter + JetBrains Mono, terminale hacker premium). Mobile-first. Codice pulito e modulare, commentato in italiano.

-----

## PRINCIPI ARCHITETTURALI (validi per tutto — NON violare)

```
1. HTT MOSTRA, NON ESEGUE
   Il trader trada sul suo conto MetaTrader/AvaTrade.
   HTT legge i risultati in SOLA LETTURA (investor
   password / aggregatore) e li mostra. HTT non esegue
   mai trade, non tocca soldi di trading.

2. SOLO DATI DEGLI AFFILIATI CONTANO PER IL PAYOUT
   Il watch-time e l'engagement che generano payout ai
   trader si contano SOLO da utenti affiliati (conto
   broker reale aperto col link HTT). Pilastro anti-frode.

3. LAYER DATI ASTRATTO
   Tutta l'ingestione dati trading passa da un modulo
   astratto (fetchTick, fetchLeaderboard, fetchSignals,
   fetchWatchtime). Ora usa dati MOCK realistici.
   Sostituire i mock con MT5/aggregatore reale deve
   essere una sola funzione da cambiare.

4. PRONTO PER MULTILINGUA (i18n)
   Struttura i testi per supportare più lingue.
   Parti in italiano, ma predisponi l'inglese.

5. COMPLIANCE: "GUARDA LA GARA", NON "SEGNALI DA COPIARE"
   Tutto il live è spettacolo/apprendimento/competizione.
   Mai presentarlo come servizio di segnali da copiare.
   Disclaimer educativo ovunque si parli di trading.
```

-----

## MODULO A — LIVE STREAMING (stile Twitch)

Il cuore dello spettacolo. Quando un trader è in sfida live:

```
LAYOUT DESKTOP:
- Centro: lo schermo principale (la sfida / le operazioni
  che scorrono, i pips live, la classifica della sfida)
- Sinistra: riquadro quadrato VIDEO del trader (webcam)
- Destra: riquadro quadrato CHAT spettatori

LAYOUT MOBILE:
- Schermo principale in alto (sfida/operazioni)
- Video trader e chat impilati/accessibili sotto
```

Funzioni:

- Webcam del trader (placeholder video ora) con nome, badge, posizione in classifica
- Chat spettatori in tempo reale (Supabase Realtime) con la moderazione AI già esistente
- Schermo centrale: operazioni live (dal feed sola lettura), pips che salgono con count-up, tempo rimasto, etichetta “VERIFICATO AVATRADE”
- Reazioni/tifo degli spettatori (emoji, “supporta”)
- Sfondo: la market rain animata (vedi Modulo I) a bassa opacità

Tono: è una diretta sportiva/eSport, non un servizio di segnali.

-----

## MODULO B — ACCESSO A LIVELLI + GATING

```
LIVELLO PUBBLICO (senza registrazione)
✅ Sfoglia la classifica, cerca trader per nome/username
✅ Vede profili verificati e statistiche
✅ Vede le operazioni CHIUSE (a risultato, in RITARDO)
✅ Vede CHE c'è una sfida live in corso
❌ NON vede le operazioni live in tempo reale
❌ NON può seguire un trader dal vivo
❌ NON può competere

LIVELLO AFFILIATO (conto aperto col link HTT)
✅ Vede le operazioni LIVE in tempo reale
✅ Segue il suo trader di riferimento dal vivo
✅ Accede a TUTTE le live (non solo a quello con cui
   si è affiliato) ← DECISIONE CHIAVE: l'accesso live
   è generale, non legato al singolo trader
✅ Chat, competizione, classifica
```

Il gating: le funzioni di valore (compete, segui live, sali in classifica, premi) richiedono di aver aperto un conto broker tramite il link affiliato HTT. Il pubblico è la vetrina; l’affiliazione è la cassa.

Per il pubblico: mostra chiaramente “Affiliati per vedere le live in tempo reale” con CTA.

-----

## MODULO C — CLASSIFICHE MULTIPLE (niche, non winner-take-all)

NON una sola classifica mondiale. Tante classifiche, così ogni trader può essere #1 di qualcosa:

```
CLASSIFICHE PER:
- Lingua          (es. #1 trader in italiano)
- Paese
- Asset           (#1 su oro, #1 su BTC, ecc.)
- Stile           (#1 scalper, #1 swing)
- Timeframe       (#1 daily, #1 intraday)
- RISING STAR     (#1 dei nuovi della settimana)
- MOST IMPROVED   (chi è salito di più)
- Periodo         (settimanale / mensile / all time)
- GLOBALE         (la classifica mondiale)
```

Filtri e ricerca per navigare tra le classifiche. Ogni trader assegnato automaticamente alle categorie pertinenti (lingua, asset principale, stile, ecc.). Discovery: sezione “RISING STAR” in evidenza nella home, badge “early supporter” per chi segue un trader prima che sfondi.

-----

## MODULO D — METRICHE CLASSIFICA (consistenza, non guadagno bruto)

DECISIONE CHIAVE: classifica per CONSISTENZA, non per rendimento grezzo (altrimenti premi i gambler, contro il brand anti-guru).

Metriche da mostrare e usare nel ranking:

```
- Win rate %
- Max drawdown (più è basso, meglio è) ← peso alto
- Profit factor / risk-reward
- Sharpe ratio (rendimento per unità di rischio)
- Streak attuale
- Durata track record (consistenza nel tempo)
- Equity curve (grafico: premia curve lisce in salita)
- Rendimento % (mostrato, ma NON il criterio principale)
```

Lo score di ranking combina queste metriche con peso sulla consistenza e penalità sul rischio eccessivo. Tutti i numeri in JetBrains Mono con count-up. Dati VERIFICATI (sola lettura), mai auto-dichiarati — etichetta “VERIFICATO”.

-----

## MODULO E — SFIDA SOLITARIA A OBIETTIVO

Nuova modalità oltre 1v1 e torneo:

```
"Raggiungi X pips / X% in Y tempo"
- Il trader si pone un obiettivo pubblico
- Ci prova dal vivo, gli spettatori guardano
- Barra di progresso verso l'obiettivo
- Esito pubblico: obiettivo raggiunto / mancato
```

Stesso sistema di sfida live, ma contro un obiettivo invece che contro un avversario.

-----

## MODULO F — MODELLO PAYOUT CREATOR (calcolo + display)

NB: qui costruisci il CALCOLO e il DISPLAY del payout con dati mock. Il movimento reale di denaro (Stripe/bonifici) è backend/fase 2.

```
HUB: HTT incassa CPA + RevShare dal broker (mock ora)
        ↓
POOL CREATOR = % del NETTO (non del lordo!) — parametro
configurabile (default 25% netto)
        ↓
diviso in:
- POOL ÉLITE (top 10) — distribuzione DECRESCENTE:
  #1=20% / #2=16% / #3=13% / #4-5=10% / #6-7=8% / #8-10=5%
  + BADGE "TOP 10" sul profilo (status)
- POOL BASE (#11+) — per watch-time/engagement di nicchia

SCORE TRADER (per il pool) =
  watch-time(SOLO affiliati, con cap per viewer)
  × engagement reale (chat, follow, focus)
  × moltiplicatore QUALITÀ (consistenza, drawdown basso)
```

Anti-frode (implementa le regole nel calcolo):

```
- Conta solo watch-time di utenti AFFILIATI
- CAP per viewer (max ore/giorno verso un trader)
- Escludi/pesa meno l'auto-rete del trader
- Richiedi engagement attivo (non live solo "aperta")
- Gate qualità: trade spericolati non premiati
- Flag anomalie per revisione
```

Mostra al trader una dashboard del suo payout stimato e della sua posizione verso il pool élite (“ti mancano X posizioni al TOP 10”).

-----

## MODULO G — SUB-AFFILIATI (i trader come distributori)

```
Tu (HTT, master IB)
  └─ Trader (sub-IB) → guadagna sui follower che porta
       └─ Follower che apre conto col link del trader

- Quando un utente sceglie un "trader di riferimento" e
  si affilia, si registra sotto quel trader (sub-IB)
- Il trader guadagna la commissione sub-IB
- HTT guadagna l'override
- Mostra al trader i suoi referral e i guadagni relativi
```

-----

## MODULO H — CARD CONDIVISIBILI (motore di crescita virale)

Genera automaticamente card personalizzate che il trader condivide sui social:

```
TIPI DI CARD (formato stories 9:16 + post 1:1):
- "Sto partecipando al World Challenge"
- "Sono entrato nella TOP 10"
- "Ho vinto la sfida"
- "Salgo in classifica: #X in [categoria]"
- Traguardi follower

OGNI CARD CONTIENE:
- Nome / @username del trader
- Posizione in classifica + badge
- Statistiche chiave
- Estetica HTT (terminale, market rain, logo)
- LINK REFERRAL del trader (QR + URL) ← chiave: chi si
  iscrive dalla card diventa suo sub-IB

UX: un tap → card generata → bottone "condividi nelle
storie". Zero attrito. Deve far sembrare figo il trader
(status) così la condivide.
```

Compliance: le card dicono “sto partecipando / seguimi”, MAI “iscriviti e guadagni” o promesse di rendimento.

-----

## MODULO I — SFONDO MARKET RAIN + LOGO

```
- Integra come sfondo animato del brand l'effetto
  "market rain" (numeri singoli che cadono, colore per
  numero: verde positivo/cifre alte, rosso negativo col
  meno, ~70% verde, teste brillanti, movimento dal - al +)
  → uso un canvas a bassa opacità (~7-10%) dietro i
    contenuti, mai disturbare la lettura
  → l'ho già realizzato come HTML standalone, replica
    quella logica come componente
- Logo: finestra terminale con "HTT" verde + grafico a
  candele + cursore ">" (già scelto)
```

-----

## COMPLIANCE — regole trasversali (sempre)

```
✅ Disclaimer educativo ovunque si parli di trading
✅ Live = "guarda la gara/competizione", non "segnali"
✅ Niente promesse di guadagno, niente "diventa ricco"
✅ Dati verificati (sola lettura), mai auto-dichiarati
✅ HTT non esegue trade, non gestisce fondi di trading
✅ Se in futuro si aggiunge il copy trading, passa SOLO
   dal programma regolamentato del broker (es. DupliTrade)
```

-----

## FASE 2 — PREDISPONI MA NON COSTRUIRE ORA

Lascia i punti d’innesto pronti, ma NON costruire ora:

```
- Pagamenti (Stripe): tip/donazioni + abbonamenti viewer
- Corsi AI / "cervello digitale" del trader
- Copy trading via broker regolamentato
- Movimento reale del denaro del payout
```

Questi entrano quando la piattaforma base è validata. Predisponi solo l’architettura (placeholder), non l’implementazione.

-----

## ORDINE DI COSTRUZIONE (MVP prima)

```
MVP (necessario per il lancio):
1. Modulo I (market rain + logo) — il look
2. Modulo B (accesso a livelli + gating)
3. Modulo A (live streaming layer)
4. Modulo C (classifiche multiple)
5. Modulo D (metriche consistenza)
6. Modulo E (sfida a obiettivo)
7. Modulo H (card condivisibili) ← motore di crescita

DOPO L'MVP:
8. Modulo F (payout creator — calcolo/display con mock)
9. Modulo G (sub-affiliati — display)

FASE 2 (predisporre, non costruire):
pagamenti, corsi, copy trading
```

Costruisci nell’ordine. Mostrami ogni modulo finito prima di passare al successivo.

-----

## COSA MOSTRARMI PER PRIMO

Parti dal Modulo I + B + A (look + gating + live), perché sono il cuore visibile. Mostrami:

1. La market rain integrata come sfondo
1. Una schermata pubblica (vista in ritardo) vs affiliata (vista live)
1. Il layout live streaming (centro + video + chat)

> decode the market.