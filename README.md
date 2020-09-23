 BrutusHR
===

Brutus HR er en webapp som laster inn et datasett fra en CSV-fil som inneholder informasjon om ansatte i Brutus A/S. Inne i webappen kan man se de ansatte i en tabell, søke og legge til nye ansatte. 

### Teknologi
+ Node.js
+ Express
+ Handlebars
+ NEDB
+ Fast-CSV
+ Body-Parser

Hvordan skal applikasjonen brukes?
---
Apllikasjonen startes i nettleseren. Her vil brukren bli møtt av en velkomstside, og en rad med knapper i toppen. Disse knappene brukes til å navigere i applikasjonen. Foreløpig kan man se sidenen `Statistics`, `Add user`, `Search users` og `List users`.

#### Statistics
Denne siden gir antallet brukere som er registrert i databasen i tillegg til å vise posisjonene til et sett av de første brukerne som markører i et kart.

#### Add user
Her kan man legge inn en ny bruker i databasen ved å fylle ut alle datafeltene og trykke Submit. Det vil dukke opp en lenke under `Add new user` i toppen om denne handlingen gikk bra. 

#### Search users
For å lettere kunne finne de personene man er ute etter har webappen muligheten til å søke etter brukere i databasen. Resultatet vises i en tabell under søkefeltet. Det er mulig å sortere kolonene ved å trykke i toppen av de. Ved siden av hver bruker finner man en knapp med teksten `View`. Ved å trykke på denne knappen sendes man til siden `User page`.

#### List users
Her vises alle brukerne delt inn i sider. Det er fire knapper for å navigere sidene. `First page`, `Previous page`, `Next page`, `Last page`. Ved trykke på disse knappene kan man navigere seg gjennom hele listen av brukere i databasen. 

På samme måte som søketabellen har man en `View`-knapp som fører en til `User page` og mulighet til å sortere per kolonne.  

#### User page
Denne siden viser frem dataen lagret på en enkelt bruker. Posisjonen lagret på brukeren vises også som en markør i kartet. 

Hva løser applikasjonen?
---
Applikasjonen gir et mer oversiktelig bilde av ansattdataen til Brutus A/S. 

Hvordan klargjøre applikasjonen for kjøring
---
1. Last ned Node.js fra https://nodejs.org/
2. Klon/Last ned git-prosjektet https://github.com/bummie/BrutusHR
3. Naviger inn i mappen `BrutusHR` via terminal.
4. Kjør kommandoen `npm install`.
5. De nødvendige modulene vil nå bli lastet ned.

Hvordan starte opp applikasjonen
---
1. Naviger inn i mappen `BrutusHR` via terminal.
2. Kjør kommandoen `node main.js`.
3. `Brutus listening on port: 1337` printes i termnialen om oppstart gikk bra.
4. Åpne nettleseren på adressen http://localhost:1337/