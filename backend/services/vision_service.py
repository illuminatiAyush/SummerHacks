import os
import base64
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def extract_transactions_from_image(base64_image: str) -> str:
    """
    Use Gemini 1.5 Flash to extract transaction text from a bank statement image.
    """
    if not api_key:
        print("[VisionService] GEMINI_API_KEY missing. Returning mock data.")
        return "Zomato - Rs.450\nSwiggy - Rs.320\nUber - Rs.150\nNetflix - Rs.649"

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Prepare image data
        image_data = base64.b64decode(base64_image)
        contents = [
            {
                "mime_type": "image/jpeg",
                "data": image_data
            },
            "Extract all transaction records from this bank statement image. For each transaction, provide: Merchant Name, Amount (INR), and Date. Format as a clean list of strings like 'Merchant - Rs.Amount - Date'. If no transactions are found, return 'No transactions found'."
        ]
        
        response = model.generate_content(contents)
        return response.text
    except Exception as e:
        print(f"[VisionService] Gemini Vision failed: {e}")
        return ""
