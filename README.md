# Treenisuunnitelma

Yksinkertainen viikkotason treenisovellus, jossa kayttaja voi lisata, muokata ja poistaa treeneja maanantaista sunnuntaihin. Kaikki muutokset tallentuvat treenihistoriaan.

## Main Features
- Viikkonakyma (maanantai-sunnuntai)
- Treenin lisays tietylle paivalle
- Treenin kentat:
  - nimi
  - kesto (minuutteina)
  - vauhtitavoite
  - muistiinpanot
- Treenien muokkaus ja poisto
- Treenihistoria (create/update/delete)
- Responsiivinen UI (desktop + mobile)

## Architecture
- `frontend`:
  - React + Vite
  - Komponenttipohjainen UI ja API-integraatio
- `backend`:
  - Node.js + Express REST API
  - SQLite (`better-sqlite3`) tietojen tallennukseen
- Data flow:
  1. Frontend hakee viikon treenit endpointista `GET /api/workouts`
  2. Frontend luo/muokkaa/poistaa treeneja endpointtien kautta
  3. Backend tallentaa muutokset `workouts`-tauluun
  4. Backend kirjoittaa jokaisen muutoksen `workout_history`-tauluun

## Database Schema (SQLite)

### Table: `workouts`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `date` TEXT NOT NULL (`YYYY-MM-DD`)
- `name` TEXT NOT NULL
- `duration_minutes` INTEGER NOT NULL
- `pace_target` TEXT NOT NULL
- `notes` TEXT
- `created_at` TEXT NOT NULL (ISO datetime)
- `updated_at` TEXT NOT NULL (ISO datetime)

### Table: `workout_history`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `workout_id` INTEGER
- `action` TEXT NOT NULL (`create|update|delete`)
- `payload` TEXT NOT NULL (JSON snapshot)
- `changed_at` TEXT NOT NULL (ISO datetime)

## Frontend Components
- `App.jsx`: paatason tila ja datan haku
- `WeekNavigator.jsx`: viikon vaihto
- `WeekGrid.jsx`: viikkonakyma + paivakohtaiset treenit
- `WorkoutModal.jsx`: treenin lisays/muokkaus
- `HistoryPanel.jsx`: treenihistoria

## Backend API
- `GET /api/health`
- `GET /api/workouts?weekStart=YYYY-MM-DD&weekEnd=YYYY-MM-DD`
- `POST /api/workouts`
- `PUT /api/workouts/:id`
- `DELETE /api/workouts/:id`
- `GET /api/history?limit=40`

### Example payload (`POST /api/workouts`)
```json
{
  "date": "2026-03-09",
  "name": "Kevyt lenkki",
  "durationMinutes": 45,
  "paceTarget": "6:00/km",
  "notes": "Rento alkuviikko"
}
```

## Run Locally
1. Asenna riippuvuudet:
```bash
npm install
```
2. Kaynnista backend:
```bash
npm run dev -w backend
```
3. Kaynnista frontend:
```bash
npm run dev -w frontend
```

Backend: `http://localhost:4000`
Frontend: `http://localhost:5173`

## Tests
Testit kattavat:
- Unicode-tekstit (kiina + arabia)
- hyvin pitkien syotteiden raja-arvot
- desimaalit, `NaN`, `Infinity`, `-Infinity`
- tiedosto-operaatioiden virhetilanteet (virheellinen polku, oikeudet, rikkoutunut data, levytila, tuntemattomat virheet)
- verkkoyhteysvirheet ja HTTP-virheet
- tietokanta-avauksen virhetilanteet
- SQLite-repositorion CRUD + history -kayttaytyminen
- frontendin paivamaarautilit (`dateUtils`)
- frontend-komponentit React Testing Librarylla (`WeekNavigator`, `WeekGrid`, `WorkoutModal`, `HistoryPanel`)

Yksityiskohtainen testimatriksi: `TESTING.md`

Aja testit:
```bash
npm run test
```
