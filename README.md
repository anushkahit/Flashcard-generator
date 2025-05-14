# Flashcard Generator App  

This app generates flashcards from text or uploaded PDF files using the OpenAI API.  

---

## **Setup Instructions with Anaconda Prompt**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/your-username/flashcard-app.git
cd flashcard-app
```

---

### **2. Create a New Conda Environment**  
```bash
conda create --name flashcard-env python=3.8
```

Activate the environment:  
```bash
conda activate flashcard-env
```

---

### **3. Install Dependencies**  
```bash
pip install -r requirements.txt
```

---

### **4. Set the OpenAI API Key**  

Replace `'your-api-key'` in line 12 of `app.py` with your actual OpenAI API key:  

```python
API_KEY = 'your-api-key'
```

---

### **5. Start the Flask Server**  
```bash
python app.py
```

---

### **6. Open a new terminal and start the HTTP Server**  

Make sure you are in the `flashcard-app` directory

```bash
python -m http.server 8000
```

---

### **7. Open the Application**  

1. Open your web browser.  
2. Visit: `http://localhost:8000/index.html`  

---

## **How to Use the App**  

1. **Enter Notes or Upload a PDF:**  
   - Type notes in the text area or upload a PDF file.

2. **Set Flashcard Options (Optional):**  
   - Specify the number of flashcards and define customization instructions.

3. **Click "Generate Flashcards"**  
   - Flashcards will be displayed with interactive functionality.

---

## **Citations**  

- We used ChatGPT to write the 2 UI files, script.js and index.html
- We used Stack Overflow and the OpenAI API documentation along with ChatGPT to assist in developing our backend file, app.py

---
