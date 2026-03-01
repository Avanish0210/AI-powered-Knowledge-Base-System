
# 🚀 AI-Powered Knowledge Base System

An AI-driven **Retrieval-Augmented Generation (RAG)** system built using **Spring Boot, Spring AI, and PostgreSQL (pgvector)** that allows users to upload PDF documents and ask context-aware questions based on their content.

This system enables semantic search over documents and generates accurate responses using an LLM.

---

## 📌 Features

* 📄 Upload PDF documents dynamically
* ✂️ Automatic text chunking
* 🧠 Vector embedding generation
* 🗄️ Vector storage using pgvector
* 🔎 Semantic similarity search
* 🤖 LLM-based response generation
* 🏷️ Metadata-based document filtering
* 🌐 RESTful APIs for upload and query

---

## 🏗️ Architecture Overview

1. **PDF Upload**

   * Users upload a PDF via REST API.
   * The document is parsed and processed.

2. **Chunking**

   * The text is split into smaller chunks using token-based splitting.

3. **Embedding Generation**

   * Each chunk is converted into vector embeddings.

4. **Vector Storage**

   * Embeddings are stored in PostgreSQL using pgvector.

5. **Query Processing**

   * User question → converted into embedding.
   * Top similar chunks are retrieved using semantic search.

6. **LLM Response**

   * Retrieved context is passed to the LLM.
   * LLM generates an answer strictly based on document content.

---

## 🛠️ Tech Stack

* **Backend:** Spring Boot
* **AI Framework:** Spring AI
* **Database:** PostgreSQL + pgvector
* **LLM Integration:** OpenAI (or compatible LLM)
* **Build Tool:** Maven
* **Containerization:** Docker (optional)

---

## 📂 Project Structure

```
src/
 ├── main/java/com/example/ChatBot
 │    ├── ChatBotApplication.java
 │    ├── DocChatController.java
 │    ├── IngestionService.java
 │    ├── Config/AIConfig.java
 │
 ├── main/resources
 │    └── application.yaml
 │
 └── test/
```

---

## 📡 API Endpoints

### 1️⃣ Upload Document

```
POST /documents/upload
```

**Body:** `form-data`

* Key: `file`
* Type: File
* Value: Upload PDF

---

### 2️⃣ Ask Question

```
GET /chat
```

**Query Params:**

| Parameter | Description               |
| --------- | ------------------------- |
| query     | User question             |
| docName   | Name of uploaded document |

Example:

```
GET /chat?query=What is the objective of the project?&docName=proposal.pdf
```

---

## ▶️ How to Run

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Avanish0210/AI-powered-Knowledge-Base-System.git
cd AI-powered-Knowledge-Base-System
```

### 2️⃣ Configure Database

* Install PostgreSQL
* Enable pgvector extension
* Update `application.yaml` with DB credentials

### 3️⃣ Run Application

```bash
mvn spring-boot:run
```

App runs on:

```
http://localhost:8080
```

---

## 🔥 Key Concepts Implemented

* Retrieval-Augmented Generation (RAG)
* Semantic Search using Embeddings
* Metadata Filtering
* Similarity Threshold Tuning
* Vector Indexing
* Multipart File Handling in Spring Boot

---

## 🚀 Future Enhancements

* Multiple document management (List/Delete APIs)
* Conversation memory
* User authentication (JWT)
* Frontend chat UI
* Source citation in responses
* Role-based document access

---

## 💼 Why This Project?

This project demonstrates:

* Real-world AI system integration
* Backend engineering with Spring Boot
* Vector database usage
* LLM integration
* Enterprise-style API design

---

## ⚡ Quick Start Summary

```bash
# 1. Pull AI models
ollama pull gemma3:1b
ollama pull nomic-embed-text:latest

# 2. Start database
docker-compose up -d

# 3. Run backend
./mvnw spring-boot:run

# 4. Open frontend
cd frontend && python -m http.server 5500
# Visit http://localhost:5500
```
---

## 🎨 Frontend Features

- ✨ **Premium dark-mode** design with glassmorphism and gradient accents
- 🎯 **Drag & drop** PDF upload with animated progress bar
- 💬 **Real-time chat** interface with typing indicators
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- 🎭 **Scroll animations** — elements animate in on scroll
- 🔖 **Document selector** sidebar shows model info and search parameters
- 💡 **Example queries** — quick-start buttons for common questions

---
> [!CAUTION]
> The order matters! Start services in this sequence: **Ollama → Docker → Backend → Frontend**


## 👨‍💻 Author

**Avanish Pratap Singh**
Java & Spring Boot Developer
AI + Backend Enthusiast

