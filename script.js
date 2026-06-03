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
            ● ● ●
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
        data.reply;

        saveChat();

        scrollBottom();

    }catch(error){

        document
        .getElementById(aiId)
        .innerHTML =
        "Ошибка подключения";
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

    updateStats();
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

    alert(
        "Голосовой ввод будет подключен позже"
    );
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
