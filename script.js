const API_URL = "https://novamindai-q6q6.onrender.com/chat";

const chat = document.getElementById("chat");

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

    scrollBottom();
}

async function sendMessage(){

    const input =
    document.getElementById("message");

    const model =
    document.getElementById("model").value;

    const text =
    input.value.trim();

    if(!text) return;

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

    input.value = "";

    saveChat();

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

    scrollBottom();

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

document
.getElementById("message")
.addEventListener(
"keypress",
function(event){

    if(event.key==="Enter"){
        sendMessage();
    }

});
