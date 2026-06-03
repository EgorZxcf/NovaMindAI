const API_URL = "https://novamindai-q6q6.onrender.com/chat";

async function sendMessage(){

    const input = document.getElementById("message");
    const chat = document.getElementById("chat");

    const text = input.value.trim();

    if(!text) return;

    chat.innerHTML += `
        <div class="user">${text}</div>
    `;

    input.value = "";

    chat.innerHTML += `
        <div class="ai" id="loading">
            Думаю...
        </div>
    `;

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

        chat.scrollTop = chat.scrollHeight;

    }catch(error){

        document.getElementById("loading").innerHTML =
            "Ошибка подключения";

        console.log(error);
    }
}
