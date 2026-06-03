const API_URL = "https://novamindai-q6q6.onrender.com/chat";

const chat = document.getElementById("chat");

loadChat();

function saveChat(){
    localStorage.setItem("novamind_chat", chat.innerHTML);
}

function loadChat(){
    const history = localStorage.getItem("novamind_chat");

    if(history){
        chat.innerHTML = history;
    }
}

async function sendMessage(){

    const input = document.getElementById("message");

    const text = input.value.trim();

    if(!text) return;

    chat.innerHTML += `
        <div class="user">${text}</div>
    `;

    input.value = "";

    saveChat();

    chat.innerHTML += `
        <div class="ai" id="loading">
            ● ● ●
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

    try{

        const response = await fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                message:text
            })
        });

        const data = await response.json();

        document.getElementById("loading").remove();

        chat.innerHTML += `
            <div class="ai">
                ${data.reply}
            </div>
        `;

        saveChat();

        chat.scrollTop = chat.scrollHeight;

    }catch(error){

        document.getElementById("loading").innerHTML =
            "Ошибка подключения";

        console.log(error);
    }
}

document
.getElementById("message")
.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        sendMessage();
    }

});

function clearChat(){

    localStorage.removeItem("novamind_chat");

    chat.innerHTML = "";

}
