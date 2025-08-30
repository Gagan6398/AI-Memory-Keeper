
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await axios.get(`/api/memories?search=${searchTerm}`);
      setMemories(response.data);
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  const handleSearch = () => {
    fetchMemories();
  };

  const handleCreateMemory = async () => {
    if (!newMemory.trim()) return;
    try {
      await axios.post('/api/memories', { content: newMemory });
      setNewMemory('');
      fetchMemories();
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  const handleDeleteMemory = async (id) => {
    try {
      await axios.delete(`/api/memories/${id}`);
      fetchMemories();
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  return (
    <div className="App">
      <h1>AI Memory Keeper</h1>
      <div className="controls">
        <input
          type="text"
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button onClick={handleCreateMemory}>Add Memory</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search memories..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="memories-list">
        {memories.map((memory) => (
          <div key={memory.id} className="memory-item">
            <p>{memory.content}</p>
            <button onClick={() => handleDeleteMemory(memory.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
