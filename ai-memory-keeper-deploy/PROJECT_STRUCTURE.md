# Project Structure

Visual representation of the AI Voice Receptionist project structure.

## 📁 Complete Directory Tree

```
ai-memory-keeper-deploy/
│
├── 📄 Documentation Files (Root Level)
│   ├── README.md                    # Main documentation (start here!)
│   ├── QUICKSTART.md                # 5-minute setup guide
│   ├── PROJECT_SUMMARY.md           # Project overview
│   ├── FEATURES.md                  # Feature documentation
│   ├── API.md                       # API reference
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── DEMO_GUIDE.md                # Demo instructions
│   ├── INDEX.md                     # Documentation index
│   ├── PROJECT_STRUCTURE.md         # This file
│   └── COMPLETION_SUMMARY.md        # Project completion summary
│
├── ⚙️ Configuration Files
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore                   # Git ignore rules
│   └── render.yaml                  # Render.com deployment config
│
├── 🔄 CI/CD
│   └── .github/
│       └── workflows/
│           └── deploy.yml           # GitHub Actions workflow
│
├── 🐍 Backend (Python/FastAPI)
│   └── backend/
│       ├── main.py                  # FastAPI application (180 lines)
│       │   ├── Speech-to-text endpoint
│       │   ├── Text-to-speech endpoint
│       │   ├── Conversation endpoint
│       │   ├── History management
│       │   └── Session handling
│       │
│       └── requirements.txt         # Python dependencies
│           ├── fastapi
│           ├── uvicorn
│           ├── openai
│           ├── python-multipart
│           ├── aiofiles
│           ├── python-dotenv
│           └── pydantic
│
└── ⚛️ Frontend (React/Vite)
    └── frontend/
        ├── 📄 HTML
        │   └── index.html           # HTML template
        │
        ├── 📦 Configuration
        │   ├── package.json         # Node dependencies & scripts
        │   ├── package-lock.json    # Dependency lock file
        │   ├── vite.config.js       # Vite configuration
        │   └── vercel.json          # Vercel deployment config
        │
        ├── 💻 Source Code
        │   └── src/
        │       ├── main.jsx         # React entry point
        │       ├── App.jsx          # Main component (350 lines)
        │       │   ├── Voice recording
        │       │   ├── Audio visualization
        │       │   ├── Conversation display
        │       │   ├── API integration
        │       │   └── State management
        │       │
        │       ├── App.css          # Component styles (400 lines)
        │       │   ├── Modern gradient design
        │       │   ├── Responsive layout
        │       │   ├── Smooth animations
        │       │   └── Professional appearance
        │       │
        │       └── index.css        # Global styles
        │
        └── 📁 Build Output (generated)
            └── dist/                # Production build
                ├── index.html
                └── assets/
                    ├── index-*.js
                    └── index-*.css
```

## 📊 File Statistics

### By Type

| Type | Count | Total Lines |
|------|-------|-------------|
| Documentation (`.md`) | 10 | ~3,000 |
| Python (`.py`) | 1 | ~180 |
| JavaScript (`.jsx`, `.js`) | 3 | ~350 |
| CSS (`.css`) | 2 | ~400 |
| HTML (`.html`) | 1 | ~15 |
| Config (`.json`, `.yaml`, `.yml`) | 5 | ~100 |
| **Total** | **22** | **~4,045** |

### By Category

| Category | Files | Purpose |
|----------|-------|---------|
| Documentation | 10 | User guides, API docs, deployment |
| Backend Code | 2 | FastAPI application |
| Frontend Code | 6 | React application |
| Configuration | 4 | Environment, deployment, build |
| **Total** | **22** | **Complete application** |

## 🗂️ File Descriptions

### Root Level Documentation

#### README.md (400 lines)
- **Purpose**: Main project documentation
- **Contains**: Features, installation, usage, API, troubleshooting
- **Audience**: Everyone

#### QUICKSTART.md (150 lines)
- **Purpose**: Fast setup guide
- **Contains**: 5-step setup, quick troubleshooting
- **Audience**: Developers wanting quick start

#### PROJECT_SUMMARY.md (350 lines)
- **Purpose**: High-level overview
- **Contains**: Architecture, tech stack, metrics
- **Audience**: Managers, stakeholders

#### FEATURES.md (500 lines)
- **Purpose**: Feature documentation
- **Contains**: Core features, use cases, roadmap
- **Audience**: Product managers, users

#### API.md (600 lines)
- **Purpose**: API reference
- **Contains**: All endpoints, examples, SDKs
- **Audience**: Developers integrating API

#### DEPLOYMENT.md (450 lines)
- **Purpose**: Deployment instructions
- **Contains**: Multiple platform guides
- **Audience**: DevOps engineers

#### DEMO_GUIDE.md (550 lines)
- **Purpose**: Demo instructions
- **Contains**: Demo script, Q&A, presentation tips
- **Audience**: Sales, presenters

#### INDEX.md (300 lines)
- **Purpose**: Documentation navigation
- **Contains**: Guide to all documentation
- **Audience**: All users

#### PROJECT_STRUCTURE.md (This file)
- **Purpose**: Project structure overview
- **Contains**: File tree, descriptions
- **Audience**: Developers, contributors

#### COMPLETION_SUMMARY.md (400 lines)
- **Purpose**: Project completion overview
- **Contains**: What was built, statistics
- **Audience**: Project reviewers

### Configuration Files

#### .env.example
```env
OPENAI_API_KEY=your_openai_api_key_here
VITE_API_BASE_URL=http://localhost:8000
```

#### render.yaml
- Render.com deployment configuration
- Defines backend service
- Environment variables
- Build commands

#### .gitignore
- Excludes node_modules, dist, venv
- Excludes .env files
- Excludes build artifacts

### Backend Files

#### backend/main.py (180 lines)
```python
# Main FastAPI application
- 6 API endpoints
- OpenAI integration
- Session management
- Error handling
```

**Endpoints**:
1. `GET /` - Health check
2. `POST /api/speech-to-text` - Audio → Text
3. `POST /api/text-to-speech` - Text → Audio
4. `POST /api/conversation` - Get AI response
5. `POST /api/conversation/reset` - Clear history
6. `GET /api/conversation/history` - Get messages

#### backend/requirements.txt
```txt
fastapi          # Web framework
uvicorn          # ASGI server
openai           # OpenAI API client
python-multipart # File upload support
aiofiles         # Async file operations
python-dotenv    # Environment variables
pydantic         # Data validation
```

### Frontend Files

#### frontend/index.html (15 lines)
- HTML template
- Loads React app
- Meta tags for responsive design

#### frontend/package.json
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "vite": "^7.1.3",
    "@vitejs/plugin-react": "^4.0.3"
  }
}
```

#### frontend/src/main.jsx (10 lines)
- React entry point
- Renders App component
- Strict mode enabled

#### frontend/src/App.jsx (350 lines)
```javascript
// Main React component
- Voice recording logic
- Audio visualization
- Conversation display
- API integration
- State management (8 hooks)
```

**Key Functions**:
- `startRecording()` - Begin audio capture
- `stopRecording()` - End audio capture
- `processAudio()` - Send to backend
- `speakText()` - Play TTS audio
- `resetConversation()` - Clear history

#### frontend/src/App.css (400 lines)
```css
/* Modern styling */
- Purple gradient theme
- Responsive layout
- Smooth animations
- Professional design
- Mobile-first approach
```

**Key Styles**:
- `.app` - Main container
- `.conversation-container` - Chat area
- `.message` - Message bubbles
- `.record-button` - Push-to-talk button
- `.audio-visualizer` - Audio levels

#### frontend/src/index.css (50 lines)
- Global styles
- Font configuration
- Base reset

## 🔄 Data Flow

```
User Interface (App.jsx)
        ↓
    Recording
        ↓
    Audio Blob
        ↓
Backend API (main.py)
        ↓
OpenAI Whisper API
        ↓
    Text
        ↓
Backend API (main.py)
        ↓
OpenAI GPT-4 API
        ↓
    Response
        ↓
Backend API (main.py)
        ↓
OpenAI TTS API
        ↓
    Audio
        ↓
User Interface (App.jsx)
        ↓
    Playback
```

## 📦 Dependencies

### Backend Dependencies
```
fastapi==0.104.1
uvicorn==0.24.0
openai==1.3.0
python-multipart==0.0.6
aiofiles==23.2.1
python-dotenv==1.0.0
pydantic==2.5.0
```

### Frontend Dependencies
```
react@18.2.0
react-dom@18.2.0
axios@1.4.0
vite@7.1.3
@vitejs/plugin-react@4.0.3
```

## 🚀 Build Process

### Backend
```bash
# No build step required
# Python runs directly
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
# Development
npm install
npm run dev

# Production
npm run build
# Output: dist/
```

## 📁 Generated Directories (Not in Git)

```
backend/
└── venv/              # Python virtual environment
    └── lib/
        └── python3.x/
            └── site-packages/

frontend/
├── node_modules/      # Node dependencies
│   └── (289 packages)
│
└── dist/              # Production build
    ├── index.html
    └── assets/
        ├── index-[hash].js
        └── index-[hash].css
```

## 🔐 Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=sk-...    # Required
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000    # Optional
```

## 📊 Code Metrics

### Backend (main.py)
- **Lines**: 180
- **Functions**: 7
- **Endpoints**: 6
- **Classes**: 4 (Pydantic models)
- **Imports**: 10

### Frontend (App.jsx)
- **Lines**: 350
- **Components**: 1
- **Hooks**: 8
- **Functions**: 7
- **API Calls**: 4

### Styling (App.css)
- **Lines**: 400
- **Classes**: 30+
- **Animations**: 3
- **Media Queries**: 1

## 🎯 Entry Points

### Development
- **Backend**: `uvicorn main:app --reload`
- **Frontend**: `npm run dev`

### Production
- **Backend**: `uvicorn main:app --host 0.0.0.0 --port 8000`
- **Frontend**: Serve `dist/` directory

## 🔍 Important Paths

### Configuration
- Backend config: `backend/main.py` (lines 1-20)
- Frontend config: `frontend/vite.config.js`
- Environment: `.env.example`

### Core Logic
- Voice recording: `frontend/src/App.jsx` (lines 50-100)
- API endpoints: `backend/main.py` (lines 40-180)
- Styling: `frontend/src/App.css`

### Documentation
- Start here: `README.md`
- Quick setup: `QUICKSTART.md`
- API reference: `API.md`

## 📝 Notes

### What's Included
✅ Complete source code
✅ Comprehensive documentation
✅ Configuration files
✅ Deployment configs
✅ Example environment variables

### What's Not Included (Generated)
❌ node_modules/ (run `npm install`)
❌ venv/ (run `python -m venv venv`)
❌ dist/ (run `npm run build`)
❌ .env (copy from .env.example)

### What's Ignored (.gitignore)
- node_modules/
- dist/
- venv/
- __pycache__/
- .env
- *.pyc
- .DS_Store

## 🎉 Summary

**Total Project Size**: ~4,000 lines of code + documentation
**Files**: 22 source files
**Documentation**: 10 comprehensive guides
**Ready to**: Run, deploy, customize, extend

---

**Last Updated**: 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete
