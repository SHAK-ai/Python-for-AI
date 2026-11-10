from fastapi import FastAPI
from pydantic import BaseModel


from modules.ai_agents.router import ai_agent_router
app = FastAPI()


app.include_router(
    ai_agent_router,
    tags = ["AI Module"]
)                                                        #put rout method for updatable values
                                                        #get retreive 
@app.get("/", status_code = 200)                                           #post to crete an item            
async def root():
    return {"message": "You're currently at the Xander's Backend"}


