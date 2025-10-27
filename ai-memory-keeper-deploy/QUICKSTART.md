# Quick Start Guide

Get your AI Voice Receptionist up and running in 5 minutes!

## Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)

## Step 2: Setup Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_actual_api_key_here" > .env
```

**Important**: Replace `your_actual_api_key_here` with your real OpenAI API key!

## Step 3: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

## Step 4: Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 5: Use the App

1. Open your browser to http://localhost:5173
2. Click "Push to Talk"
3. Say something like "Hello, how are you?"
4. Click "Stop Recording"
5. Wait for the AI to respond!

## Tips

- **Speak clearly** for best transcription results
- **Keep messages concise** to save on API costs
- **Use headphones** to prevent audio feedback
- **Check your microphone** permissions in the browser

## Troubleshooting

### "Failed to access microphone"
- Allow microphone permissions in your browser
- Check system microphone settings

### "Error processing audio"
- Verify your OpenAI API key is correct
- Check you have credits in your OpenAI account
- Look at the terminal for detailed error messages

### Backend won't start
- Make sure port 8000 is not in use
- Verify all dependencies installed correctly
- Check Python version is 3.8+

### Frontend won't start
- Make sure port 5173 is not in use
- Try deleting `node_modules` and running `npm install` again
- Check Node.js version is 16+

## What's Next?

- Customize the receptionist personality in `backend/main.py`
- Change the voice in `frontend/src/App.jsx`
- Add your own features!

Enjoy your AI Voice Receptionist! 🎉
