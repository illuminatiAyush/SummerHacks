from schemas.graph_state import ExpenseGraphState
from services.vision_service import extract_transactions_from_image

def vision_node(state: ExpenseGraphState) -> dict:
    """
    If the raw_input looks like a base64 image or a specifically flagged file,
    extract transactions using Gemini Vision.
    """
    payload_id = state.get("payload_id", "unknown")
    raw_input = state.get("raw_input", "").strip()
    
    # Check if raw_input is actually a base64 image (starts with data:image or is just very long and looks like base64)
    # For now, we'll check if it's explicitly flagged in a special way or if it's a long string without spaces
    # In a real app, the frontend would pass a flag.
    
    is_image = False
    if raw_input.startswith("data:image"):
        is_image = True
        # Strip metadata
        raw_input = raw_input.split(",")[1] if "," in raw_input else raw_input
    elif len(raw_input) > 1000 and " " not in raw_input[:100]: # Heuristic for base64
        is_image = True
        
    if is_image:
        print(f"[ExpenseAnalysis] Vision node triggered for payload {payload_id}")
        extracted_text = extract_transactions_from_image(raw_input)
        if extracted_text:
            print(f"[ExpenseAnalysis] Vision node extracted text successfully.")
            return {"raw_input": extracted_text}
        else:
            print(f"[ExpenseAnalysis] Vision node failed to extract text.")
            return {"status": "error", "error": "Failed to parse image statement."}
            
    return {} # No change if not an image
