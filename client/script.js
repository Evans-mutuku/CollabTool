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
    docElement.className =
      "p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-100";
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
    window.location.href = `/edit.html?docId=${newDocument._id}`;
  }
}

async function openDocument(docId) {
  window.location.href = `/edit.html?docId=${docId}`;
}

newDocumentBtn.onclick = createNewDocument;
fetchDocuments();
