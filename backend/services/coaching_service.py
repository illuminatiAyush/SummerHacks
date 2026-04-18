"""
coaching_service.py -- Generate emotional coaching messages via Groq LLM.

Connects spending behaviour to the user's personal financial goal.
Falls back to a generic message if the LLM is unavailable.
"""

import os
from dotenv import load_dotenv

load_dotenv()

DEFAULT_COACHING_MESSAGE = "Your spending habits are slowing down your financial goals."

COACHING_PROMPT_TEMPLATE = """You are a financial behaviour coach for Indian college students.

User Goal: {goal}
Highest Spend Category: {highest_spend_category}
Monthly Waste: INR {monthly_waste}
Future Value if Invested: INR {future_invested_value}

Generate one short emotional coaching sentence.
Keep it under 30 words.
Be motivational, slightly tough-love, and goal-oriented.
Avoid sounding judgmental or insulting.
Do not use emojis.
Respond with ONLY the coaching sentence. No quotes, no commentary."""


def generate_coaching_message(
    goal: str,
    highest_spend_category: str,
    monthly_waste: int,
    future_invested_value: int,
) -> str:
    """Generate a personalized emotional coaching message.

    Uses Groq LLM with fallback to default message on any failure.
    """
    try:
        from langchain_groq import ChatGroq

        api_key = os.getenv("GROQ_API_KEY", "")
        if not api_key:
            print("[ExpenseAnalysis] No GROQ_API_KEY found, using fallback coaching message")
            return DEFAULT_COACHING_MESSAGE

        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            api_key=api_key,
            max_tokens=100,
        )

        prompt = COACHING_PROMPT_TEMPLATE.format(
            goal=goal,
            highest_spend_category=highest_spend_category,
            monthly_waste=monthly_waste,
            future_invested_value=future_invested_value,
        )

        response = llm.invoke(prompt)
        message = response.content.strip().strip('"').strip("'")

        if not message:
            return DEFAULT_COACHING_MESSAGE

        print(f"[ExpenseAnalysis] Coaching message generated: {message}")
        return message

    except Exception as e:
        print(f"[ExpenseAnalysis] Coaching generation failed: {e}")
        return DEFAULT_COACHING_MESSAGE
