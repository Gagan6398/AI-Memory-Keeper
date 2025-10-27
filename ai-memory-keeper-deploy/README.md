# AI Voice Receptionist

A fully functional AI-powered voice receptionist application that uses speech recognition, natural language processing, and text-to-speech to provide an interactive conversational experience.

## Features

- 🎤 **Voice Input**: Record audio directly from your browser
- 🗣️ **Speech-to-Text**: Powered by OpenAI Whisper API for accurate transcription
- 🤖 **AI Conversation**: Intelligent responses using GPT-4
- 🔊 **Text-to-Speech**: Natural voice responses using OpenAI TTS
- 💬 **Conversation History**: View and track your conversation
- 📊 **Audio Visualization**: Real-time audio level visualization
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **OpenAI API**: GPT-4, Whisper, and TTS
- **Python 3.8+**

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **Axios**: HTTP client
- **Web Audio API**: Audio recording and visualization

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- OpenAI API key

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-memory-keeper-deploy
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Build the frontend
npm run build
```

## Configuration

Create a `.env` file in the backend directory with the following:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Production Mode

**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
The built files are in `frontend/dist/` and can be served by any static file server.

## Usage

1. **Open the application** in your web browser
2. **Click "Push to Talk"** button to start recording
3. **Speak your message** clearly into the microphone
4. **Click "Stop Recording"** when finished
5. **Wait for processing**: The app will:
   - Transcribe your speech to text
   - Send it to the AI receptionist
   - Generate a response
   - Speak the response back to you
6. **View conversation history** in the chat interface
7. **Click "Reset Conversation"** to start a new conversation

## API Endpoints

### POST `/api/speech-to-text`
Convert audio to text using Whisper API
- **Input**: Audio file (multipart/form-data)
- **Output**: `{ "text": "transcribed text" }`

### POST `/api/text-to-speech`
Convert text to speech using OpenAI TTS
- **Input**: `{ "text": "text to speak", "voice": "alloy" }`
- **Output**: Audio file (MP3)

### POST `/api/conversation`
Get AI response to user message
- **Input**: `{ "message": "user message", "session_id": "optional_session_id" }`
- **Output**: `{ "response": "ai response", "session_id": "session_id" }`

### POST `/api/conversation/reset`
Reset conversation history
- **Query Param**: `session_id` (optional, default: "default")
- **Output**: `{ "message": "Conversation reset successfully" }`

### GET `/api/conversation/history`
Get conversation history
- **Query Param**: `session_id` (optional, default: "default")
- **Output**: `{ "messages": [...] }`

## Customization

### Change AI Receptionist Personality

Edit the `RECEPTIONIST_PROMPT` in `backend/main.py`:

```python
RECEPTIONIST_PROMPT = """Your custom prompt here..."""
```

### Change Voice

Modify the voice parameter in `frontend/src/App.jsx`:

Available voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

```javascript
const response = await axios.post('/api/text-to-speech', {
  text: text,
  voice: 'nova'  // Change this
});
```

### Adjust AI Model

Change the model in `backend/main.py`:

```python
response = client.chat.completions.create(
    model="gpt-4",  # or "gpt-3.5-turbo" for faster/cheaper responses
    messages=conversations[session_id],
    temperature=0.7,
    max_tokens=150
)
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14.5+)
- Opera: Full support

**Note**: Microphone access requires HTTPS in production (except localhost).

## Troubleshooting

### Microphone not working
- Check browser permissions for microphone access
- Ensure you're using HTTPS (or localhost)
- Try a different browser

### API errors
- Verify your OpenAI API key is correct
- Check your OpenAI account has sufficient credits
- Review the browser console for detailed error messages

### Audio not playing
- Check browser audio permissions
- Ensure speakers/headphones are connected
- Check system volume settings

## Cost Considerations

This application uses OpenAI's paid APIs:
- **Whisper API**: ~$0.006 per minute of audio
- **GPT-4**: ~$0.03 per 1K tokens (input) + ~$0.06 per 1K tokens (output)
- **TTS API**: ~$0.015 per 1K characters

For cost optimization, consider:
- Using GPT-3.5-turbo instead of GPT-4
- Implementing rate limiting
- Adding conversation length limits

## License

MIT License

## Support

For issues and questions, please open an issue on the GitHub repository.
