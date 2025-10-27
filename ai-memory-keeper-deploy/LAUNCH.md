# 🚀 Launch Instructions for AI Voice Receptionist

## Prerequisites Checklist

Before launching, ensure you have:
- ✅ Python 3.8+ installed (Found: Python 3.9.23)
- ✅ Node.js 16+ installed
- ✅ OpenAI API key from https://platform.openai.com/api-keys
- ✅ Frontend built (dist folder created)

## Quick Launch (2 Steps)

### Step 1: Configure Backend

Create the `.env` file with your OpenAI API key:

```bash
cd /vercel/sandbox/ai-memory-keeper-deploy/backend
echo "OPENAI_API_KEY=your_actual_openai_api_key_here" > .env
```

**⚠️ IMPORTANT**: Replace `your_actual_openai_api_key_here` with your real OpenAI API key!

### Step 2: Install Backend Dependencies & Launch

```bash
# Install Python dependencies (if not already installed)
cd /vercel/sandbox/ai-memory-keeper-deploy/backend
pip install -r requirements.txt

# Launch the backend server
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Alternative: Launch with Virtual Environment (Recommended)

```bash
cd /vercel/sandbox/ai-memory-keeper-deploy/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_actual_openai_api_key_here" > .env

# Launch the server
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Accessing the Application

Once the backend is running, you can access the application in two ways:

### Option 1: Using the Built Frontend (Recommended)

Open the built frontend file directly in your browser:
```
file:///vercel/sandbox/ai-memory-keeper-deploy/frontend/dist/index.html
```

Or serve it with a simple HTTP server:
```bash
cd /vercel/sandbox/ai-memory-keeper-deploy/frontend/dist
python3 -m http.server 5173
```
Then open: http://localhost:5173

### Option 2: Development Mode (For Development)

In a separate terminal:
```bash
cd /vercel/sandbox/ai-memory-keeper-deploy/frontend
npm run dev
```
Then open: http://localhost:5173

## Testing the Application

1. **Open the application** in your browser
2. **Allow microphone access** when prompted
3. **Click "Push to Talk"** button
4. **Speak clearly**: Try saying "Hello, how are you today?"
5. **Click "Stop Recording"**
6. **Wait for the AI response** - it will:
   - Transcribe your speech
   - Generate an AI response
   - Speak the response back to you

## API Endpoints

Once running, you can access:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Interactive Swagger UI)
- **API Redoc**: http://localhost:8000/redoc

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is already in use
lsof -i :8000

# Kill the process if needed
kill -9 <PID>
```

### Missing OpenAI API Key
```bash
# Verify .env file exists and has the key
cat /vercel/sandbox/ai-memory-keeper-deploy/backend/.env
```

### Microphone not working
- Check browser permissions (usually a popup or icon in address bar)
- Ensure you're using HTTPS or localhost
- Try a different browser (Chrome/Edge recommended)

### Audio not playing
- Check browser audio permissions
- Verify speakers/headphones are connected
- Check system volume settings

## Cost Considerations

This application uses OpenAI's paid APIs:
- **Whisper API**: ~$0.006 per minute of audio
- **GPT-4**: ~$0.03 per 1K tokens (input) + ~$0.06 per 1K tokens (output)
- **TTS API**: ~$0.015 per 1K characters

**Tip**: For cost optimization, you can change the model from `gpt-4` to `gpt-3.5-turbo` in `backend/main.py`.

## Stopping the Application

Press `Ctrl+C` in the terminal where the backend is running.

## Next Steps

- Customize the receptionist personality in `backend/main.py`
- Change the voice in `frontend/src/App.jsx`
- Deploy to production (see DEPLOYMENT.md)

Enjoy your AI Voice Receptionist! 🎉
