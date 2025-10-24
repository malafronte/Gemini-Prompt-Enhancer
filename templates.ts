export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
}

export const initialTemplates: PromptTemplate[] = [
  {
    id: self.crypto.randomUUID(),
    title: "Fisica: Simulazione Pendolo (HTML/JS)",
    prompt: `**Ruolo:** Sei un esperto sviluppatore di simulazioni fisiche interattive, con competenze avanzate in HTML, CSS, e JavaScript, e una profonda comprensione della meccanica classica.

**Obiettivo:** Creare un singolo file \`index.html\` che contenga una simulazione interattiva e didattica di un pendolo fisico. Il file deve essere completamente autonomo, con tutto il codice CSS e JavaScript inline (rispettivamente all'interno dei tag \`<style>\` e \`<script>\`).

**Struttura della Pagina HTML:**
La pagina dovrà avere un layout pulito e intuitivo, suddiviso in tre sezioni principali:
1.  **Pannello di Controllo:** Un'area dedicata ai controlli interattivi.
2.  **Area di Visualizzazione:** Uno spazio che contiene l'animazione del pendolo e un grafico in tempo reale.
3.  **Box dei Risultati:** Un riquadro che mostra i dati calcolati.

---

### **Specifiche Dettagliate dei Componenti**

**1. Pannello di Controllo:**
Deve contenere i seguenti elementi:
*   **Titolo:** "Simulazione Pendolo Fisico"
*   **Slider Interattivi:** Ogni slider deve avere un'etichetta chiara e un display numerico che mostra il valore corrente.
    *   **Lunghezza (L):** da 0.5 a 5.0 metri (default: 1.0 m, step: 0.1)
    *   **Gravità (g):** da 1.0 a 20.0 m/s² (default: 9.81 m/s², step: 0.1)
    *   **Angolo Iniziale (θ₀):** da 0 a 179 gradi (default: 45°, step: 1). *Nota: Internamente, converti questo valore in radianti per i calcoli.*
    *   **Passo Temporale (dt):** da 0.001 a 0.05 secondi (default: 0.016 s, step: 0.001)
*   **Controllo Attrito:**
    *   Uno **switch/checkbox** con etichetta "Abilita Attrito Viscoso".
    *   Uno **slider per il coefficiente di attrito (b/m)**, visibile solo se lo switch è attivo. Range: da 0.0 a 2.0 1/s (default: 0.5 1/s, step: 0.01).
*   **Pulsanti di Azione:**
    *   \`Avvia/Pausa\`: Avvia o mette in pausa la simulazione.
    *   \`Reset\`: Reimposta la simulazione ai valori iniziali degli slider.
    *   \`Step\`: Esegue un singolo passo di calcolo (\`dt\`) quando la simulazione è in pausa.
    *   \`Esporta CSV\`: Genera e scarica un file CSV con i dati della simulazione (colonne: \`tempo_s\`, \`angolo_rad\`, \`velocita_angolare_rad_s\`).
    *   \`Spiega Fisica e Metodo\`: Apre una finestra modale con le spiegazioni dettagliate.

**2. Area di Visualizzazione:**
*   **Animazione del Pendolo:**
    *   Utilizza un \`<canvas>\` HTML5.
    *   Disegna un punto di sospensione fisso.
    *   Disegna un'asta (linea) di lunghezza proporzionale a \`L\`.
    *   Disegna una massa puntiforme alla fine dell'asta.
    *   L'animazione deve riflettere fedelmente l'angolo \`θ\` calcolato in tempo reale.
*   **Grafico Angolo-Tempo (θ vs t):**
    *   Utilizza una libreria JavaScript per grafici come \`Chart.js\` (includi la CDN nel tag \`<script>\`) o disegnalo su un secondo \`<canvas>\`.
    *   **Asse X:** "Tempo (s)", con valori numerici.
    *   **Asse Y:** "Angolo (rad)", con valori numerici.
    *   Il grafico deve aggiornarsi dinamicamente ad ogni passo della simulazione, mostrando la traiettoria \`θ(t)\`.

**3. Box dei Risultati:**
Mostra i seguenti valori, aggiornati in tempo reale:
*   **Periodo Teorico (piccole oscillazioni):** Calcolato con la formula \`T = 2π√(L/g)\`. Mostra il valore in secondi.
*   **Periodo Misurato (numerico):** Misura il tempo trascorso tra due passaggi consecutivi per il punto di equilibrio (\`θ=0\`) nella stessa direzione. Mostra il valore in secondi e un messaggio "Calcolando..." finché non è completata un'oscillazione.

---

### **Logica di Simulazione e Fisica (JavaScript)**

*   **Metodo di Integrazione:** Utilizza il **metodo di Euler-Cromer**, che è simplettico e più stabile per gli oscillatori rispetto a quello di Eulero standard.
    1.  \`alpha = -(g/L) * sin(theta)\` (Accelerazione angolare per pendolo semplice)
    2.  \`alpha -= (b/m) * omega\` (Aggiungi il termine di smorzamento se l'attrito è attivo)
    3.  \`omega = omega + alpha * dt\` (Aggiorna la velocità angolare)
    4.  \`theta = theta + omega * dt\` (Aggiorna l'angolo con la *nuova* velocità)
*   **Aggiornamento:** La logica di simulazione deve essere contenuta in una funzione \`update()\` chiamata ad ogni frame (usando \`requestAnimationFrame\`).

---

### **Finestra Modale "Spiega"**

Il pulsante "Spiega Fisica e Metodo" deve aprire un pop-up (modale) con una struttura a tab:

*   **Tab 1: Pendolo Semplice (Senza Attrito)**
    *   **Equazione del Moto:** Mostra e spiega \`d²θ/dt² + (g/L)sin(θ) = 0\`.
    *   **Approssimazione per Piccoli Angoli:** Spiega che per \`θ\` piccolo, \`sin(θ) ≈ θ\`, e l'equazione diventa quella di un oscillatore armonico semplice: \`d²θ/dt² + (g/L)θ = 0\`.
    *   **Formula del Periodo:** Deriva \`T = 2π√(L/g)\` dall'equazione approssimata, specificando che è valida solo per piccole oscillazioni. Spiega che per angoli grandi il periodo reale è maggiore.
    *   **Metodo Numerico:** Spiega i passaggi del metodo di Euler-Cromer utilizzato nella simulazione per risolvere l'equazione esatta.

*   **Tab 2: Pendolo Smorzato (Con Attrito)**
    *   **Equazione del Moto:** Mostra e spiega l'equazione completa: \`d²θ/dt² + (b/m)dθ/dt + (g/L)sin(θ) = 0\`.
    *   **Fisica dello Smorzamento:** Spiega che il termine \`(b/m)dθ/dt\` rappresenta una forza di attrito viscoso, proporzionale alla velocità angolare, che dissipa energia e smorza le oscillazioni.
    *   **Effetto sul Periodo:** Spiega che la presenza di un debole attrito aumenta leggermente il periodo di oscillazione (pseudo-periodo) e che l'ampiezza delle oscillazioni diminuisce esponenzialmente nel tempo.

*   **Tab 3: Unità di Misura**
    *   **Spiegazione del Coefficiente (b/m):**
        *   Spiega che \`b\` è il coefficiente di smorzamento viscoso (unità: kg/s) e \`m\` è la massa (unità: kg).
        *   Di conseguenza, il rapporto \`b/m\` ha unità di \`(kg/s) / kg = 1/s\`.
        *   **Significato fisico di 1/s:** Spiega che \`1/s\` (o s⁻¹) può essere interpretato come una "frequenza di smorzamento". Un valore di \`b/m = 0.5 1/s\` significa che, a causa del solo attrito, l'ampiezza dell'oscillazione si riduce di un fattore \`e\` (circa 2.718) in un tempo caratteristico \`τ = m/b = 1/0.5 = 2\` secondi. È una misura di quanto rapidamente il sistema perde energia.

---

**Requisiti Finali:**
*   **Stile:** Utilizza un CSS pulito e moderno per garantire una buona leggibilità e usabilità.
*   **Commenti al Codice:** Includi commenti chiari nel codice JavaScript per spiegare le parti più importanti, specialmente la logica fisica e il ciclo di simulazione.
*   **Lingua:** Tutto il testo visibile all'utente (etichette, spiegazioni, titoli) deve essere in **italiano**.`,
  },
  {
    id: self.crypto.randomUUID(),
    title: "Fisica: Simulazione Orbite (Python/Colab)",
    prompt: `**Ruolo:** Sei un esperto di astrofisica computazionale e data visualization, specializzato in Python.

**Obiettivo:** Creare un notebook Google Colab per simulare e visualizzare l'orbita di un pianeta attorno a una stella usando il metodo di Eulero-Cromer per risolvere il problema dei due corpi. Il notebook deve essere interattivo e didattico.

**Struttura del Notebook:**
1.  **Introduzione:** Una cella Markdown che spiega l'obiettivo, la fisica della gravitazione universale e il metodo numerico utilizzato.
2.  **Setup:** Cella di codice per importare le librerie necessarie (\`numpy\`, \`matplotlib.pyplot\`, \`ipywidgets\`).
3.  **Pannello di Controllo Interattivo:** Utilizza \`ipywidgets\` per creare slider e controlli per i parametri iniziali.
4.  **Funzione di Simulazione:** Una funzione Python che esegue il calcolo dell'orbita.
5.  **Visualizzazione:** Una funzione che, data l'output della simulazione, genera un grafico statico dell'orbita e grafici animati (opzionale, ma preferibile) delle traiettorie.
6.  **Spiegazione:** Una cella Markdown finale che spiega come interpretare i risultati e discute i limiti del modello.

---

### **Specifiche Dettagliate**

**1. Pannello di Controllo (\`ipywidgets\`):**
*   **Massa Stella (M):** Slider logaritmico da 1e28 a 1e31 kg (default: 1.989e30 kg, massa del Sole).
*   **Posizione Iniziale Pianeta (x₀, y₀):** Due slider per le coordinate, range da 0 a 3e11 metri (default x₀: 1.496e11 m, y₀: 0).
*   **Velocità Iniziale Pianeta (vx₀, vy₀):** Due slider per le componenti della velocità, range da -5e4 a 5e4 m/s (default vx₀: 0, vy₀: 2.98e4 m/s).
*   **Passo Temporale (dt):** Slider da 1000 a 86400 secondi (1 giorno) (default: 3600 s).
*   **Tempo Totale Simulazione:** Slider da 1 a 20 anni (convertito in secondi, default: 5 anni).
*   **Pulsante "Esegui Simulazione"**.

**2. Logica di Simulazione (Python/NumPy):**
*   **Costante Gravitazionale:** G = 6.67430e-11 m³ kg⁻¹ s⁻².
*   **Ciclo di Calcolo (Metodo Euler-Cromer):**
    1. Calcola la distanza \`r = sqrt(x² + y²)\`.
    2. Calcola la forza gravitazionale \`F = G * M * m / r²\` (la massa del pianeta \`m\` si semplifica, quindi calcola l'accelerazione).
    3. Calcola le componenti dell'accelerazione: \`ax = - (G * M / r³) * x\` e \`ay = - (G * M / r³) * y\`.
    4. Aggiorna le velocità: \`vx = vx + ax * dt\`, \`vy = vy + ay * dt\`.
    5. Aggiorna le posizioni: \`x = x + vx * dt\`, \`y = y + vy * dt\`.
*   La funzione deve salvare le posizioni (x, y) e le velocità (vx, vy) ad ogni passo in array NumPy.

**3. Visualizzazione (\`matplotlib\`):**
*   **Grafico dell'Orbita:** Un grafico 2D statico che mostra la traiettoria completa (y vs x). Disegna la stella al centro (0,0) e l'orbita del pianeta.
*   **Grafici Aggiuntivi (opzionale):** Grafici che mostrano la conservazione dell'energia (cinetica + potenziale) e del momento angolare nel tempo per verificare l'accuratezza della simulazione.

**Requisiti Finali:**
*   **Codice Commentato:** Spiega ogni passaggio chiave nel codice.
*   **Markdown Didattico:** Usa celle Markdown per guidare l'utente attraverso la fisica e il codice.
*   **Interattività:** L'output deve aggiornarsi quando l'utente cambia i parametri e clicca il pulsante.
*   **Lingua:** Tutto il testo visibile all'utente deve essere in **italiano**.`,
  },
    {
    id: self.crypto.randomUUID(),
    title: "Matematica: Esploratore Serie Fourier (HTML/JS)",
    prompt: `**Ruolo:** Sei un esperto di matematica applicata e sviluppo web, specializzato nella visualizzazione di concetti matematici complessi.

**Obiettivo:** Creare un singolo file \`index.html\` autonomo per una visualizzazione interattiva dell'approssimazione di una funzione periodica (onda quadra, a dente di sega, triangolare) tramite la sua Serie di Fourier.

**Struttura della Pagina:**
1.  **Pannello di Controllo:** Selettori e slider per modificare i parametri della serie.
2.  **Area di Visualizzazione:** Un canvas per disegnare la funzione originale e la sua approssimazione di Fourier.

---

### **Specifiche Dettagliate**

**1. Pannello di Controllo:**
*   **Selezione Funzione:** Un menu a tendina per scegliere tra "Onda Quadra", "Onda a Dente di Sega", "Onda Triangolare".
*   **Numero di Termini (N):** Uno slider per controllare il numero di termini (armoniche) nella serie di Fourier, da 1 a 100 (default: 3).
*   **Velocità Animazione:** Uno slider per controllare la velocità di evoluzione del tempo (se si sceglie di animare i fasori).
*   **Pulsante "Reset"**.

**2. Area di Visualizzazione (\`canvas\`):**
*   **Grafico Funzione:** Disegna in un colore (es. grigio) la funzione periodica originale selezionata.
*   **Approssimazione di Fourier:** Sovrapponi, in un colore più evidente (es. blu), la somma dei primi N termini della serie di Fourier. L'approssimazione deve aggiornarsi istantaneamente al cambio dello slider "Numero di Termini".
*   **(Opzionale ma consigliato) Visualizzazione Fasori:** Disegna i vettori rotanti (fasori) che rappresentano ogni armonica. La somma di questi vettori traccia l'approssimazione di Fourier, fornendo una visualizzazione intuitiva del teorema.

**3. Logica Matematica (JavaScript):**
*   Implementa le formule per i coefficienti di Fourier (a_n, b_n) per le funzioni date.
    *   **Onda Quadra:** Solo termini seno dispari.
    *   **Onda a Dente di Sega:** Solo termini seno.
    *   **Onda Triangolare:** Solo termini coseno dispari.
*   Crea una funzione che calcola la somma parziale della serie \`S_N(t) = a_0/2 + Σ [a_n*cos(nωt) + b_n*sin(nωt)]\` da n=1 a N.
*   Usa \`requestAnimationFrame\` per il ciclo di disegno.

**Requisiti Finali:**
*   **File Autonomo:** Tutto il CSS e JS deve essere inline nel file \`index.html\`.
*   **Interattività:** L'utente deve poter vedere come l'approssimazione migliora all'aumentare di N.
*   **Spiegazioni:** Aggiungi un piccolo testo esplicativo sotto la visualizzazione che spieghi brevemente cosa sia una Serie di Fourier.
*   **Lingua:** Tutto il testo visibile all'utente deve essere in **italiano**.`,
  },
  {
    id: self.crypto.randomUUID(),
    title: "Chimica: Simulatore di Titolazione (HTML/JS)",
    prompt: `**Ruolo:** Sei un chimico e sviluppatore web con esperienza nella creazione di strumenti didattici interattivi per la chimica analitica.

**Obiettivo:** Creare un singolo file \`index.html\` autonomo che simuli una titolazione acido-base (acido forte con base forte), visualizzando la curva di titolazione e l'indicatore di colore.

**Struttura della Pagina:**
1.  **Area di Simulazione:** Una rappresentazione grafica di una beuta e una buretta.
2.  **Pannello di Controllo:** Input per le concentrazioni e volumi.
3.  **Area Grafico e Dati:** Un grafico pH vs Volume e display numerici.

---

### **Specifiche Dettagliate**

**1. Area di Simulazione (\`canvas\` o \`div\` con CSS):**
*   **Buretta:** Un cilindro graduato con un rubinetto. Il livello del liquido (titolante) deve scendere man mano che viene aggiunto.
*   **Beuta:** Un contenitore con una soluzione (analita) il cui colore cambia in base al pH e all'indicatore scelto.

**2. Pannello di Controllo:**
*   **Analita (nella beuta):**
    *   **Concentrazione Acido (Mₐ):** Input numerico (default: 0.1 M).
    *   **Volume Acido (Vₐ):** Input numerico (default: 25 mL).
*   **Titolante (nella buretta):**
    *   **Concentrazione Base (Mₑ):** Input numerico (default: 0.1 M).
*   **Controllo:**
    *   **Volume da Aggiungere:** Un pulsante "Aggiungi 1 mL", "Aggiungi 0.1 mL", e uno slider per un'aggiunta continua.
    *   **Selezione Indicatore:** Un menu a tendina per scegliere tra "Fenolftaleina" (vira a pH 8.2-10), "Metilarancio" (vira a pH 3.1-4.4).
    *   **Pulsante "Reset"**.

**3. Area Grafico e Dati:**
*   **Grafico di Titolazione:**
    *   Utilizza \`Chart.js\` (via CDN) o un \`<canvas>\` custom.
    *   **Asse X:** "Volume di Base Aggiunto (mL)".
    *   **Asse Y:** "pH".
    *   Il grafico deve tracciare un punto per ogni aggiunta di titolante, costruendo la curva di titolazione.
*   **Display Dati:** Mostra in tempo reale:
    *   "Volume Totale Aggiunto: X mL".
    *   "pH Calcolato: Y".

**4. Logica Chimica (JavaScript):**
*   Implementa le equazioni per calcolare il pH in una titolazione acido forte-base forte:
    1.  **Prima del punto di equivalenza:** pH determinato dall'eccesso di H⁺.
    2.  **Al punto di equivalenza:** pH = 7.
    3.  **Dopo il punto di equivalenza:** pH determinato dall'eccesso di OH⁻.
*   Aggiorna il colore della soluzione nella beuta in base all'intervallo di viraggio dell'indicatore selezionato.

**Requisiti Finali:**
*   **File Autonomo:** Tutto il CSS e JS deve essere inline nel file \`index.html\`.
*   **Didattico:** L'utente deve poter osservare la forma a "S" della curva e la correlazione tra il cambiamento di colore e il salto di pH al punto di equivalenza.
*   **Lingua:** Tutto il testo visibile all'utente deve essere in **italiano**.`,
  },
  {
    id: self.crypto.randomUUID(),
    title: "Scienze Naturali: Ecosistema Preda-Predatore (HTML/JS)",
    prompt: `**Ruolo:** Sei un biologo computazionale e sviluppatore web, esperto nella modellizzazione di sistemi ecologici.

**Obiettivo:** Creare un singolo file \`index.html\` autonomo per una simulazione interattiva di un ecosistema con due popolazioni (es. conigli e volpi) basato sulle equazioni di Lotka-Volterra.

**Struttura della Pagina:**
1.  **Pannello di Controllo:** Slider per i parametri del modello.
2.  **Area di Visualizzazione:** Grafici delle popolazioni nel tempo e nello spazio delle fasi.

---

### **Specifiche Dettagliate**

**1. Pannello di Controllo:**
*   **Parametri Lotka-Volterra:**
    *   **Tasso di crescita prede (α):** Slider (default: 1.1).
    *   **Tasso di predazione (β):** Slider (default: 0.4).
    *   **Tasso di mortalità predatori (γ):** Slider (default: 0.4).
    *   **Efficienza di conversione (δ):** Slider (default: 0.1).
*   **Popolazioni Iniziali:**
    *   **Prede iniziali (x₀):** Slider (default: 10).
    *   **Predatori iniziali (y₀):** Slider (default: 10).
*   **Pulsanti:** "Avvia/Pausa", "Reset".

**2. Area di Visualizzazione:**
*   **Grafico Popolazioni vs. Tempo:**
    *   Usa \`Chart.js\` (via CDN).
    *   **Asse X:** "Tempo".
    *   **Asse Y:** "Numero di Individui".
    *   Traccia due linee separate: una per la popolazione di prede (es. blu) e una per i predatori (es. rosso).
*   **Grafico Spazio delle Fasi:**
    *   **Asse X:** "Popolazione Prede".
    *   **Asse Y:** "Popolazione Predatori".
    *   Traccia la traiettoria del sistema, mostrando il ciclo preda-predatore.

**3. Logica del Modello (JavaScript):**
*   Implementa il metodo di Eulero (o Runge-Kutta 4 per maggiore precisione) per risolvere il sistema di equazioni differenziali:
    *   \`dx/dt = α*x - β*x*y\` (variazione prede)
    *   \`dy/dt = δ*β*x*y - γ*y\` (variazione predatori)
*   Usa \`requestAnimationFrame\` per il ciclo di simulazione e aggiornamento dei grafici.

**Requisiti Finali:**
*   **File Autonomo:** Tutto il CSS e JS deve essere inline nel file \`index.html\`.
*   **Interattività:** L'utente deve poter modificare i parametri e osservare come cambiano i cicli delle popolazioni (es. estinzione, stabilità).
*   **Spiegazioni:** Includi una breve spiegazione delle equazioni di Lotka-Volterra e del significato dei parametri.
*   **Lingua:** Tutto il testo visibile all'utente deve essere in **italiano**.`,
  },
  {
    id: self.crypto.randomUUID(),
    title: "Geografia Astronomica: Fasi Lunari (HTML/JS)",
    prompt: `**Ruolo:** Sei un esperto di astronomia e sviluppatore web, specializzato nella creazione di modelli 3D e visualizzazioni del sistema solare.

**Obiettivo:** Creare un singolo file \`index.html\` autonomo che mostri una visualizzazione 3D interattiva del sistema Terra-Luna per spiegare le fasi lunari.

**Struttura della Pagina:**
1.  **Vista 3D Principale:** Una scena 3D che mostra la Terra, la Luna in orbita, e una sorgente di luce direzionale che rappresenta il Sole.
2.  **Pannello Informativo:** Un'area che mostra la fase lunare corrente e una vista della Luna come appare dalla Terra.
3.  **Controlli di Animazione:** Pulsanti per controllare il tempo della simulazione.

---

### **Specifiche Dettagliate**

**1. Vista 3D Principale:**
*   Utilizza una libreria JavaScript 3D come \`Three.js\` (inclusa via CDN).
*   **Terra:** Crea una sfera con una texture della Terra. Falla ruotare lentamente sul proprio asse.
*   **Luna:** Crea una sfera più piccola con una texture della Luna. Falla orbitare attorno alla Terra.
*   **Sole:** Non visualizzare l'oggetto Sole, ma rappresenta la sua luce con una \`DirectionalLight\` proveniente da una direzione fissa (es. da destra), che illumina sia la Terra che la Luna. L'illuminazione è la chiave per mostrare le fasi.
*   **Controlli Camera:** Permetti all'utente di zoomare, ruotare e spostare la camera per osservare la scena da diverse angolazioni.

**2. Pannello Informativo:**
*   **Nome della Fase:** Mostra il nome della fase lunare corrente in base alla posizione relativa Terra-Luna-Sole (es. "Luna Nuova", "Primo Quarto", "Luna Piena", "Ultimo Quarto").
*   **Vista dalla Terra:** In un riquadro 2D separato (un piccolo \`<canvas>\` o un \`div\` con CSS), mostra come appare la Luna vista dalla Terra. Questo può essere simulato disegnando un cerchio nero e sovrapponendovi un cerchio illuminato la cui posizione e forma dipendono dall'angolo di fase.

**3. Controlli di Animazione:**
*   **Pulsanti:** "Avvia/Pausa", "Accelera Tempo", "Rallenta Tempo", "Reset".
*   **Slider (Opzionale):** Uno slider che permette all'utente di "scrubbare" manualmente attraverso il ciclo orbitale della Luna per vedere le diverse fasi.

**4. Logica Astronomica (JavaScript):**
*   Calcola la posizione della Luna nella sua orbita in funzione del tempo.
*   Calcola l'angolo di fase (angolo Sole-Luna-Terra) per determinare il nome della fase corrente.
*   La logica di rendering 3D di \`Three.js\` gestirà automaticamente l'illuminazione della Luna. La sfida è sincronizzare l'animazione con i dati mostrati nel pannello informativo.
*   Usa \`requestAnimationFrame\` per il ciclo di rendering e animazione.

**Requisiti Finali:**
*   **File Autonomo:** Tutto il codice deve essere contenuto nel file \`index.html\`.
*   **Intuitivo:** La visualizzazione deve rendere immediatamente chiaro perché vediamo diverse fasi lunari (cioè, vediamo la porzione della Luna illuminata dal Sole dal nostro punto di vista sulla Terra).
*   **Lingua:** Tutto il testo visibile all'utente deve essere in **italiano**.`,
  }
];