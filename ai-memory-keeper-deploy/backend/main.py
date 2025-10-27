from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import openai
from openai import OpenAI
import io
import tempfile

load_dotenv()

app = FastAPI()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Conversation history storage
conversations = {}

class Message(BaseModel):
    role: str
    content: str

class ConversationRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ConversationResponse(BaseModel):
    response: str
    session_id: str

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "alloy"

# System prompt for the receptionist
RECEPTIONIST_PROMPT = """You are a professional and friendly AI voice receptionist. Your role is to:
- Greet callers warmly and professionally
- Answer questions about the company or service
- Take messages and schedule appointments
- Provide helpful information
- Be concise but thorough in your responses
- Maintain a professional yet approachable tone

Keep your responses conversational and natural, as they will be spoken aloud."""

@app.get("/")
async def root():
    return {"message": "AI Voice Receptionist API"}

@app.post("/api/speech-to-text")
async def speech_to_text(audio: UploadFile = File(...)):
    """Convert speech audio to text using OpenAI Whisper"""
    try:
        # Read the uploaded audio file
        audio_data = await audio.read()
        
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
            temp_audio.write(audio_data)
            temp_audio_path = temp_audio.name
        
        try:
            # Use OpenAI Whisper API for transcription
            with open(temp_audio_path, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="text"
                )
            
            return {"text": transcript}
        finally:
            # Clean up temporary file
            if os.path.exists(temp_audio_path):
                os.unlink(temp_audio_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error transcribing audio: {str(e)}")

@app.post("/api/text-to-speech")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech using OpenAI TTS"""
    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice=request.voice,
            input=request.text
        )
        
        # Convert response to bytes
        audio_bytes = io.BytesIO(response.content)
        
        return StreamingResponse(
            audio_bytes,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=speech.mp3"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating speech: {str(e)}")

@app.post("/api/conversation", response_model=ConversationResponse)
async def conversation(request: ConversationRequest):
    """Handle conversation with the AI receptionist"""
    try:
        session_id = request.session_id
        
        # Initialize conversation history if not exists
        if session_id not in conversations:
            conversations[session_id] = [
                {"role": "system", "content": RECEPTIONIST_PROMPT}
            ]
        
        # Add user message to history
        conversations[session_id].append({
            "role": "user",
            "content": request.message
        })
        
        # Get AI response
        response = client.chat.completions.create(
            model="gpt-4",
            messages=conversations[session_id],
            temperature=0.7,
            max_tokens=150
        )
        
        assistant_message = response.choices[0].message.content
        
        # Add assistant response to history
        conversations[session_id].append({
            "role": "assistant",
            "content": assistant_message
        })
        
        # Keep conversation history manageable (last 20 messages + system prompt)
        if len(conversations[session_id]) > 21:
            conversations[session_id] = [conversations[session_id][0]] + conversations[session_id][-20:]
        
        return ConversationResponse(
            response=assistant_message,
            session_id=session_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in conversation: {str(e)}")

@app.post("/api/conversation/reset")
async def reset_conversation(session_id: str = "default"):
    """Reset conversation history for a session"""
    if session_id in conversations:
        del conversations[session_id]
    return {"message": "Conversation reset successfully"}

@app.get("/api/conversation/history")
async def get_conversation_history(session_id: str = "default"):
    """Get conversation history for a session"""
    if session_id not in conversations:
        return {"messages": []}
    
    # Return all messages except the system prompt
    return {"messages": conversations[session_id][1:]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
