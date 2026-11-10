from fastapi import APIRouter
from .schemas import chat_payload

ai_agent_router = APIRouter(prefix = "/ai_agent")

@ai_agent_router.post("/chat")
def initiate_chat(query: chat_payload):
    print(query.model.dump())


@ai_agent_router.get("/history")
def get_history(session_id: str):
    print("Session ID has been received")
    return f"Here is the chat for {session_id} Session ID"