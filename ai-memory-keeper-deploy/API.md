# API Documentation

Complete API reference for the AI Voice Receptionist backend.

## Base URL

**Development**: `http://localhost:8000`  
**Production**: Your deployed backend URL

## Authentication

Currently, the API does not require authentication. The OpenAI API key is stored securely on the backend.

For production use, consider implementing:
- API key authentication
- JWT tokens
- OAuth 2.0

---

## Endpoints

### 1. Root Endpoint

**GET** `/`

Health check endpoint.

#### Response
```json
{
  "message": "AI Voice Receptionist API"
}
```

#### Example
```bash
curl http://localhost:8000/
```

---

### 2. Speech to Text

**POST** `/api/speech-to-text`

Convert audio to text using OpenAI Whisper API.

#### Request

**Content-Type**: `multipart/form-data`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| audio | File | Yes | Audio file (webm, mp3, wav, etc.) |

#### Response

**Status**: 200 OK

```json
{
  "text": "Hello, how can I help you today?"
}
```

#### Error Response

**Status**: 500 Internal Server Error

```json
{
  "detail": "Error transcribing audio: [error message]"
}
```

#### Example

**JavaScript (Axios)**
```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');

const response = await axios.post('/api/speech-to-text', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

console.log(response.data.text);
```

**cURL**
```bash
curl -X POST http://localhost:8000/api/speech-to-text \
  -F "audio=@recording.webm"
```

**Python**
```python
import requests

with open('recording.webm', 'rb') as audio_file:
    files = {'audio': audio_file}
    response = requests.post('http://localhost:8000/api/speech-to-text', files=files)
    print(response.json()['text'])
```

---

### 3. Text to Speech

**POST** `/api/text-to-speech`

Convert text to speech using OpenAI TTS API.

#### Request

**Content-Type**: `application/json`

```json
{
  "text": "Hello, how can I help you?",
  "voice": "alloy"
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| text | string | Yes | - | Text to convert to speech |
| voice | string | No | "alloy" | Voice to use (alloy, echo, fable, onyx, nova, shimmer) |

#### Response

**Status**: 200 OK  
**Content-Type**: `audio/mpeg`

Returns an MP3 audio file.

#### Error Response

**Status**: 500 Internal Server Error

```json
{
  "detail": "Error generating speech: [error message]"
}
```

#### Example

**JavaScript (Axios)**
```javascript
const response = await axios.post('/api/text-to-speech', {
  text: 'Hello, how can I help you?',
  voice: 'alloy'
}, {
  responseType: 'blob'
});

const audioUrl = URL.createObjectURL(response.data);
const audio = new Audio(audioUrl);
audio.play();
```

**cURL**
```bash
curl -X POST http://localhost:8000/api/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how can I help you?", "voice": "alloy"}' \
  --output speech.mp3
```

**Python**
```python
import requests

response = requests.post('http://localhost:8000/api/text-to-speech', json={
    'text': 'Hello, how can I help you?',
    'voice': 'alloy'
})

with open('speech.mp3', 'wb') as f:
    f.write(response.content)
```

#### Available Voices

| Voice | Description |
|-------|-------------|
| alloy | Neutral, balanced voice |
| echo | Clear, professional voice |
| fable | Warm, expressive voice |
| onyx | Deep, authoritative voice |
| nova | Friendly, energetic voice |
| shimmer | Soft, gentle voice |

---

### 4. Conversation

**POST** `/api/conversation`

Get AI response to user message.

#### Request

**Content-Type**: `application/json`

```json
{
  "message": "What are your business hours?",
  "session_id": "user_123"
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| message | string | Yes | - | User's message |
| session_id | string | No | "default" | Session identifier for conversation context |

#### Response

**Status**: 200 OK

```json
{
  "response": "Our business hours are Monday through Friday, 9 AM to 5 PM.",
  "session_id": "user_123"
}
```

| Field | Type | Description |
|-------|------|-------------|
| response | string | AI's response message |
| session_id | string | Session identifier used |

#### Error Response

**Status**: 500 Internal Server Error

```json
{
  "detail": "Error in conversation: [error message]"
}
```

#### Example

**JavaScript (Axios)**
```javascript
const response = await axios.post('/api/conversation', {
  message: 'What are your business hours?',
  session_id: 'user_123'
});

console.log(response.data.response);
```

**cURL**
```bash
curl -X POST http://localhost:8000/api/conversation \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your business hours?", "session_id": "user_123"}'
```

**Python**
```python
import requests

response = requests.post('http://localhost:8000/api/conversation', json={
    'message': 'What are your business hours?',
    'session_id': 'user_123'
})

print(response.json()['response'])
```

---

### 5. Reset Conversation

**POST** `/api/conversation/reset`

Reset conversation history for a session.

#### Request

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| session_id | string | No | "default" | Session identifier to reset |

#### Response

**Status**: 200 OK

```json
{
  "message": "Conversation reset successfully"
}
```

#### Example

**JavaScript (Axios)**
```javascript
await axios.post('/api/conversation/reset?session_id=user_123');
```

**cURL**
```bash
curl -X POST "http://localhost:8000/api/conversation/reset?session_id=user_123"
```

**Python**
```python
import requests

response = requests.post('http://localhost:8000/api/conversation/reset', 
                        params={'session_id': 'user_123'})
print(response.json())
```

---

### 6. Get Conversation History

**GET** `/api/conversation/history`

Retrieve conversation history for a session.

#### Request

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| session_id | string | No | "default" | Session identifier |

#### Response

**Status**: 200 OK

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    }
  ]
}
```

#### Example

**JavaScript (Axios)**
```javascript
const response = await axios.get('/api/conversation/history?session_id=user_123');
console.log(response.data.messages);
```

**cURL**
```bash
curl "http://localhost:8000/api/conversation/history?session_id=user_123"
```

**Python**
```python
import requests

response = requests.get('http://localhost:8000/api/conversation/history',
                       params={'session_id': 'user_123'})
print(response.json()['messages'])
```

---

## Error Handling

All endpoints return standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider:

- Implementing rate limiting per IP/session
- Using Redis for distributed rate limiting
- Setting up API quotas per user

**Example with FastAPI**:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/conversation")
@limiter.limit("10/minute")
async def conversation(request: Request, ...):
    ...
```

---

## CORS Configuration

The API should be configured to accept requests from your frontend domain.

**Example Configuration**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## WebSocket Support (Future)

For real-time streaming, consider implementing WebSocket endpoints:

```python
@app.websocket("/ws/conversation")
async def websocket_conversation(websocket: WebSocket):
    await websocket.accept()
    # Handle real-time conversation
```

---

## API Testing

### Using Swagger UI

FastAPI automatically generates interactive API documentation:

**URL**: `http://localhost:8000/docs`

Features:
- Try out endpoints directly
- View request/response schemas
- See example values

### Using ReDoc

Alternative documentation interface:

**URL**: `http://localhost:8000/redoc`

---

## SDK Examples

### JavaScript/TypeScript SDK

```typescript
class VoiceReceptionistAPI {
  constructor(private baseURL: string) {}

  async speechToText(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await fetch(`${this.baseURL}/api/speech-to-text`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.text;
  }

  async textToSpeech(text: string, voice: string = 'alloy'): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/text-to-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice })
    });
    
    return await response.blob();
  }

  async sendMessage(message: string, sessionId: string = 'default'): Promise<string> {
    const response = await fetch(`${this.baseURL}/api/conversation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId })
    });
    
    const data = await response.json();
    return data.response;
  }
}

// Usage
const api = new VoiceReceptionistAPI('http://localhost:8000');
const response = await api.sendMessage('Hello!');
```

### Python SDK

```python
import requests
from typing import Optional

class VoiceReceptionistAPI:
    def __init__(self, base_url: str):
        self.base_url = base_url
    
    def speech_to_text(self, audio_file_path: str) -> str:
        with open(audio_file_path, 'rb') as f:
            files = {'audio': f}
            response = requests.post(f'{self.base_url}/api/speech-to-text', files=files)
            return response.json()['text']
    
    def text_to_speech(self, text: str, voice: str = 'alloy') -> bytes:
        response = requests.post(
            f'{self.base_url}/api/text-to-speech',
            json={'text': text, 'voice': voice}
        )
        return response.content
    
    def send_message(self, message: str, session_id: str = 'default') -> str:
        response = requests.post(
            f'{self.base_url}/api/conversation',
            json={'message': message, 'session_id': session_id}
        )
        return response.json()['response']

# Usage
api = VoiceReceptionistAPI('http://localhost:8000')
response = api.send_message('Hello!')
print(response)
```

---

## Performance Considerations

### Response Times

Typical response times:
- Speech-to-Text: 1-3 seconds (depends on audio length)
- Conversation: 2-5 seconds (depends on GPT-4 response)
- Text-to-Speech: 1-2 seconds (depends on text length)

### Optimization Tips

1. **Caching**: Cache common responses
2. **Async Processing**: Use background tasks for long operations
3. **Connection Pooling**: Reuse HTTP connections
4. **Compression**: Enable gzip compression
5. **CDN**: Use CDN for static assets

---

## Security Best Practices

1. **API Key Protection**: Never expose OpenAI API key to frontend
2. **Input Validation**: Validate all user inputs
3. **Rate Limiting**: Prevent abuse
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Restrict to known domains
6. **Logging**: Log all API calls for monitoring
7. **Error Messages**: Don't leak sensitive information

---

## Monitoring & Analytics

Consider tracking:
- API call volume
- Response times
- Error rates
- User sessions
- Token usage (OpenAI)
- Cost per interaction

**Tools**:
- Prometheus + Grafana
- DataDog
- New Relic
- Sentry (error tracking)

---

## Support

For API issues:
1. Check the Swagger docs at `/docs`
2. Review error messages in response
3. Check backend logs
4. Verify OpenAI API key is valid
5. Ensure sufficient OpenAI credits

---

**API Version**: 1.0.0  
**Last Updated**: 2025
