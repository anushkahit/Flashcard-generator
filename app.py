from openai import Client
import json
from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set OpenAI API key
API_KEY = 'your-api-key'

def extract_text_from_pdf(pdf_file):
    """Extracts text from a PDF file."""
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def generate_flashcards(input_text, num_flashcards=None, required_terms=None):
    """Uses OpenAI API to generate flashcards with customization."""
    
    required_terms_text = f"Ensure these definitons are created based on the following instructions: {required_terms}" if required_terms else ""
    
    prompt = f"""
    Extract up to {num_flashcards} key terms and their definitions 
    from the following text:
    {input_text}
    
    Specified Context: {required_terms_text if required_terms else 'no specified context'}
    Return the result as a JSON dictionary where keys are terms and values are {'definitions by the specified context' if required_terms else 'definitions or relevance'}.
    """
    
    try:
        client = Client(api_key=API_KEY)

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an assistant generating flashcards."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        content = response.choices[0].message.content
        cleaned_content = re.sub(r"```(json)?", "", content).strip()

        return json.loads(cleaned_content)
    
    except json.JSONDecodeError:
        return {"error": "Failed to parse the OpenAI API response. Ensure the response is valid JSON."}
    except Exception as e:
        return {"error": str(e)}

@app.route("/generate-flashcards", methods=["POST"])
def generate_flashcards_endpoint():
    """Endpoint to generate flashcards."""
    try:
        input_file = request.files.get("file")
        input_text = request.form.get("text")
        num_flashcards = request.form.get("num_flashcards", "the max amount of")
        required_terms = request.form.get("required_terms", "")

        if input_file:
            input_text = extract_text_from_pdf(input_file)
        elif not input_text:
            return jsonify({"error": "No text or file provided."}), 400

        flashcards = generate_flashcards(input_text, num_flashcards, required_terms)

        print(f"Generated flashcards: {flashcards}")

        return jsonify({"flashcards": flashcards})
    except Exception as e: 
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
