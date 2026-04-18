"""
advanced_insights_service.py -- Extract comprehensive behavioral insights via Groq LLM JSON payload.
"""

import os
import json
from dotenv import load_dotenv

load_dotenv()

DEFAULT_INSIGHTS = {
    "emotional_message": "Your spending habits are slowing down your financial goals.",
    "good_habits": ["Tracking your expenses early on"],
    "trigger_genome": "Random impulse purchases",
    "trend_detection": "Discretionary spending needs tightening",
}

INSIGHTS_PROMPT_TEMPLATE = """You are a highly analytical and slightly tough-love behavioral finance coach for Indian college students.

User Goal: {goal}
Highest Spend Category: {highest_spend_category}
Monthly Waste (in Highest Category): INR {monthly_waste}
Future Value if Invested: INR {future_invested_value}
Full Spending Breakdown: {spending_breakdown}

Analyze the user's spending habits and output a JSON response with exactly the following four string/list keys:
1. "emotional_message": A short (under 30 words), slightly tough-love sentence connecting their highest spending category to their personal goal. Make it punchy.
2. "good_habits": A list of up to 2 short phrases pointing out decent habits in their breakdown (e.g. "Low spend on subscriptions", "Avoiding excessive travel"). If everything is bad, say ["Being honest enough to track your expenses"].
3. "trigger_genome": A 3-4 word phrase identifying their primary spending trigger flavor (e.g. "Late Night Food Ordering", "Weekend Entertainment Splurges", "Boredom Shopping").
4. "trend_detection": A short 1 sentence trend analysis summary (e.g. "Your food dependency is becoming a fixed cost instead of a luxury.").

Return ONLY valid JSON. No markdown wrappers like ```json, no extra commentary. 

Expected JSON structure:
{{
  "emotional_message": "...string...",
  "good_habits": ["...string...", "...string..."],
  "trigger_genome": "...string...",
  "trend_detection": "...string..."
}}
"""


def generate_advanced_insights(
    goal: str,
    highest_spend_category: str,
    monthly_waste: int,
    future_invested_value: int,
    spending_breakdown: dict[str, int],
) -> dict:
    """Generate all specialized emotional and behavioral AI insights in a single LLM pass."""
    try:
        from langchain_groq import ChatGroq

        api_key = os.getenv("GROQ_API_KEY", "")
        if not api_key:
            print("[ExpenseAnalysis] No GROQ_API_KEY found, using fallback insights")
            return DEFAULT_INSIGHTS

        # Using JSON mode format enforcement if available, or just strict templating
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            api_key=api_key,
            max_tokens=300,
        )

        prompt = INSIGHTS_PROMPT_TEMPLATE.format(
            goal=goal,
            highest_spend_category=highest_spend_category,
            monthly_waste=monthly_waste,
            future_invested_value=future_invested_value,
            spending_breakdown=json.dumps(spending_breakdown)
        )

        response = llm.invoke(prompt)
        content = response.content.strip()

        # Clean JSON markdown if the LLM leaked it despite instructions
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            print(f"[ExpenseAnalysis] Failed to parse JSON from LLM: {content}")
            return DEFAULT_INSIGHTS

        print(f"[ExpenseAnalysis] Advanced insights generated successfully")
        return {
            "emotional_message": parsed.get("emotional_message", DEFAULT_INSIGHTS["emotional_message"]),
            "good_habits": parsed.get("good_habits", DEFAULT_INSIGHTS["good_habits"]),
            "trigger_genome": parsed.get("trigger_genome", DEFAULT_INSIGHTS["trigger_genome"]),
            "trend_detection": parsed.get("trend_detection", DEFAULT_INSIGHTS["trend_detection"]),
        }

    except Exception as e:
        print(f"[ExpenseAnalysis] Advanced insights generation failed: {e}")
        return DEFAULT_INSIGHTS
