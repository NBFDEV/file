const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

const codeBlockRegex = /`(\w+)\n([\s\S]*?)`/g;

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    let remainingText = text;
    let match;

    while ((match = codeBlockRegex.exec(remainingText)) !== null) {
        const language = match[1];
        const codeContent = match[2];
        const textBeforeCode = remainingText.substring(0, match.index);

        if (textBeforeCode.trim() !== '') {
            const textDiv = document.createElement('div');
            textDiv.innerHTML = textBeforeCode.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            messageDiv.appendChild(textDiv);
        }

        const codeDiv = document.createElement('div');
        codeDiv.classList.add('code-message');
        codeDiv.innerHTML = DOMPurify.sanitize(`<pre><code class="language-${language}">${codeContent}</code></pre>`);
        messageDiv.appendChild(codeDiv);

        remainingText = remainingText.substring(match.index + match[0].length);
    }

    if (remainingText.trim() !== '') {
        const textDiv = document.createElement('div');
        textDiv.innerHTML = remainingText.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        messageDiv.appendChild(textDiv);
    }

    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    chatbox.appendChild(messageDiv);
    chatbox.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });

    // ไฮไลต์โค้ดด้วย Prism.js หลังจากเพิ่มข้อความลงใน chatbox
    Prism.highlightAllUnder(chatbox);
}


async function sendMessage() {
    const messageText = userInput.value.trim();
    if (!messageText) return;

    addMessage('user', messageText);
    userInput.value = '';
    userInput.disabled = true;
    sendButton.disabled = true;

    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'ai-message');
    loadingDiv.innerText = 'กำลังคิด...';
    loadingDiv.id = 'loading-indicator';
    chatbox.appendChild(loadingDiv);
    chatbox.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });

    try {
        const response = await fetch("chatbot.php", { // เปลี่ยนเป็น chatbot.php
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageText })
        });

        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.remove();

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `Server ตอบกลับด้วยสถานะ ${response.status}` }));
            addMessage('ai', `เกิดข้อผิดพลาด: ${errorData.error || response.statusText}`);
        } else {
            const data = await response.json();
            if (data.error) { // ตรวจสอบ data.error ก่อน
                addMessage('ai', `NBFDEV AI: ${data.error}`);
            } else if (data.response) { // ตรวจสอบ data.response
                addMessage('ai', `NBFDEV AI: ${data.response}`);
            } else {
                addMessage('ai', "NBFDEV AI: ไม่มีการตอบกลับจากเซิร์ฟเวอร์"); // กรณีไม่มีทั้ง error และ response
            }
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.remove();
        addMessage('ai', 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ');
    } finally {
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function showWelcomeMessage(name) {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.classList.add('welcome-message');
    welcomeDiv.textContent = `สวัสดี  ${name}`;
    chatbox.appendChild(welcomeDiv);

    userInput.addEventListener('input', function () {
        welcomeDiv.remove();
        userInput.removeEventListener('input', arguments.callee);
    });
}

window.onload = function () {
    showWelcomeMessage('ผมคือ NBFDEV AI มีอะไรให้ช่วยมั้ย?');

    const modal = document.getElementById("welcomeModal");
    const modalText = document.getElementById("welcomeMessageText");
    const closeBtn = document.querySelector(".close");

    modalText.innerText =
        "สวัสดีจาก Narawit ผู้พัฒนา\n" +
        "ขอบคุณที่คุณเข้ามา  AI ตัว นี้ที่ได้รับการฝึกฝนจาก google แน่นอน เราแค่ เอามาให้คุณใช้บริการได้ ฟรี ของให้สนุก \n" +
        "นี่คือการทดสอบครั้งแรกของเรา\n" +
        "หากพบข้อผิดพลาด โปรดแจ้งให้เรารับรู้ได้ที่ nbfdev17@gmail.com หรือ IG: nbfdev_9954";

    modal.style.display = "block";

    closeBtn.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
};
