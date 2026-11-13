from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


from modules.ai_agents.router import ai_agent_router
app = FastAPI()

FRONTEND_DIR = Path(__file__).parent / "frontend"
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


app.include_router(
    ai_agent_router,
    tags = ["AI Module"]
)                                                        #put rout method for updatable values
                                                        #get retreive 
@app.get("/", status_code=200)
async def root():
    return FileResponse(FRONTEND_DIR / "index.html")


