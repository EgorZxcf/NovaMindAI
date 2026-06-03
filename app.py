import os
import requests
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

API_KEY = os.getenv("OPENROUTER_API_KEY")

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

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-oss-20b",
        "messages": [
            {
                "role": "user",
                "content": data.message
            }
        ]
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=60
    )

    result = response.json()

    reply = result["choices"][0]["message"]["content"]

    return {"reply": reply}
