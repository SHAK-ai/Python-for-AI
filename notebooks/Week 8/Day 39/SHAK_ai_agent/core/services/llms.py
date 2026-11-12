import os
import dotenv from load_dotenv

load_dotenv()


LLMs = {
    "groq": {
        "baseUrl": "https://api.groq.com/openai/v1",
        "apikey": os.getenv("LANG"),
        "model": "openai/gpt-oss-120b"
    }
}