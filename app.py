import os
import requests
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

API_KEY = os.getenv("OPENROUTER_API_KEY")

chat_history = [
    {
        "role": "system",
        "content": "Ты NovaMind AI, полезный и умный ИИ-помощник."
    }
]

class Message(BaseModel):
    message: str

@app.get("/")
def home():
    return FileResponse("index.html")

@app.get("/style.css")
def style():
    return FileResponse("style.css")

@app.get("/script.js")
def script():
    return FileResponse("script.js")

@app.post("/chat")
def chat(data: Message):

    global chat_history

    chat_history.append({
        "role": "user",
        "content": data.message
    })

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-oss-20b",
        "messages": chat_history
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=60
    )

    result = response.json()

    reply = result["choices"][0]["message"]["content"]

    chat_history.append({
        "role": "assistant",
        "content": reply
    })

    if len(chat_history) > 20:
        chat_history = [chat_history[0]] + chat_history[-19:]

    return {
        "reply": reply
    }
