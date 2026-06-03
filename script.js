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

async function typeText(element,text){

    element.innerHTML = "";

    for(let i=0;i<text.length;i++){

        element.innerHTML += text[i];

        scrollBottom();

        await new Promise(
            resolve => setTimeout(resolve,10)
        );
    }

    saveChat();
}

async function sendMessage(){

    const input =
    document.getElementById("message");

    const model =
    document.getElementById("model").value;

    const text =
    input.value.trim();

    if(!text) return;

    chat.innerHTML +=
    `<div class="user">${text}</div>`;

    input.value = "";

    saveChat();

    const aiId =
    "ai_" + Date.now();

    chat.innerHTML +=
    `<div class="ai" id="${aiId}">
        ● ● ●
    </div>`;

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

        const aiDiv =
        document.getElementById(aiId);

        await typeText(
            aiDiv,
            data.reply
        );

    }catch(error){

        document
        .getElementById(aiId)
        .innerHTML =
        "Ошибка подключения";

        console.log(error);
    }
}

async function clearChat(){

    localStorage.removeItem(
        "novamind_chat"
    );

    chat.innerHTML = "";

    await fetch(
        "https://novamindai-q6q6.onrender.com/new_chat",
        {
            method:"POST"
        }
    );
}

document
.getElementById("message")
.addEventListener(
    "keypress",
    function(event){

        if(event.key==="Enter"){
            sendMessage();
        }

    }
);
