console.log ("meow meow meow");

const myCat = document.getElementById("kitty");
const foodBtn = document.getElementById("foodBtn");
const cleanBtn = document.getElementById("clean");
const talkBtn = document.getElementById("talk");
const learnBtn = document.getElementById("learn");
const msgInput = document.getElementById("msg-input");
const speechBubble = document.getElementById("speech-bubble");
const mouthsquare = document.getElementById("mouth-pink");
const mouthtalk = document.getElementById("mouth-talk");
const upset = document.getElementById("upset");
const food = document.getElementById("food");
const bowl = document.getElementById("bowl");
let mood = 1;
let isHungry = false;
let isClean = false;
let hungryRando = 0;
let cleanRando = 0;
let catMeow = new Audio("sounds/cat-purrmeow.mp3");
let catFood = new Audio("sounds/food.mp3");
let weHaveAMatch = false;

/////// SPEECH RECOGNITION ///////
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = "en-GB";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

talkBtn.addEventListener("click", () => {
    recognition.start();
    console.log("i listen meow");
});

recognition.onresult = (event) => {
    const receivedText = event.results[0][0].transcript;
    recognition.stop();
    console.log(receivedText);
    // if (receivedText === "hello") {
    //     speakThis();
    // }

    handleInput(receivedText);
};

const handleInput = (msg) => {
    if (!activeLearn) {
        parseMsg(msg);
    }
    else if (activeLearn && step1) {
        parseKeyword(msg);
    }
    else if (activeLearn && step2) {
        parseDefinition(msg);
    }
};

const speakThis = (msg) => {
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.pitch = 2;
    speechSynthesis.speak(utterance);
    
    //rise mood lvl
    mood = 1.2;

    // mouth animation
    let wordCount = msg.split(" ").length;
    let speakTimer = wordCount * 300;
    mouthsquare.style.display = "block";
    mouthtalk.style.display = "block";
    mouthsquare.classList.add("move-me-delay");
    mouthtalk.classList.add("move-me-delay");
    setTimeout(() => {
        mouthsquare.style.display = "none";
        mouthtalk.style.display = "none";
        mouthsquare.classList.remove("move-me-delay");
        mouthtalk.classList.remove("move-me-delay");
        speechBubble.innerHTML = "";
        speechBubble.style.visibility = "hidden";
        weHaveAMatch = false;
    }, speakTimer);
}

/////// SPEECH RECOGNITION DONE ///////

/////// INPUT FIELD ///////

const patternTest = (regex, msg) => {
    let result = regex.test(msg);
    return result;
};

const callJSONData = async (msg) => {
    const response = await fetch('data/data.json');
    const jsonData = await response.json();
    console.log(jsonData);
    if (jsonData.length !== 0) {
        jsonData[0].queries.forEach((item, index) => {
            //reg exp
            // let pattern = /cat food/gi;
            let regex = new RegExp(item.question, "gi");
            if (patternTest(regex, msg)) {
                
                let randomize = Math.floor(Math.random() * item.answer.length);
                console.log("match: " + item.answer[randomize]);
                speakThis(item.answer[randomize]);
                speechBubble.innerHTML = item.answer[randomize];
                speechBubble.style.visibility = "visible";
                weHaveAMatch = true;
            }
        })
    }
};

const callStorage = (msg) => {
    for (const [key, value] of Object.entries(localStorage)) {
        if (key.substring(0, 4) === "key-") {
            let regex = new RegExp(key.substring(5), "gi");
            if (patternTest(regex, msg)) {
                console.log("match: " + value);
                speakThis(value);
                speechBubble.innerHTML = value;
                speechBubble.style.visibility = "visible";
                weHaveAMatch = true;
            }
        
        }
    }
}

const parseMsg = (msg) => {
    msgInput.value = null;
    // speakThis();
    console.log(msg);
    // msg = msg.toLowerCase();
    // if (msg.includes("hello")) {
    //     speakThis();
    // }
    
    // if (msg.match(pattern)) {
    //     console.log("wanna eat");
    // }
    
    callJSONData(msg);

    if (!weHaveAMatch) {
        callStorage(msg);
    }
};



setInterval(() => {
    // console.log(myCat.getBoundingClientRect().y);
    console.log("mood: " + mood);
    mood /= 1.005;

    //hunger
    console.log("is hungry: " + isHungry);
    if (hungryRando === 9 && !isHungry) {
        isHungry = true;
        mood = 0.69;
        food.style.display = "none";
    }
    else {
        hungryRando = Math.floor(Math.random() * 40);
    }


    const poop = document.getElementById("poop");

    //clean bored
    console.log("is clean: " + isClean);
    if (cleanRando === 17 && !isClean) {
        isClean = true;
        mood = 0.69;
        poop.style.display = "inline-block";

    }
    else {
        cleanRando = Math.floor(Math.random() * 50);
    }

    if (mood < 0.7 && mood > 0.45) {
        // console.log("upset");
        upset.style.display = "inline-block";
    }

    if (mood < 0.45) {
        upset.classList.add("move-upset");
    }

    if (mood >= 1) {
        upset.style.display = "none";
        upset.classList.remove("move-upset");
    }

}, 500);

foodBtn.addEventListener("click", () => {
    console.log("feed meow");
    mood = 1.5;
    catFood.play();
    isHungry = false;
    food.style.display = "inline-block";
    
})

cleanBtn.addEventListener("click", () => {
    console.log("clean meow");
    mood = 2;
    isClean = false;
    catMeow.play();
    poop.style.display = "none";
})

let activeLearn = false;
let step1 = false;
let step2 = false;
let travelKey = "";

learnBtn.addEventListener("click", () => {
    console.log("learn meow");
    let msg = "Learn time neow meow";
    speakThis(msg);
    speechBubble.innerHTML = msg;
    speechBubble.style.visibility = "visible";

    //change the mood
    mood = 2;

    setTimeout(() => {
        activeLearn = true;
        recognition.start();
        step1 = true;
    }, 2000);
});

const parseKeyword = (keyword) => {
    console.log("learning: " + keyword);
    travelKey = keyword;
    let msg = "Ok! I am all ears meow";
    speakThis(msg);
    speechBubble.innerHTML = msg;
    speechBubble.style.visibility = "visible";
    step1 = false;
    setTimeout(() => {
        recognition.start();
        step2 = true;
    }, 1500);
};

const parseDefinition = (definition) => {
    console.log("recording: " + definition);

    localStorage.setItem(`key-${travelKey}`, definition);

    let msg = "Ok! I will remember that meow";
    speakThis(msg);
    speechBubble.innerHTML = msg;
    speechBubble.style.visibility = "visible";

    activeLearn = false;
    step2 = false;
};