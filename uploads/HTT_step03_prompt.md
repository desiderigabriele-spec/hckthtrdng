# HTT — STEP 03
## Flusso completo creazione sfida
## Da incollare in Claude Code

---

Step 02 approvato — onboarding, boot sequence e pannello admin sono ottimi, il loop end-to-end funziona. Procediamo allo Step 03.

Costruisci il **flusso completo di creazione e svolgimento di una sfida**, mobile-first, stessa estetica HTT già approvata. Questo è il cuore interattivo del prodotto: deve essere divertente, chiaro, gamificato.

---

## CONTESTO

Le sfide si giocano su **conto DEMO** (dati verificati AvaTrade). Due formati:
- **1v1**: un trader contro un altro
- **Torneo**: più trader sullo stesso asset/periodo

Chi totalizza più pips nel periodo vince. I dati arrivano dal conto demo (per ora dati mock realistici, predisponi un layer astratto per collegare l'API dopo).

---

## SCHERMATA HUB SFIDE

La schermata principale della sezione "SFIDE". Deve dare subito chiarezza su cosa fare.

In alto: bottone grande e ovvio **"+ NUOVA SFIDA"** con glow verde.

Sotto, tre tab/sezioni chiare:
- **ATTIVE** — sfide in corso a cui partecipi (con pips live e tempo rimasto)
- **IN ATTESA** — sfide che hai ricevuto (da accettare) o inviato (in attesa di risposta)
- **STORICO** — sfide concluse con esito (vinta/persa) e pips finali

Ogni sfida è una card stile terminale: avversario, asset, durata, stato, e se attiva i pips correnti di entrambi con mini-barra di confronto.

Se non ci sono sfide: stato vuoto elegante con messaggio HTT ("> nessuna sfida attiva. lancia la prima.") e il bottone nuova sfida.

---

## FLUSSO CREAZIONE SFIDA 1v1 (step semplici)

Modale/schermata a step, ognuno con UNA scelta chiara:

### Step A — Tipo
Scelta tra **1v1** e **TORNEO** (due card grandi con icona). Per ora costruisci il 1v1 completo, il torneo lo strutturiamo dopo (ma predisponi la scelta).

### Step B — Avversario
Tre opzioni:
- **Sfida aperta** (chiunque può accettare dalla bacheca)
- **Scegli avversario** (lista trader della community con username + posizione in classifica, ricercabile)
- **Sfida il leader** (shortcut per sfidare chi è #1 in classifica)

### Step C — Asset
Selezione asset tra quelli disponibili (XAUUSD, EURUSD, GBPUSD, BTCUSD, etc.). Mostra ogni asset con il suo simbolo. Default: XAUUSD (oro, il più usato).

### Step D — Durata
Selezione durata con opzioni rapide a bottone: 1h / 6h / 24h / 3 giorni / 7 giorni. Una sola scelta.

### Step E — Conferma
Riepilogo chiaro della sfida (tipo, avversario, asset, durata) + bottone grande **"LANCIA SFIDA"**. 
Animazione di lancio stile terminale ("> sfida trasmessa...").

Tutto il flusso deve essere veloce: max 5 tap dalla home alla sfida lanciata.

---

## SCHERMATA SFIDA LIVE (riusa e potenzia quella dello Step 01)

La schermata sfida live esiste già dallo Step 01 ed è ottima. Qui la rendi pienamente funzionale nel flusso:
- Quando una sfida è attiva, ci si entra dalla card "ATTIVE"
- I pips di entrambi si aggiornano (mock: simula aggiornamenti realistici ogni pochi secondi con piccole variazioni)
- Flag "▸ IN TESTA" che si sposta sul leader
- Barra confronto verde (leader) / ambra (sfidante)
- Live feed delle esecuzioni demo che scorre
- Countdown del tempo rimasto

### Fine sfida — schermata risultato
Quando il countdown finisce:
- Animazione vincitore in stile terminale ("WINNER DETECTED" in Anton, glow verde)
- Pips finali di entrambi
- Aggiornamento posizione in classifica (mostra il movimento: "+2 posizioni")
- Badge eventualmente sbloccato
- Bottoni: "RIVINCITA" e "TORNA ALLE SFIDE"

In caso di sconfitta: tono rispettoso, mai umiliante. Stile HTT freddo ma corretto ("> sfida persa. -14.2 pips. rivincita?").

---

## FLUSSO ACCETTAZIONE SFIDA (lato avversario)

Quando un utente riceve una sfida:
- Notifica/card nella sezione "IN ATTESA"
- Card con: chi sfida, asset, durata, posizione del challenger in classifica
- Due bottoni chiari: **ACCETTA** / **RIFIUTA**
- Accettando: countdown animato all'inizio sfida ("> sfida accettata. inizio tra 3...2...1") poi entrambi entrano nella schermata live

---

## DATI (mock realistici)

Crea un layer dati astratto (es. un modulo `challengeData`) con dati mock realistici:
- Trader della community con username in stile HTT (NEON_WOLF, VOID_RUNNER, GL1TCH_KID, etc.), posizione classifica, win rate
- Pips che si aggiornano in modo plausibile durante una sfida live (piccole variazioni su/giù, non lineari)
- Esecuzioni nel live feed (BUY/SELL con prezzo, pips guadagnati/persi)

Struttura il layer così che sostituire i mock con i dati reali AvaTrade (via API/MT5) dopo sia semplice — un'unica funzione da rimpiazzare.

---

## REQUISITI TRASVERSALI

- **Mobile-first**: tutto bello e usabile su telefono.
- **Max attrito zero**: ogni schermata una azione chiara, bottoni grandi.
- **Animazioni** Framer Motion fluide e veloci, mai bloccanti.
- **Niente localStorage** per dati di stato (usa stato React).
- **Gestione errori** con messaggi stile HTT.
- **Coerenza** con Step 01 e 02 già approvati.
- I dati delle sfide sono **demo verificati** — ricorda l'etichetta "VERIFICATO AVATRADE" dove ha senso.

---

## COSA MOSTRARMI

Quando hai finito:
1. La hub sfide (con sfide attive/in attesa/storico)
2. Il flusso creazione sfida (gli step)
3. La schermata risultato (vittoria + sconfitta)

Poi passiamo allo Step 04/05 (classifica + segnali).

> decode the market.
