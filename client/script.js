const socket = io();

const documentList = document.getElementById("document-list");
const newDocumentBtn = document.getElementById("new-document-btn");
const editorContainer = document.getElementById("editor-container");
const editor = document.getElementById("editor");
const backBtn = document.getElementById("back-btn");
let currentDocId = null;

async function fetchDocuments() {
  const response = await fetch("/api/docs");
  const documents = await response.json();
  renderDocumentList(documents);
}

function renderDocumentList(documents) {
  documentList.innerHTML = "";
  documents.forEach((doc) => {
    const docElement = document.createElement("div");
    docElement.textContent = doc.title;
    docElement.style.cursor = "pointer";
    docElement.onclick = () => openDocument(doc._id);
    documentList.appendChild(docElement);
  });
}

async function createNewDocument() {
  const title = prompt("Enter document title:");
  if (title) {
    const response = await fetch("/api/docs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const newDocument = await response.json();
    fetchDocuments();
    openDocument(newDocument._id);
  }
}

async function openDocument(docId) {
  currentDocId = docId;
  editorContainer.style.display = "block";
  documentList.style.display = "none";
  newDocumentBtn.style.display = "none";
  backBtn.style.display = "block";

  const response = await fetch(`/api/docs/${docId}`);
  const document = await response.json();
  editor.value = document.content;

  socket.emit("join", docId);

  socket.on("receiveEdit", (content) => {
    editor.value = content;
  });

  editor.addEventListener("input", () => {
    const content = editor.value;
    socket.emit("edit", { docId, content });
  });
}

function goBackToDocuments() {
  editorContainer.style.display = "none";
  documentList.style.display = "block";
  newDocumentBtn.style.display = "block";
  backBtn.style.display = "none";
  socket.emit("leave", currentDocId);
  currentDocId = null;
}

newDocumentBtn.onclick = createNewDocument;
backBtn.onclick = goBackToDocuments;

fetchDocuments();
