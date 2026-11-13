from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from core.database.sqlite import init_database

# Import Routers
from modules.ai_agent.router import ai_agent_router

init_database()   # create tables once when the server starts
app = FastAPI()
FRONTEND_DIR = Path(__file__).parent / "frontend"
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

app.include_router(
    ai_agent_router,
    tags=["AI Module"]
)


@app.get("/", status_code=200)
async def root():
    return FileResponse(FRONTEND_DIR / "index.html")
