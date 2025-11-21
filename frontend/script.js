const fileList = document.getElementById("file-list");
const upButton = document.getElementById("up-button");
const currentPathHeader = document.getElementById("current-path");
const fileModal = document.getElementById("file-modal");
const modalFilename = document.getElementById("modal-filename");
const modalFileContent = document.getElementById("modal-file-content");
const downloadBtn = document.getElementById("download-btn");
const closeModal = document.getElementById("close-modal");

const API_BASE_URL = "http://192.168.1.10:3001";
let currentPath = "";
let currentViewedFilePath = "";

// List of common text file extensions
const TEXT_FILE_EXTENSIONS = [
  ".txt", ".md", ".log", ".json", ".js", ".html", ".css", ".py", ".xml", ".csv",
  ".yml", ".yaml", ".sh", ".bat", ".conf", ".ini", ".cfg", ".env", ".gitignore",
  ".java", ".c", ".cpp", ".h", ".hpp", ".cs", ".go", ".php", ".rb", ".swift",
  ".ts", ".tsx", ".jsx", ".vue", ".sql", ".rtf", ".tex", ".ps1", ".vbs",
  ".svg", ".toml", ".lock", ".editorconfig", ".prettierrc", ".eslintrc",
  ".npmrc", ".yarnrc", ".gitattributes", ".gitmodules", ".dockerfile", ".dockerignore"
];

// List of common image file extensions
const IMAGE_FILE_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".ico", ".tiff", ".tif"
];

// List of common video file extensions
const VIDEO_FILE_EXTENSIONS = [
  ".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv", ".m4v", ".3gp", ".ogv"
];

// Function to check if a file is a text file based on its extension
const isTextFile = (filename) => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return TEXT_FILE_EXTENSIONS.includes(ext);
};

// Function to check if a file is an image file
const isImageFile = (filename) => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return IMAGE_FILE_EXTENSIONS.includes(ext);
};

// Function to check if a file is a video file
const isVideoFile = (filename) => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return VIDEO_FILE_EXTENSIONS.includes(ext);
};

// Function to check if a file is a markdown file
const isMarkdownFile = (filename) => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return ext === ".md";
};

// Simple markdown parser
const parseMarkdown = (markdown) => {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Lists
  html = html.replace(/^\* (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>");

  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
    return "<ul>" + match + "</ul>";
  });

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/^\*\*\*$/gm, "<hr>");

  // Line breaks and paragraphs
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<h[1-6]>)/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ul>)/g, "$1");
  html = html.replace(/(<\/ul>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ol>)/g, "$1");
  html = html.replace(/(<\/ol>)<\/p>/g, "$1");
  html = html.replace(/<p>(<blockquote>)/g, "$1");
  html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");
  html = html.replace(/<p>(<pre>)/g, "$1");
  html = html.replace(/(<\/pre>)<\/p>/g, "$1");
  html = html.replace(/<p>(<hr>)<\/p>/g, "$1");

  return html;
};

// Function to get file icon based on type
const getFileIcon = (filename, isDirectory) => {
  if (isDirectory) return "📁";
  if (isTextFile(filename)) return "📄";
  if (isImageFile(filename)) return "🖼️";
  if (isVideoFile(filename)) return "🎬";
  return "📄";
};

// Function to open modal
const openModal = (filename, filePath) => {
  modalFilename.textContent = filename;
  currentViewedFilePath = filePath;
  fileModal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent background scrolling
};

// Function to close modal
const closeModalFunction = () => {
  fileModal.style.display = "none";
  document.body.style.overflow = "auto"; // Restore background scrolling
  modalFileContent.innerHTML = "";
  modalFileContent.className = "";
  currentViewedFilePath = "";
};

// Function to fetch and display files/folders
const browse = async (path) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/browse?path=${encodeURIComponent(path)}`
    );
    if (!response.ok) {
      const error = await response.json();
      alert(`Error: ${error.error}`);
      return;
    }
    const files = await response.json();

    fileList.innerHTML = "";

    files.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    files.forEach((file) => {
      const li = document.createElement("li");
      const icon = getFileIcon(file.name, file.isDirectory);
      li.innerHTML = `${icon} ${file.name}`;
      li.dataset.name = file.name;
      li.dataset.isDirectory = file.isDirectory;

      li.addEventListener("click", () => {
        const newPath = [path, file.name].filter(Boolean).join("/");
        if (file.isDirectory) {
          browse(newPath);
        } else if (isTextFile(file.name)) {
          openModal(file.name, newPath);
          viewTextFile(newPath, file.name);
        } else if (isImageFile(file.name)) {
          openModal(file.name, newPath);
          viewImageFile(newPath, file.name);
        } else if (isVideoFile(file.name)) {
          openModal(file.name, newPath);
          viewVideoFile(newPath, file.name);
        } else {
          downloadFile(newPath);
        }
      });

      fileList.appendChild(li);
    });

    currentPath = path;
    currentPathHeader.textContent = `/${path}`;
    upButton.style.display = path ? "block" : "none";
  } catch (error) {
    console.error("Error browsing files:", error);
    alert("Failed to browse files. Is the server running?");
  }
};

// Function to view content of a text file
const viewTextFile = async (path, filename) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/view-text-file?path=${encodeURIComponent(path)}`
    );
    if (!response.ok) {
      const error = await response.json();
      modalFileContent.innerHTML = `<div class="error">Error viewing file: ${error.error}</div>`;
      modalFileContent.className = "";
      return;
    }
    const data = await response.text();

    if (isMarkdownFile(filename)) {
      modalFileContent.innerHTML = parseMarkdown(data);
      modalFileContent.className = "markdown-content";
    } else {
      modalFileContent.textContent = data;
      modalFileContent.className = "text-content";
    }
  } catch (error) {
    console.error("Error viewing text file:", error);
    modalFileContent.innerHTML = `<div class="error">Error viewing file content.</div>`;
    modalFileContent.className = "";
  }
};

// Function to view image file
const viewImageFile = (path, filename) => {
  const imageUrl = `${API_BASE_URL}/api/download?path=${encodeURIComponent(path)}`;
  modalFileContent.innerHTML = `
    <div class="image-container">
      <img src="${imageUrl}" alt="${filename}" style="max-width: 100%; height: auto; border-radius: 8px;">
    </div>
  `;
  modalFileContent.className = "image-content";
};

// Function to view video file
const viewVideoFile = (path, filename) => {
  const videoUrl = `${API_BASE_URL}/api/download?path=${encodeURIComponent(path)}`;
  modalFileContent.innerHTML = `
    <div class="video-container">
      <video controls style="max-width: 100%; height: auto; border-radius: 8px;">
        <source src="${videoUrl}" type="video/mp4">
        <source src="${videoUrl}" type="video/webm">
        <source src="${videoUrl}" type="video/ogg">
        Your browser does not support the video tag.
      </video>
    </div>
  `;
  modalFileContent.className = "video-content";
};

// Function to trigger file download
const downloadFile = (path) => {
  window.location.href = `${API_BASE_URL}/api/download?path=${encodeURIComponent(path)}`;
};

// Event listeners
upButton.addEventListener("click", () => {
  const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
  browse(parentPath);
});

downloadBtn.addEventListener("click", () => {
  if (currentViewedFilePath) {
    downloadFile(currentViewedFilePath);
  }
});

closeModal.addEventListener("click", closeModalFunction);

// Close modal when clicking outside of it
fileModal.addEventListener("click", (e) => {
  if (e.target === fileModal) {
    closeModalFunction();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && fileModal.style.display === "block") {
    closeModalFunction();
  }
});

// Initial load
browse("");