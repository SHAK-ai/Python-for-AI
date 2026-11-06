import os
import json
import chromadb

from openai import OpenAI
from dotenv import load_dotenv

# load environments

load_dotenv()

# models defined


MODEL = "openai/gpt-oss-120b"
EMBEDDING_MODEL = "nvidia/nemotron-3.5-embed-8b:free"

llm_client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("OPEN_ROUTER_KEY"),
)