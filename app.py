import os
import base64
import requests

from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File
from fastapi import Form

from fastapi.responses import FileResponse

app = FastAPI()

API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

@app.get("/")
def home():
    return FileResponse(
        "index.html"
    )

@app.get("/style.css")
def style():
    return FileResponse(
        "style.css"
    )

@app.get("/script.js")
def script():
    return FileResponse(
        "script.js"
    )

@app.post("/analyze_image")
async def analyze_image(

    image: UploadFile = File(...),

    question: str = Form(
        "Что изображено на картинке?"
    )

):

    image_bytes =
    await image.read()

    image_base64 =
    base64.b64encode(
        image_bytes
    ).decode()

    response =
    requests.post(

        "https://openrouter.ai/api/v1/chat/completions",

        headers={
            "Authorization":
            f"Bearer {API_KEY}",
            "Content-Type":
            "application/json"
        },

        json={

            "model":
            "google/gemini-2.5-flash-image-preview",

            "messages":[
                {
                    "role":"user",
                    "content":[

                        {
                            "type":"text",
                            "text":question
                        },

                        {
                            "type":"image_url",
                            "image_url":{
                                "url":
                                f"data:image/jpeg;base64,{image_base64}"
                            }
                        }

                    ]
                }
            ]
        },

        timeout=120
    )

    result =
    response.json()

    answer =
    result["choices"][0]["message"]["content"]

    return {
        "reply":answer
    }
