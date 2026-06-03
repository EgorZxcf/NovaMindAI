from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    message: str

@app.get("/")
def home():
    return {"status": "NovaMind AI Online"}

@app.post("/chat")
def chat(data: Message):
    return {"reply": f"Вы написали: {data.message}"}
