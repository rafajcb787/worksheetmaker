# Product Requirements Document: Worksheet Maker

## 1. Overview

**Product Name:** Worksheet Maker

**Purpose:** A bilingual (English/Spanish) web application that allows teachers to generate printable worksheets on demand using ChatGPT (free tier). The app supports toggling both the UI language and the worksheet content language between English and Spanish.

**Target Users:** K-12 teachers who need quick, customizable worksheets in English or Spanish.

---

## 2. Features

### 2.1 Core Features

| Feature | Description |
|---|---|
| **Worksheet Generation** | Teachers enter a topic, grade level, and question type; the app calls ChatGPT to generate a worksheet. |
| **UI Language Toggle** | Switch the entire interface (labels, buttons, menus) between English and Spanish. |
| **Content Language Toggle** | Independently switch the generated worksheet content between English and Spanish. |
| **Print / Export** | Print the worksheet directly or download it as a PDF. |
| **Worksheet History** | Save previously generated worksheets for reuse or editing. |

### 2.2 Worksheet Configuration Options

- **Subject:** Math, Science, Reading, Social Studies, Language Arts, Custom
- **Grade Level:** K through 12
- **Question Types:** Multiple choice, fill-in-the-blank, true/false, short answer, matching, word problems
- **Number of Questions:** 5, 10, 15, or 20
- **Difficulty:** Easy, Medium, Hard
- **Include Answer Key:** Yes / No

### 2.3 User Management

- Teacher sign-up and login (email/password)
- Profile with saved preferences (default grade, subject, language)
- Worksheet history tied to account

### 2.4 Bilingual Support

- **UI Language Toggle:** A toggle in the header switches all interface text between English and Spanish using i18n.
- **Content Language Toggle:** A separate toggle on the worksheet form controls the language of the generated content. A teacher can use the UI in English but generate worksheets in Spanish, or vice versa.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **Internationalization** | react-i18next (UI translations) |
| **State Management** | React Context API |
| **Backend** | Node.js + Express |
| **AI Integration** | OpenAI ChatGPT API (free tier / gpt-3.5-turbo) |
| **Database** | SQLite (via better-sqlite3) |
| **ORM** | Drizzle ORM |
| **Authentication** | JSON Web Tokens (JWT) + bcrypt |
| **PDF Generation** | react-to-print + jsPDF |
| **Deployment** | Vercel (frontend) + Railway or Render (backend) |

### Why this stack?

- **SQLite** keeps things simple — no external database server needed, easy to develop and deploy.
- **React + Vite** provides fast dev experience and is widely known.
- **Express** is lightweight and sufficient for a simple API.
- **ChatGPT free tier (gpt-3.5-turbo)** keeps costs at zero or near-zero for teachers.

---

## 4. Database Schema

### Tables

```
users
├── id            INTEGER  PRIMARY KEY AUTOINCREMENT
├── email         TEXT     UNIQUE NOT NULL
├── password_hash TEXT     NOT NULL
├── name          TEXT     NOT NULL
├── default_grade TEXT
├── default_subject TEXT
├── ui_language   TEXT     DEFAULT 'en'   -- 'en' | 'es'
├── created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
└── updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP

worksheets
├── id              INTEGER  PRIMARY KEY AUTOINCREMENT
├── user_id         INTEGER  REFERENCES users(id)
├── title           TEXT     NOT NULL
├── subject         TEXT     NOT NULL
├── grade_level     TEXT     NOT NULL
├── question_type   TEXT     NOT NULL
├── num_questions   INTEGER  NOT NULL
├── difficulty      TEXT     NOT NULL
├── content_language TEXT    NOT NULL        -- 'en' | 'es'
├── content         TEXT     NOT NULL        -- generated worksheet (markdown/HTML)
├── answer_key      TEXT                     -- generated answer key
├── created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
└── updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

## 5. UI Layout

### 5.1 Global Header

```
┌──────────────────────────────────────────────────────────┐
│  📝 Worksheet Maker        [EN | ES]    [User ▼] [Logout]│
│                            ▲ UI lang                     │
└──────────────────────────────────────────────────────────┘
```

- App logo/name on the left
- UI language toggle (EN/ES) in the center-right
- User menu and logout on the far right

### 5.2 Login / Sign-Up Page

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              Welcome to Worksheet Maker                  │
│                                                          │
│              ┌──────────────────────┐                    │
│              │  Email               │                    │
│              ├──────────────────────┤                    │
│              │  Password            │                    │
│              ├──────────────────────┤                    │
│              │  [  Log In  ]        │                    │
│              │  Don't have an       │                    │
│              │  account? Sign Up    │                    │
│              └──────────────────────┘                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 5.3 Worksheet Generator Page (Main Page)

```
┌──────────────────────────────────────────────────────────┐
│  HEADER                                                  │
├────────────────────────┬─────────────────────────────────┤
│                        │                                 │
│  Worksheet Settings    │   Preview                       │
│                        │                                 │
│  Subject:  [________]  │   ┌───────────────────────┐     │
│  Grade:    [________]  │   │                       │     │
│  Type:     [________]  │   │  Generated worksheet  │     │
│  # Qs:     [________]  │   │  content appears      │     │
│  Difficulty:[________] │   │  here...              │     │
│  Answer Key: [✓]       │   │                       │     │
│                        │   │                       │     │
│  Content Language:     │   │                       │     │
│   (•) English          │   │                       │     │
│   ( ) Spanish          │   │                       │     │
│                        │   └───────────────────────┘     │
│  [ Generate Worksheet ]│   [ Print ]  [ Download PDF ]   │
│                        │                                 │
├────────────────────────┴─────────────────────────────────┤
│  Footer                                                  │
└──────────────────────────────────────────────────────────┘
```

- **Left panel:** Form with worksheet configuration and content language toggle.
- **Right panel:** Live preview of the generated worksheet with print/download actions.

### 5.4 Worksheet History Page

```
┌──────────────────────────────────────────────────────────┐
│  HEADER                                                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  My Worksheets                         [+ New Worksheet] │
│                                                          │
│  ┌────────┬──────────┬───────┬──────┬────────┬────────┐  │
│  │ Title  │ Subject  │ Grade │ Lang │ Date   │ Actions│  │
│  ├────────┼──────────┼───────┼──────┼────────┼────────┤  │
│  │ Fracs  │ Math     │ 5     │ EN   │ 3/10   │ 👁 🗑  │  │
│  │ Volcan │ Science  │ 7     │ ES   │ 3/09   │ 👁 🗑  │  │
│  └────────┴──────────┴───────┴──────┴────────┴────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 6. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new teacher account |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/worksheets` | List worksheets for logged-in user |
| GET | `/api/worksheets/:id` | Get a single worksheet |
| POST | `/api/worksheets/generate` | Generate a new worksheet via ChatGPT |
| DELETE | `/api/worksheets/:id` | Delete a worksheet |
| PATCH | `/api/users/preferences` | Update user preferences |

---

## 7. ChatGPT Integration

### Prompt Strategy

The backend constructs a prompt from the teacher's selections:

```
You are a worksheet generator for teachers.

Create a {difficulty} {subject} worksheet for grade {grade_level}.
Include {num_questions} {question_type} questions.
Language: {content_language === 'es' ? 'Spanish' : 'English'}.
{include_answer_key ? 'Include an answer key at the end.' : ''}

Format the output in clean HTML suitable for printing.
```

### Implementation Notes

- Use the `gpt-3.5-turbo` model to stay within free-tier limits.
- Set `max_tokens` appropriately (around 1500-2000) to keep responses complete but concise.
- Cache/save every generated worksheet in the database to avoid re-generating.
- Handle rate limiting with a simple queue and user-friendly "please wait" message.

---

## 8. Folder Structure

```
worksheetmaker/
├── client/                    # React frontend
│   ├── public/
│   │   └── locales/
│   │       ├── en/
│   │       │   └── translation.json
│   │       └── es/
│   │           └── translation.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── LanguageToggle.jsx
│   │   │   ├── WorksheetForm.jsx
│   │   │   ├── WorksheetPreview.jsx
│   │   │   └── WorksheetHistory.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── GeneratorPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── i18n.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                    # Express backend
│   ├── db/
│   │   ├── schema.js          # Drizzle schema
│   │   └── worksheetmaker.db  # SQLite database
│   ├── routes/
│   │   ├── auth.js
│   │   └── worksheets.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── services/
│   │   └── chatgpt.js         # OpenAI API wrapper
│   ├── index.js
│   └── package.json
├── PRD.md
└── README.md
```

---

## 9. MVP Scope

For the first release, focus on:

1. User registration and login
2. Worksheet generation form with all configuration options
3. UI language toggle (EN/ES)
4. Content language toggle (EN/ES)
5. Worksheet preview and print
6. Worksheet history (list and view)

### Out of Scope for MVP

- Worksheet editing after generation
- Sharing worksheets between teachers
- Student-facing views
- Multiple AI model options
- Image generation for worksheets
