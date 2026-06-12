# HTT — STEP 02 + FIX STEP 01
## Da incollare in Claude Code

---

Lo Step 01 è approvato — il design system e la demo sfida live sono ottimi. Prima di procedere allo Step 02, applica questi fix allo Step 01, poi costruisci l'onboarding.

---

## FIX DA APPLICARE ALLO STEP 01

1. **Font display**: usa **Bebas Neue** come display principale ovunque. Riserva **Anton** SOLO ai momenti ad alto impatto (la scritta "VS" nella sfida, le schermate di vittoria). Non usare Anton per i titoli normali.

2. **Schermo mobile sfida — spazio vuoto**: sotto la barra di confronto pips, su mobile, c'è troppo spazio vuoto. Aggiungi anche su mobile il **LIVE FEED** delle esecuzioni demo (che su desktop è già presente), in versione compatta. Lo schermo mobile non deve avere buchi.

3. **Barra di confronto — colore sfidante**: nella barra confronto pips, lo sfidante in seconda posizione è attualmente rosso. Cambialo in **ambra (#FFB800)**. Tieni il rosso (#FF0033) SOLO per i trade realmente in perdita / loss. Nel confronto tra due trader entrambi possono essere in positivo, quindi rosso = "sta perdendo" è fuorviante. Leader = verde, sfidante = ambra.

4. **Avatar**: gli avatar con la singola lettera ("N", "V") sono troppo anonimi per un brand hacker. Aggiungi un sottile effetto glitch/scanline più marcato e un bordo che si illumina del colore del trader (verde per il leader, ambra per lo sfidante).

---

## STEP 02 — ONBOARDING + BOOT SEQUENCE + PANNELLO ADMIN

Costruisci il flusso di ingresso completo. È la prima impressione, deve essere cinematografico ma chiarissimo.

### Schermata 1 — Boot sequence (al primo accesso)
Animazione di "avvio sistema" stile terminale HTT. Le righe appaiono in sequenza con effetto typewriter:
```
> inizializzazione HTT_NET...
> connessione neurale: OK
> feed di mercato: OK
> moduli AI: OK
> sistema online.
```
Poi rivelazione del wordmark H_CK_TH_E_TR_D_I_NG con glow. Durata totale max 3-4 secondi, con possibilità di skip (tap/click salta l'animazione). Mai bloccare l'utente: chi torna una seconda volta non rivede il boot (usa stato in sessione, NON localStorage).

### Schermata 2 — Registrazione
Form pulito: email + username. Supabase Auth.
Estetica: campi stile terminale con label tipo "> email_" e cursore lampeggiante. Bottone grande "INIZIALIZZA ACCESSO".
Validazione chiara con messaggi in stile HTT ("> errore: email non valida").

### Schermata 3 — Step AvaTrade (la chiave del modello)
Schermata che spiega in modo SEMPLICE perché serve aprire il conto. Niente muro di testo. Struttura:
- Titolo: "Ultimo step per accedere alle sfide"
- 3 punti chiari con icone:
  1. Apri il tuo conto AvaTrade gratuito (deposito 250€, resta tuo)
  2. Il tuo conto demo viene collegato e verificato
  3. Accedi a sfide, classifica e community
- Bottone grande verde con glow: "APRI CONTO AVATRADE" (placeholder per il link affiliato, usa `AVATRADE_AFFILIATE_LINK` come variabile)
- Sotto, link secondario: "Ho già un conto AvaTrade"
- Messaggio rassicurante: "Il deposito resta sul tuo conto di trading. Noi non tocchiamo mai i tuoi soldi."

### Schermata 4 — Inserimento dati AvaTrade
Dopo che l'utente è andato su AvaTrade, torna e inserisce il suo ID/username conto AvaTrade in un campo terminale.
Salva su `users.avatrade_account_id`.

### Schermata 5 — In verifica
Animazione di attesa elegante: terminale che "scansiona", tipo:
```
> verifica conto in corso...
> in attesa di conferma deposito...
```
Messaggio chiaro e tranquillizzante: "Il team sta verificando il tuo accesso. Riceverai conferma a breve." Lo stato è `avatrade_verified = false`, l'utente NON può ancora accedere ai moduli interni.

### Schermata 6 — Access granted
Quando l'admin verifica, al successivo accesso l'utente vede un'animazione "ACCESS GRANTED" (verde, glow, breve) e poi entra nella piattaforma (la sfida live / home).

### PANNELLO ADMIN (schermata separata, accesso solo ruolo admin)
- Lista utenti in attesa di verifica: username, email, avatrade_account_id, data registrazione
- Per ogni utente un bottone "VERIFICA" che setta `avatrade_verified = true` e `deposito_confermato_at = now()`
- Possibilità di rifiutare/eliminare un utente sospetto
- Contatore in alto: utenti totali, verificati, in attesa
- Stessa estetica HTT (tabella terminale, verde su nero)
- Proteggi la rotta: solo `ruolo = 'admin'` può accedere (controllo lato Supabase RLS + lato frontend)

---

## REQUISITI TRASVERSALI (validi per tutto)

- **Mobile-first**: ogni schermata bella e funzionale su telefono.
- **Animazioni**: Framer Motion, fluide, veloci, mai bloccanti. Skip sempre possibile su animazioni lunghe.
- **Niente localStorage** per dati sensibili o di sessione. Usa stato React + Supabase.
- **Gestione errori** su ogni chiamata Supabase, messaggi in stile HTT.
- **Sicurezza accessi**: un utente non verificato non deve in alcun modo vedere chat/sfide/segnali reali, né lato frontend né lato dati (RLS).
- **Estetica**: coerente con lo Step 01 già approvato.

---

## COSA MOSTRARMI

Quando hai finito, mostrami in particolare:
1. Il boot sequence (descrivi i tempi)
2. La schermata Step AvaTrade
3. Il pannello admin

Poi passiamo allo Step 03 (flusso creazione sfida).

> decode the market.
