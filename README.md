# Job Portal Web Application

A full-stack job portal connecting candidates with companies. Built with React and Django, featuring real-time messaging, CV parsing, and a complete candidate profile system.

---

## Project Structure

```
backend-jobportal/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── candidate/         # Candidate section
│   │   │   ├── pages/         # Dashboard, Profile, Jobs, Messages, etc.
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── context/       # Candidate context
│   │   │   ├── services/      # CV parser (PDF + DOCX)
│   │   │   └── hooks/
│   │   ├── company/           # Company section
│   │   ├── api/               # Axios API calls
│   │   └── pages/             # Landing page (PortalSelect)
│   └── package.json
└── server/                    # Django backend
    ├── jobportal/             # Main settings and URLs
    ├── users/                 # Custom User model + JWT auth
    ├── candidate/
    │   └── apps/
    │       ├── profiles/      # Candidate profile, skills, education, experience
    │       ├── applications/  # Job applications
    │       └── saved_jobs/    # Bookmarked jobs
    ├── company/
    │   └── apps/
    │       ├── profiles/      # Company profile and reviews
    │       ├── jobs/          # Job listings and categories
    │       └── interviews/    # Interview scheduling
    ├── messaging/             # Real-time chat (Django Channels + WebSocket)
    ├── notifications/         # In-app notifications
    ├── manage.py
    └── requirements.txt
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Django 6, Django REST Framework |
| Database | PostgreSQL |
| Auth | JWT (djangorestframework-simplejwt) |
| Real-Time | Django Channels + Redis (WebSocket) |
| File Storage | Cloudinary |
| CV Parsing | pdfjs-dist + mammoth (browser-side) |
| Task Queue | Celery + Redis |

---

## Features

### Candidate Section
- 5-step profile onboarding wizard
- CV upload and auto-parse (PDF and DOCX)
- Profile management (education, experience, skills)
- Browse and filter job listings
- Save and unsave jobs
- Apply to jobs with cover letter
- Track application status
- Real-time messaging with companies
- In-app notifications

### Company Section
- Company profile management
- Post and manage job listings
- Review applications
- Interview scheduling
- Real-time messaging with candidates

---

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL
- Redis (via WSL on Windows or native on Linux/Mac)

---

### Backend Setup

```bash
# Go to server folder
cd server

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your credentials
# See .env.example for required variables

# Run migrations
python manage.py migrate

# Start Redis (WSL on Windows)
# Open Ubuntu terminal and run:
# sudo service redis-server start

# Start server with WebSocket support
$env:DJANGO_SETTINGS_MODULE="jobportal.settings"
daphne -p 8000 jobportal.asgi:application
```

---

### Frontend Setup

```bash
# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

---

### Environment Variables

Create a `.env` file inside the `server/` folder:

```
SECRET_KEY=your_django_secret_key
DEBUG=True

DB_NAME=jobportal_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register/ | Create account |
| POST | /api/auth/login/ | Get JWT token |
| POST | /api/auth/token/refresh/ | Refresh token |

### Candidate
| Method | Endpoint | Description |
|---|---|---|
| GET/POST/PUT | /api/candidates/profile/ | Candidate profile |
| POST | /api/candidates/resume-upload/ | Upload resume |
| GET | /api/candidates/saved-jobs/ | List saved jobs |
| POST/DELETE | /api/candidates/save-job/\<id\>/ | Save or unsave job |
| GET/POST | /api/candidates/applications/ | List or submit applications |
| DELETE | /api/candidates/applications/\<id\>/ | Withdraw application |
| POST/DELETE | /api/candidates/skills/ | Add or remove skills |
| POST/DELETE | /api/candidates/education/ | Add or remove education |
| POST/DELETE | /api/candidates/experience/ | Add or remove experience |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/jobs/ | Browse all open jobs |
| GET | /api/jobs/\<id\>/ | Job detail |

### Messaging
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/conversations/ | List conversations |
| GET | /api/conversations/\<id\>/messages/ | Get messages |
| PUT | /api/conversations/\<id\>/read/ | Mark as read |
| WS | ws://host/ws/chat/\<id\>/?token=\<jwt\> | WebSocket chat |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/notifications/ | List notifications |
| PUT | /api/notifications/\<id\>/read/ | Mark one as read |
| PUT | /api/notifications/read-all/ | Mark all as read |

---

## Notes

- This is a **sub-application**. Authentication is handled by the parent application which passes a JWT token to this app.
- CV parsing runs entirely in the browser — no file is sent to the server during parsing.
- WebSocket connections are authenticated via JWT token passed as a query parameter.

---

## Contact

**Navaneeth KV**
Taliparamba, Kerala
navaneethkv1002@gmail.com
https://github.com/Navaneeth223