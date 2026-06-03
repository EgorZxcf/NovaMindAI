import os
import requests
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

API_KEY = os.getenv("OPENROUTER_API_KEY")

class Message(BaseModel):
    message: str

@app.get("/")
def home():
    return {"status": "NovaMind AI Online"}

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
