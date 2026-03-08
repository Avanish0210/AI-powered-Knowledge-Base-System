// ===== CONFIGURATION =====
const API_BASE = 'https://chatbot-application-final-latest-1.onrender.com';

// ===== STATE =====
const state = {
    uploadedDocs: [],
    selectedDoc: null,
    isUploading: false,
    isChatting: false,
    messages: [],
};

// ===== DOM ELEMENTS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
    navbar: $('#navbar'),
    mobileMenuBtn: $('#mobile-menu-btn'),
    mobileMenu: $('#mobile-menu'),
    uploadZone: $('#upload-zone'),
    fileInput: $('#file-input'),
    uploadProgress: $('#upload-progress'),
    progressBar: $('#progress-bar'),
    progressStatus: $('#progress-status'),
    fileName: $('#file-name'),
    fileSize: $('#file-size'),
    uploadSuccess: $('#upload-success'),
    docsList: $('#docs-list'),
    noDocs: $('#no-docs'),
    docSelector: $('#doc-selector'),
    noDocsChat: $('#no-docs-chat'),
    chatMessages: $('#chat-messages'),
    welcomeMessage: $('#welcome-message'),
    chatInput: $('#chat-input'),
    sendBtn: $('#send-btn'),
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initUpload();
    initChat();
    initScrollAnimations();
});

// ===== NAVBAR =====
function initNavbar() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        dom.navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Mobile menu
    dom.mobileMenuBtn.addEventListener('click', () => {
        dom.mobileMenu.classList.toggle('active');
        dom.mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu on link click
    $$('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            dom.mobileMenu.classList.remove('active');
            dom.mobileMenuBtn.classList.remove('active');
        });
    });
}

// ===== UPLOAD =====
function initUpload() {
    // Click to upload
    dom.uploadZone.addEventListener('click', () => {
        dom.fileInput.click();
    });

    // File selected
    dom.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleUpload(e.target.files[0]);
        }
    });

    // Drag and drop
    dom.uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dom.uploadZone.classList.add('drag-over');
    });

    dom.uploadZone.addEventListener('dragleave', () => {
        dom.uploadZone.classList.remove('drag-over');
    });

    dom.uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dom.uploadZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files[0]);
        }
    });
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

async function handleUpload(file) {
    if (state.isUploading) return;

    // Validate
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        showToast('Please upload a PDF file.', 'error');
        return;
    }

    state.isUploading = true;

    // Show progress
    dom.uploadZone.style.display = 'none';
    dom.uploadSuccess.style.display = 'none';
    dom.uploadProgress.style.display = 'block';
    dom.fileName.textContent = file.name;
    dom.fileSize.textContent = formatFileSize(file.size);
    dom.progressBar.style.width = '0%';
    dom.progressStatus.textContent = 'Uploading...';

    // Simulate progress while uploading
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 85) progress = 85;
        dom.progressBar.style.width = progress + '%';
    }, 300);

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE}/documents/upload`, {
            method: 'POST',
            body: formData,
        });

        clearInterval(progressInterval);

        if (response.ok) {
            dom.progressBar.style.width = '100%';
            dom.progressStatus.textContent = 'Processing embeddings...';

            await sleep(500);

            // Add to uploaded docs
            if (!state.uploadedDocs.includes(file.name)) {
                state.uploadedDocs.push(file.name);
            }
            updateDocsList();
            updateDocSelector();

            // Show success
            dom.uploadProgress.style.display = 'none';
            dom.uploadSuccess.style.display = 'block';
            $('#success-title').textContent = `${file.name} Uploaded!`;

            // Auto-select this doc
            state.selectedDoc = file.name;
            updateDocSelector();
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        clearInterval(progressInterval);
        dom.progressBar.style.width = '0%';
        dom.progressStatus.textContent = 'Upload failed. Please ensure the backend is running.';
        console.error('Upload error:', error);

        setTimeout(() => {
            dom.uploadProgress.style.display = 'none';
            dom.uploadZone.style.display = 'flex';
        }, 3000);
    }

    state.isUploading = false;
    dom.fileInput.value = '';
}

function updateDocsList() {
    if (state.uploadedDocs.length === 0) {
        dom.noDocs.style.display = 'block';
        return;
    }

    dom.noDocs.style.display = 'none';
    // Clear existing doc items (but keep noDocs)
    dom.docsList.querySelectorAll('.doc-item').forEach(el => el.remove());

    state.uploadedDocs.forEach(docName => {
        const docItem = document.createElement('div');
        docItem.className = 'doc-item';
        docItem.innerHTML = `
            <span class="doc-item-icon">📄</span>
            <span class="doc-item-name">${escapeHtml(docName)}</span>
            <span class="doc-item-badge">Ready</span>
        `;
        dom.docsList.appendChild(docItem);
    });
}

function updateDocSelector() {
    if (state.uploadedDocs.length === 0) {
        dom.noDocsChat.style.display = 'block';
        return;
    }

    dom.noDocsChat.style.display = 'none';
    // Clear existing items
    dom.docSelector.querySelectorAll('.doc-select-item').forEach(el => el.remove());

    state.uploadedDocs.forEach(docName => {
        const btn = document.createElement('button');
        btn.className = 'doc-select-item' + (state.selectedDoc === docName ? ' active' : '');
        btn.innerHTML = `📄 ${escapeHtml(docName)}`;
        btn.addEventListener('click', () => {
            state.selectedDoc = docName;
            updateDocSelector();
        });
        dom.docSelector.appendChild(btn);
    });
}

// ===== CHAT =====
function initChat() {
    // Auto-resize textarea
    dom.chatInput.addEventListener('input', () => {
        dom.chatInput.style.height = 'auto';
        dom.chatInput.style.height = Math.min(dom.chatInput.scrollHeight, 120) + 'px';
        dom.sendBtn.disabled = dom.chatInput.value.trim() === '';
    });

    // Send on Enter (shift+enter for newline)
    dom.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send button
    dom.sendBtn.addEventListener('click', sendMessage);
}

async function sendMessage() {
    const query = dom.chatInput.value.trim();
    if (!query || state.isChatting) return;

    if (!state.selectedDoc) {
        showToast('Please select a document first.', 'warning');
        return;
    }

    // Hide welcome
    if (dom.welcomeMessage) {
        dom.welcomeMessage.style.display = 'none';
    }

    // Add user message
    addMessage(query, 'user');

    // Clear input
    dom.chatInput.value = '';
    dom.chatInput.style.height = 'auto';
    dom.sendBtn.disabled = true;

    // Show typing indicator
    const typingEl = addTypingIndicator();

    state.isChatting = true;

    try {
        const params = new URLSearchParams({
            query: query,
            docName: state.selectedDoc,
        });

        const response = await fetch(`${API_BASE}/documents/chat?${params.toString()}`);

        if (response.ok) {
            const answer = await response.text();
            typingEl.remove();
            addMessage(answer, 'ai');
        } else {
            throw new Error('Chat request failed');
        }
    } catch (error) {
        typingEl.remove();
        addMessage('Sorry, I couldn\'t process your question. Please ensure the backend server is running and Ollama is active.', 'ai');
        console.error('Chat error:', error);
    }

    state.isChatting = false;
}

function addMessage(content, type) {
    const msgEl = document.createElement('div');
    msgEl.className = `message ${type}`;

    const avatar = type === 'ai' ? '🧠' : '👤';

    msgEl.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-body">${type === 'ai' ? formatAIResponse(content) : escapeHtml(content)}</div>
    `;

    dom.chatMessages.appendChild(msgEl);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;

    state.messages.push({ content, type });
}

function addTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'message ai';
    typingEl.innerHTML = `
        <div class="message-avatar">🧠</div>
        <div class="message-body">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    dom.chatMessages.appendChild(typingEl);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    return typingEl;
}

function formatAIResponse(text) {
    // Basic markdown-like formatting
    let formatted = escapeHtml(text);

    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

// Set example query
function setExample(query) {
    dom.chatInput.value = query;
    dom.chatInput.dispatchEvent(new Event('input'));
    dom.chatInput.focus();
}
// Make globally accessible
window.setExample = setExample;

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    // Observe elements
    $$('.feature-card, .step, .section-header, .upload-container, .chat-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// CSS class for animated elements
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== UTILITIES =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';

    const colors = {
        info: '#818cf8',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
    };

    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 14px 24px;
        background: rgba(17, 17, 24, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid ${colors[type]}40;
        border-radius: 12px;
        color: #f0f0f5;
        font-size: 0.9375rem;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${colors[type]}20;
        z-index: 1000;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
    };

    toast.innerHTML = `<span>${icons[type]}</span> ${escapeHtml(message)}`;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
