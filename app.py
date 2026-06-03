import os
import requests
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

API_KEY = os.getenv("OPENROUTER_API_KEY")

SYSTEM_PROMPT = {
    "role": "system",
    "content": "Ты NovaMind AI, полезный и умный ИИ-помощник."
}

chat_history = [SYSTEM_PROMPT]

class Message(BaseModel):
    message: str
    model: str

@app.get("/")
def home():
    return FileResponse("index.html")

@app.get("/style.css")
def style():
    return FileResponse("style.css")

@app.get("/script.js")
def script():
    return FileResponse("script.js")

@app.post("/new_chat")
def new_chat():

    global chat_history

    chat_history = [SYSTEM_PROMPT]

    return {"status":"ok"}

@app.post("/chat")
def chat(data: Message):

    global chat_history

    chat_history.append({
        "role":"user",
        "content":data.message
    })

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization":f"Bearer {API_KEY}",
            "Content-Type":"application/json"
        },
        json={
            "model":data.model,
            "messages":chat_history
        },
        timeout=60
    )

    result = response.json()

    reply = result["choices"][0]["message"]["content"]

    chat_history.append({
        "role":"assistant",
        "content":reply
    })

    return {"reply":reply}
