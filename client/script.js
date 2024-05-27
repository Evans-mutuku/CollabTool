const socket = io();

const documentList = document.getElementById("document-list");
const newDocumentBtn = document.getElementById("new-document-btn");
const editorContainer = document.getElementById("editor-container");
const editor = document.getElementById("editor");
const backBtn = document.getElementById("back-btn");
let currentDocId = null;

document.addEventListener("DOMContentLoaded", () => {
  // const token = localStorage.getItem("token");

  // if (!token) {
  //   alert("You must be logged in to create a document.");
  //   window.location.href = "/login.html"; // Redirect to login page
  // }

  document
    .getElementById("create-document-btn")
    .addEventListener("click", async () => {
      const title = prompt("Enter document title:");
      if (!title) return;

      try {
        const response = await fetch("/api/docs/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content: "" }),
        });

        if (response.ok) {
          const doc = await response.json();
          window.location.href = `/edit.html?docId=${doc._id}`; // Redirect to document editing page
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to create document");
      }
    });

  // Fetch and render the document list (same as previous)
  fetchDocuments();
});
// Create new Document
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
async function fetchDocuments() {
  const response = await fetch("/api/docs");
  const documents = await response.json();
  renderDocumentList(documents);
}
fetchDocuments();

// Fetch all documents
function renderDocumentList(documents) {
  documentList.innerHTML = "";
  documents.forEach((doc) => {
    const docElement = document.createElement("div");
    docElement.className =
      "flex justify-between  p-3 border border-gray-500 rounded-md mb-2 cursor-pointer hover:bg-gray-100 flex-col w-56";

    const titleElement = document.createElement("div");
    titleElement.textContent = doc.title;
    titleElement.className = "mr-2 font-bold text-xl";
    titleElement.onclick = () => openDocument(doc._id);

    const infoElement = document.createElement("div");
    infoElement.className = "flex flex-col ";

    const dateElement = document.createElement("div");
    dateElement.textContent = new Date(doc.updatedAt).toLocaleString();
    dateElement.className = "text-xs text-gray-500 mt-7";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.className =
      "bg-red-500 w-full mt-2 text-white text-sm py-1.5 rounded-full hover:red-600";
    deleteBtn.onclick = () => deleteDocument(doc._id);

    infoElement.appendChild(dateElement);
    infoElement.appendChild(deleteBtn);

    docElement.appendChild(titleElement);
    docElement.appendChild(infoElement);

    documentList.appendChild(docElement);
  });
}

// Delete a document Created

async function deleteDocument(docId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this document?"
  );
  if (confirmDelete) {
    try {
      const response = await fetch(`/api/docs/delete/${docId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchDocuments();
        alert("Document deleted successfully!");
      } else {
        alert("Failed to delete document.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("An error occurred while deleting the document.");
    }
  }
}
