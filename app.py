import os
import base64
import requests
import json

try:
    with open("memory.json", "r") as f:
        chat_memory = json.load(f)
except:
    chat_memory = []

from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import FileResponse

app = FastAPI()

API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.get("/")
def home():
    return FileResponse("index.html")

@app.get("/style.css")
def style():
    return FileResponse("style.css")

@app.get("/script.js")
def script():
    return FileResponse("script.js")
@app.get("/manifest.json")
def manifest():
    return FileResponse("manifest.json")

@app.get("/sw.js")
def service_worker():
    return FileResponse("sw.js")

@app.get("/icon-192.png")
def icon192():
    return FileResponse("icon-192.png")

@app.get("/icon-512.png")
def icon512():
    return FileResponse("icon-512.png")
@app.post("/chat")
async def chat(request: Request):

    data = await request.json()

    message = data.get("message", "")
    model = data.get(
        "model",
        "openai/gpt-oss-20b"
    )
    chat_memory.append({
        "role": "user",
        "content": message
    })

    chat_memory[:] = chat_memory[-20:]

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": model,
              "max_tokens": 1000,
            "messages": chat_memory
        },
        timeout=120
    )

    result = response.json()

    if "choices" not in result:
        return {
            "reply": f"OpenRouter Error: {result}"
        }

    ai_reply = result["choices"][0]["message"]["content"]

    chat_memory.append({
        "role": "assistant",
        "content": ai_reply
    })

    chat_memory[:] = chat_memory[-20:]
    with open("memory.json", "w") as f:
        json.dump(
            chat_memory,
            f,
            ensure_ascii=False,
            indent=2
        )

    return {
        "reply": ai_reply
    }

@app.post("/analyze_image")
async def analyze_image(
    image: UploadFile = File(...),
    question: str = Form(
        "Что изображено на картинке?"
    )
):

    image_bytes = await image.read()

    image_base64 = base64.b64encode(
        image_bytes
    ).decode()

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "google/gemini-2.5-flash",
            "max_tokens": 1000,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": question
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ]
        },
        timeout=120
    )

    result = response.json()

    if "choices" not in result:
        return {
            "reply": f"OpenRouter Error: {result}"
        }

    return {
        "reply":
        result["choices"][0]["message"]["content"]
    }

@app.get("/manifest.json")
def manifest():
    return FileResponse(
        "manifest.json",
        media_type="application/manifest+json"
    )

@app.get("/sw.js")
def service_worker():
    return FileResponse(
        "sw.js",
        media_type="application/javascript"
    )


@app.post("/clear_memory")
def clear_memory():
    global chat_memory

    chat_memory = []

    with open("memory.json", "w") as f:
        json.dump([], f)

    return {
        "status": "ok"
    }

