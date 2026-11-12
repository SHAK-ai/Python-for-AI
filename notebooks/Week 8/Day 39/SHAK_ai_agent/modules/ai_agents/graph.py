import os

from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage
from langraph.graph import START, MessagesState, StateGraph
from langchain_openai import ChatOpenAI
from modules.ai_agents.tools import TOOLS
from core.services.llms import LLMs




system_prompt = """
You are the friendly customer support assistant for Xander Restaurant.
Keep replies short. Prices are in Pakistani rupees. Use fetch_menu for menu/prices.
For complaints, collect customer name, phone, complaint and order ID. Validate the
order ID with validate_order_id, then call log_complaint only for a valid order.
Never invent facts. Ask for missing details. 
"""

def create_chat_model(llm = "groq"):
    return ChatOpenAI(**LLMs[llm], temperature = 0)

def assistant(state: MessagesState, model_with_tools):
    reply = model_with_tools.invoke([SystemMessage(content=system_prompt), *state["messges"]])
    return {"messages": [reply]}





def build_graph(model = None, tools = None):
    tools = TOOLS if tools is None else tools
    model = create_chat_model()
    model_with_tools = model.bind_tools(tools)
    assistant_node = assistant(MessagesState, model_with_tools)
    builder = StateGraph(MessagesState)
    
    # connect assistant node

    builder.add_node("assistant", assistant_node)

    # connecting tool nodes

    builder.add_node("tools", ToolNode(tools))

    #EDGEs

    builder.add_edge(START, assistant_node)
    
    builder.add_conditional_edges("assistant", tools_condition)
    

    return builder.compile
    