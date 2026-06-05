const API_URL = "https://novamindai-q6q6.onrender.com/chat";

const chat = document.getElementById("chat");

let lastUserMessage = "";

loadChat();

function scrollBottom(){
    chat.scrollTop = chat.scrollHeight;
}

function saveChat(){
    localStorage.setItem(
        "novamind_chat",
        chat.innerHTML
    );
}

function loadChat(){

    const history =
    localStorage.getItem(
        "novamind_chat"
    );

    if(history){
        chat.innerHTML = history;
    }

    updateStats();
    scrollBottom();
}

function updateStats(){

    const stats =
    document.getElementById(
        "stats"
    );

    if(stats){

        stats.innerText =
        "Сообщений: " +
        document.querySelectorAll(
            ".message"
        ).length;
    }
}

async function sendMessage(customText = null){

    const input =
    document.getElementById(
        "message"
    );

    const model =
    document.getElementById(
        "model"
    ).value;

    const text =
    customText || input.value.trim();

    if(!text) return;

    lastUserMessage = text;

    if(!customText){

        chat.innerHTML += `
        <div class="message">
            <div class="avatar user-avatar">
                👤
            </div>
            <div class="user">
                ${text}
            </div>
        </div>
        `;
    }

    input.value = "";

    const aiId =
    "ai_" + Date.now();

    chat.innerHTML += `
    <div class="message">
        <div class="avatar ai-avatar">
            🤖
        </div>
        <div class="ai" id="${aiId}">
            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
    `;

    updateStats();

    try{

        const response =
        await fetch(
            API_URL,
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "application/json"
                },
                body:JSON.stringify({
                    message:text,
                    model:model
                })
            }
        );

        const data =
        await response.json();

        document
        .getElementById(aiId)
        .innerHTML =
        `<div class="ai-content">${formatAI(data.reply)}</div>
        <button class="copy-btn" onclick="copyMessage(this)">📋</button>`;


        saveChat();

        scrollBottom();

    }catch(error){

        console.log(error);

        document
        .getElementById(aiId)
        .innerHTML =
        "Ошибка: " + error;
    }
}

function regenerateResponse(){

    if(lastUserMessage){
        sendMessage(
            lastUserMessage
        );
    }
}

function editLastMessage(){

    if(lastUserMessage){

        document
        .getElementById(
            "message"
        )
        .value =
        lastUserMessage;
    }
}

function deleteLastMessage(){

    const messages =
    document.querySelectorAll(
        ".message"
    );

    if(messages.length){

        messages[
            messages.length - 1
        ].remove();

        saveChat();

        updateStats();
    }
}

async function clearChat(){

    localStorage.removeItem(
        "novamind_chat"
    );

    chat.innerHTML = "";

    try{

        await fetch(
            "/clear_memory",
            {
                method:"POST"
            }
        );

    }catch(error){

        console.log(error);
    }

    updateStats();

    showToast(
        "🧹 Память очищена"
    );
}

function exportChat(){

    let text = "";

    document
    .querySelectorAll(
        ".user,.ai"
    )
    .forEach(function(msg){

        text +=
        msg.innerText +
        "\n\n";
    });

    const blob =
    new Blob(
        [text],
        {
            type:"text/plain"
        }
    );

    const a =
    document.createElement(
        "a"
    );

    a.href =
    URL.createObjectURL(
        blob
    );

    a.download =
    "NovaMind_Chat.txt";

    a.click();
}

function searchChat(){

    const text =
    prompt(
        "Поиск по чату:"
    );

    if(!text) return;

    document
    .querySelectorAll(
        ".user,.ai"
    )
    .forEach(function(msg){

        msg.style.border =
        "none";

        if(
            msg.innerText
            .toLowerCase()
            .includes(
                text.toLowerCase()
            )
        ){
            msg.style.border =
            "2px solid gold";
        }
    });
}

function toggleTheme(){

    document.body.classList.toggle(
        "light"
    );

    localStorage.setItem(
        "novamind_theme",
        document.body.classList.contains(
            "light"
        )
    );
}

if(
    localStorage.getItem(
        "novamind_theme"
    ) === "true"
){
    document.body.classList.add(
        "light"
    );
}

function pickImage(){

    document
    .getElementById(
        "imageInput"
    )
    .click();
}

function startVoice(){

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert(
            "Голосовой ввод не поддерживается"
        );

        return;
    }

    const recognition =
    new SpeechRecognition();

    recognition.lang =
    "ru-RU";

    recognition.interimResults =
    false;

    recognition.maxAlternatives =
    1;

    recognition.start();

    recognition.onresult =
    function(event){

        document
        .getElementById(
            "message"
        )
        .value =
        event.results[0][0].transcript;

        sendMessage();
    };

    recognition.onerror =
    function(){

        alert(
            "Ошибка распознавания"
        );
    };
}

const modelSelect =
document.getElementById(
    "model"
);

const savedModel =
localStorage.getItem(
    "novamind_model"
);

if(savedModel){
    modelSelect.value =
    savedModel;
}

modelSelect.addEventListener(
    "change",
    function(){

        localStorage.setItem(
            "novamind_model",
            this.value
        );

        const currentModel =
        document.getElementById(
            "currentModel"
        );

        if(currentModel){

            currentModel.innerText =
            this.value ===
            "google/gemini-2.5-flash"
            ?
            "🟣 Gemini 2.5 Flash"
            :
            "🟢 GPT OSS 20B";
        }
    }
);

document
.getElementById(
    "message"
)
.addEventListener(
    "keypress",
    function(event){

        if(event.key==="Enter"){
            sendMessage();
        }
    }
);

function pinMessage(){

    const messages =
    document.querySelectorAll(
        ".message"
    );

    if(!messages.length) return;

    const last =
    messages[
        messages.length - 1
    ];

    const clone =
    last.cloneNode(true);

    const pinned =
    document.getElementById(
        "pinnedMessages"
    );

    pinned.appendChild(
        clone
    );

    localStorage.setItem(
        "novamind_pinned",
        pinned.innerHTML
    );
}

function loadPinned(){

    const pinned =
    document.getElementById(
        "pinnedMessages"
    );

    const saved =
    localStorage.getItem(
        "novamind_pinned"
    );

    if(saved){
        pinned.innerHTML =
        saved;
    }
}

function toggleSettings(){

    const panel =
    document.getElementById(
        "settingsPanel"
    );

    if(
        panel.style.display ===
        "block"
    ){
        panel.style.display =
        "none";
    }else{
        panel.style.display =
        "block";
    }
}

window.addEventListener(
    "load",
    loadPinned
);


document
.getElementById(
    "imageInput"
)
.addEventListener(
    "change",
    async function(){

        const file =
        this.files[0];

        if(!file){
            return;
        }

        await new Promise((resolve) => {
            addImageToChat(file);
            setTimeout(resolve, 300);
        });

        const question =
        document
        .getElementById(
            "message"
        )
        .value
        .trim()
        ||
        "Что изображено на картинке?";

        const formData =
        new FormData();

        formData.append(
            "image",
            file
        );

        formData.append(
            "question",
            question
        );

        const aiId =
        "img_" + Date.now();

        chat.innerHTML += `
        <div class="message">
            <div class="avatar user-avatar">
                📷
            </div>
            <div class="user">
                ${question}
            </div>
        </div>

        <div class="message">
            <div class="avatar ai-avatar">
                🤖
            </div>
            <div class="ai" id="${aiId}">
                Анализирую...
            </div>
        </div>
        `;

        scrollBottom();

        try{

            const response =
            await fetch(
                "/analyze_image",
                {
                    method:"POST",
                    body:formData
                }
            );

            const data =
            await response.json();

            document
            .getElementById(
                aiId
            )
            .innerHTML =
            data.reply;

        }catch(error){

            document
            .getElementById(
                aiId
            )
            .innerHTML =
            "Ошибка анализа";
        }

        saveChat();

        scrollBottom();
    }
);

function addImageToChat(file){

    const reader =
    new FileReader();

    reader.onload =
    function(e){

        chat.innerHTML += `
        <div class="message">
            <div class="avatar user-avatar">
                📷
            </div>
            <div class="user">
                <img
                src="${e.target.result}"
                style="
                max-width:200px;
                border-radius:12px;
                margin-top:5px;
                ">
            </div>
        </div>
        `;

        saveChat();

        scrollBottom();
    };

    reader.readAsDataURL(
        file
    );
}



function copyMessage(button){

    const text =
    button.parentElement
    .querySelector(
        ".ai-content"
    )
    .innerText;

    navigator.clipboard.writeText(
        text
    );

    showToast(
        "✅ Ответ скопирован"
    );
}

function showToast(text){

    const toast =
    document.createElement(
        "div"
    );

    toast.className =
    "toast";

    toast.innerText =
    text;

    document.body.appendChild(
        toast
    );

    setTimeout(
        function(){
            toast.remove();
        },
        2000
    );
}

window.addEventListener(
    "scroll",
    function(){

        const btn =
        document.getElementById(
            "scrollBottomBtn"
        );

        if(
            window.scrollY > 300
        ){
            btn.style.display =
            "block";
        }else{
            btn.style.display =
            "none";
        }
    }
);

function formatAI(text){

    return text

    .replace(
        /```([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>"
    )

    .replace(
        /\*\*(.*?)\*\*/g,
        "<b>$1</b>"
    )

    .replace(
        /`([^`]+)`/g,
        "<code>$1</code>"
    )

    .replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    )

    .replace(
        /^# (.*)$/gm,
        "<h1>$1</h1>"
    )

    .replace(
        /^\- (.*)$/gm,
        "• $1"
    )

    .replace(
        /\n/g,

        "<br>"
    );
}


if(
    "serviceWorker"
    in navigator
){
    navigator
    .serviceWorker
    .register(
        "/sw.js"
    )
    .then(
        function(){

            console.log(
                "NovaMind PWA OK"
            );
        }
    )
    .catch(
        function(error){

            console.log(
                error
            );
        }
    );
}


if(
    "serviceWorker"
    in navigator
){
    navigator
    .serviceWorker
    .register(
        "/sw.js"
    )
    .then(
        function(){

            console.log(
                "NovaMind PWA OK"
            );
        }
    )
    .catch(
        function(error){

            console.log(
                error
            );
        }
    );
}


function speakText(text){

    if(!window.speechSynthesis){
        return;
    }

    speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(
        text
    );

    speech.lang =
    "ru-RU";

    speech.rate =
    1;

    speechSynthesis.speak(
        speech
    );
}

if("serviceWorker" in navigator){

    navigator.serviceWorker.addEventListener(
        "controllerchange",
        function(){
            location.reload();
        }
    );

    navigator.serviceWorker.getRegistration()
    .then(function(reg){

        if(!reg){
            return;
        }

        setInterval(
            function(){
                reg.update();
            },
            60000
        );

        reg.addEventListener(
            "updatefound",
            function(){

                const newWorker =
                reg.installing;

                newWorker.addEventListener(
                    "statechange",
                    function(){

                        if(
                            newWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ){

                            showToast(
                                "🔄 NovaMind обновлён"
                            );

                            newWorker.postMessage(
                                {
                                    action:"skipWaiting"
                                }
                            );
                        }
                    }
                );
            }
        );
    });
}

