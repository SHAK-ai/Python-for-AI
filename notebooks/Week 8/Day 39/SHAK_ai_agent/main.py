from fastapi import FastAPI

app = FastAPI()
                                                        #put rout method for updatable values
                                                        #get retreive 
@app.get("/", status_code = 200)                                           #post to crete an item            
async def root():
    return {"message": "Hello World"}
