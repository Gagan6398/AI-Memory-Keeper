
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class Memory(BaseModel):
    id: int
    content: str

# In-memory database
memories: List[Memory] = []
next_id = 1

@app.get("/api/memories", response_model=List[Memory])
async def get_memories(search: Optional[str] = None):
    if search:
        return [m for m in memories if search.lower() in m.content.lower()]
    return memories

@app.post("/api/memories", response_model=Memory)
async def create_memory(memory_data: dict):
    global next_id
    memory = Memory(id=next_id, content=memory_data['content'])
    memories.append(memory)
    next_id += 1
    return memory

@app.get("/api/memories/{memory_id}", response_model=Memory)
async def get_memory(memory_id: int):
    for memory in memories:
        if memory.id == memory_id:
            return memory
    raise HTTPException(status_code=404, detail="Memory not found")

@app.put("/api/memories/{memory_id}", response_model=Memory)
async def update_memory(memory_id: int, memory_data: dict):
    for memory in memories:
        if memory.id == memory_id:
            memory.content = memory_data['content']
            return memory
    raise HTTPException(status_code=404, detail="Memory not found")

@app.delete("/api/memories/{memory_id}")
async def delete_memory(memory_id: int):
    global memories
    memory_to_delete = None
    for memory in memories:
        if memory.id == memory_id:
            memory_to_delete = memory
            break
    
    if memory_to_delete:
        memories.remove(memory_to_delete)
        return {"message": "Memory deleted successfully"}
    raise HTTPException(status_code=404, detail="Memory not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
