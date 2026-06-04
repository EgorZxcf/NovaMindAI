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
    };

    recognition.onerror =
    function(){

        alert(
            "Ошибка распознавания"
        );
    };
}
