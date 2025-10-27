import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    setMessages([{
      role: 'assistant',
      content: 'Hello! I\'m your AI voice receptionist. How can I help you today?',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      visualizeAudio();
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Stop visualization
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 255) * 200));
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Convert speech to text
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const transcriptResponse = await axios.post('/api/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const userMessage = transcriptResponse.data.text;
      
      // Add user message to chat
      setMessages(prev => [...prev, {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }]);
      
      // Step 2: Get AI response
      const conversationResponse = await axios.post('/api/conversation', {
        message: userMessage,
        session_id: sessionId
      });
      
      const assistantMessage = conversationResponse.data.response;
      
      // Add assistant message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      }]);
      
      // Step 3: Convert response to speech and play
      await speakText(assistantMessage);
      
    } catch (err) {
      setError('Failed to process audio. Please try again.');
      console.error('Error processing audio:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text) => {
    setIsSpeaking(true);
    
    try {
      const response = await axios.post('/api/text-to-speech', {
        text: text,
        voice: 'alloy'
      }, {
        responseType: 'blob'
      });
      
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (err) {
      setIsSpeaking(false);
      console.error('Error playing audio:', err);
    }
  };

  const resetConversation = async () => {
    try {
      await axios.post(`/api/conversation/reset?session_id=${sessionId}`);
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m your AI voice receptionist. How can I help you today?',
        timestamp: new Date()
      }]);
      setError(null);
    } catch (err) {
      console.error('Error resetting conversation:', err);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>AI Voice Receptionist</h1>
          <p>Speak naturally - I'm here to help</p>
        </div>
      </header>

      <main className="main-content">
        <div className="conversation-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="controls">
            <div className="recording-section">
              {isRecording && (
                <div className="audio-visualizer">
                  <div 
                    className="audio-bar" 
                    style={{ height: `${audioLevel}%` }}
                  />
                </div>
              )}
              
              <button
                className={`record-button ${isRecording ? 'recording' : ''} ${isProcessing || isSpeaking ? 'disabled' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing || isSpeaking}
              >
                <div className="record-icon">
                  {isRecording ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  )}
                </div>
                <span className="record-text">
                  {isRecording ? 'Stop Recording' : isProcessing ? 'Processing...' : isSpeaking ? 'Speaking...' : 'Push to Talk'}
                </span>
              </button>

              {isRecording && (
                <div className="recording-indicator">
                  <span className="pulse"></span>
                  Recording...
                </div>
              )}
            </div>

            <button 
              className="reset-button"
              onClick={resetConversation}
              disabled={isRecording || isProcessing || isSpeaking}
            >
              Reset Conversation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
