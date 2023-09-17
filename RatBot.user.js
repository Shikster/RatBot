// ==UserScript==
// @name         RatBot
// @namespace    https://github.com/Shikster/RatBot.git
// @version      1.5
// @description  Eep! I found someone!
// @author       Shikii
// @match        https://aberoth.com/*
// @icon         https://static.wikia.nocookie.net/bookofaberoth/images/a/af/Rat.gif/revision/latest/thumbnail/width/360/height/360?cb=20170606123406
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

function displayPasteNamesPopup() {
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.background = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.border = '1px solid #ccc';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.color = 'black';
    document.body.appendChild(popupContainer);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginBottom = '10px'; 
    popupContainer.appendChild(closeButton);

    const textArea = document.createElement('textarea');
    textArea.placeholder = 'Type or paste usernames separated by commas';
    textArea.style.width = '100%';
    textArea.style.height = '100px';
    textArea.style.resize = 'none';
    popupContainer.appendChild(textArea);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to NameList';
    addButton.style.marginTop = '10px'; 
    popupContainer.appendChild(addButton);
	
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popupContainer);
    });


    addButton.addEventListener('click', () => {
        const usernames = textArea.value.split(',').map(username => username.trim());
        const validUsernames = usernames.filter(username => username !== '');
        nameList.push(...validUsernames);
        textArea.value = '';
        console.log('Updated nameList:', nameList);
        GM_setValue("NAME_LIST", nameList);
        document.body.removeChild(popupContainer);
    });
}


function createSetupMenu() {
    const setupContainer = document.createElement('div');
    setupContainer.style.position = 'fixed';
    setupContainer.style.top = '50%';
    setupContainer.style.left = '50%';
    setupContainer.style.transform = 'translate(-50%, -50%)';
    setupContainer.style.background = 'white';
    setupContainer.style.padding = '20px';
    setupContainer.style.border = '1px solid #ccc';
    setupContainer.style.zIndex = '1000';
    setupContainer.style.color = 'black';
    setupContainer.style.overflowY = 'auto';

    setupContainer.innerHTML = `
        <!-- Your setup menu HTML -->
		 <div style="max-height: 500px; overflow-y: auto;">
        <h2>Information</h2>
         <div>
         <b>AFK ON/OFF:</b> When turned on, it will send a pause key up event every x minutes to prevent camping.
         </div>
         <div>
         <b>DETECT ON/OFF:</b> Turns rat bot on or off.
         </div>
         <div>
         <b>NAMELIST ON/OFF:</b> If on, will use your namelist. If off, detects ALL names on screen. Useful for figuring out who's active when.
         </div>
         <div>
         <b>ADD NAMES:</b> Paste names you want to be detected like this: Name1, Name2, Name3,...
         </div>
         <div>
         <b>SOUND:</b> Plays Metal Gear's "!" sound when a player is detected.
         </div>
        <h2>Setup</h2>
        <label for="discordUrl">Discord Webhook URL:</label><br>
        <input type="text" id="discordUrl" name="discordUrl" value="${GM_getValue("DISCORDURL", "")}" required><br><br>
        <label for="myName">Your Scout Name:</label><br>
        <input type="text" id="myName" name="myName" value="${GM_getValue("MY_NAME", "")}" required><br><br>

		<!-- "ADD NAMES" section -->
        <h2>Add Names</h2>
		 <div>
         <b>Adding players:</b> Click the button below to add names to the list you want Rat Bot to scout for. Names on this list will trigger the sound effect and/or send a message to your discord webhook if you have that option enabled.
         </div>
        <br>
        <button id="addNamesButton">Add names</button>
		<br>
        <br>
		<button id="saveButton">Save</button>


    `;

    document.body.appendChild(setupContainer);
    const addNamesButton = setupContainer.querySelector('#addNamesButton');
    addNamesButton.addEventListener('click', () => {
        displayPasteNamesPopup();
    });

    const saveButton = setupContainer.querySelector("#saveButton");
    const discordUrlInput = setupContainer.querySelector("#discordUrl");
    const myNameInput = setupContainer.querySelector("#myName");

    saveButton.addEventListener("click", () => {
        const discordUrl = discordUrlInput.value;
        const myName = myNameInput.value;
        GM_setValue("DISCORDURL", discordUrl);
        GM_setValue("MY_NAME", myName);
        document.body.removeChild(setupContainer);
    });
}


const setupButton = document.createElement("button");
setupButton.textContent = "SETUP";
setupButton.style.width = '80px';
document.body.appendChild(setupButton);

setupButton.addEventListener("click", () => {
    window.location.href = "https://aberoth.com/download.html";
    setTimeout(() => {
        if (document.getElementById("uniqueElementOnDownloadPage")) {
            createSetupMenu();
        }
    }, 1000);
});

if (window.location.href === "https://aberoth.com/download.html") {

    createSetupMenu();
}



let afkinterval;
let clicked = true;
const btn = document.createElement('button');
btn.textContent = 'AFK ON'; 
btn.setAttribute('id', 'afkbtn');
btn.style.width = '80px'; 
document.body.appendChild(btn);

btn.addEventListener('click', () => {
    clicked = !clicked;
    if (clicked) {
        afkinterval = setInterval(() => {
            document.body.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 19 }));
            document.body.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 19 }));
        }, 10000);
    } else {
        clearInterval(afkinterval);
        document.body.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 19 }));
    }
    btn.textContent = clicked ? 'AFK ON' : 'AFK OFF'; 
});

let isDetecting = true;
let useNameList = true;

const toggleBtn = document.createElement('button');
toggleBtn.textContent = 'DETECTING ON';
toggleBtn.style.width = '150px';
document.body.appendChild(toggleBtn);

const useNameListBtn = document.createElement('button');
useNameListBtn.textContent = 'NAMELIST ON';
useNameListBtn.style.width = '150px';
document.body.appendChild(useNameListBtn);

toggleBtn.addEventListener('click', () => {
    isDetecting = !isDetecting;
    toggleBtn.textContent = isDetecting ? 'DETECTING ON' : 'DETECTING OFF';
});

useNameListBtn.addEventListener('click', () => {
    useNameList = !useNameList;
    useNameListBtn.textContent = useNameList ? 'NAMELIST ON' : 'NAMELIST OFF';
});

const nameList = GM_getValue("NAME_LIST", []);

function displayNameListPopup() {
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.background = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.border = '1px solid #ccc';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.color = 'black'; 
    popupContainer.style.overflow = 'auto'; 
    popupContainer.style.maxHeight = '70vh'; 

    document.body.appendChild(popupContainer);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginBottom = '10px';
    popupContainer.appendChild(closeButton);

    const nameListContainer = document.createElement('ul');
    popupContainer.appendChild(nameListContainer);

    nameList.forEach(name => {
		
        const listItem = document.createElement('li');
        const nameContainer = document.createElement('div');
        nameContainer.style.display = 'flex';
        nameContainer.style.alignItems = 'center';
		
        const nameElement = document.createElement('span');
        nameElement.textContent = name;
        nameContainer.appendChild(nameElement);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.style.marginLeft = '10px';
        removeButton.addEventListener('click', () => {
			
            const index = nameList.indexOf(name);
            if (index !== -1) {
                nameList.splice(index, 1);
                nameListContainer.removeChild(listItem);
                GM_setValue("NAME_LIST", nameList);
            }
        });

        nameContainer.appendChild(removeButton);
        listItem.appendChild(nameContainer);
        nameListContainer.appendChild(listItem);
    });

    closeButton.addEventListener('click', () => {
        document.body.removeChild(popupContainer);
    });
}

const viewNameListBtn = document.createElement('button');
viewNameListBtn.textContent = 'VIEW NAMELIST';
document.body.appendChild(viewNameListBtn);

viewNameListBtn.addEventListener('click', () => {
    displayNameListPopup();
});



const MY_NAME = GM_getValue("MY_NAME", "");
const DISCORDURL = GM_getValue("DISCORDURL", "");
const COOLDOWN_TIMER = 30 * 60 * 1000; // 30 minute cooldown before a user can be detected again
let usersInRoom = [];
let cooldown = new Map();
let unpingable = [];

setInterval(() => {
    if (!isDetecting) {
        return;
    }

    usersInRoom = [];
    for (let key in app.game.Bc.DA) {
        let username = app.game.Bc.DA[key]['H1'];

        if (username === "Tavelor") {
            continue; // Skip scanning Tavelor, if an expanded exclusion list becomes necessary it can be added in the future.
        }

        if (app.game.Bc.DA[key]['color'] === "#ffffff") {
            if (!usersInRoom.includes(username)) {
                usersInRoom.push(username);
            }
        } else if (app.game.Bc.DA[key]['color'] === "#ffafaf") {
            if (!usersInRoom.includes(username)) {
                usersInRoom.push(username);
            }
        }
    }

    for (let user of usersInRoom) {
        if (!cooldown.has(user) && !unpingable.includes(user)) {

            if (useNameList) { 
                if (nameList.some(name => user.startsWith(name))) {
                    postUser(user);
                    const currentTime = new Date().toLocaleTimeString();
                    console.log(user, " entered at", currentTime);
                    cooldown.set(user, Date.now());
                }
            } else {
                if (user !== MY_NAME) {
                    postUser(user);
                    const currentTime = new Date().toLocaleTimeString();
                    console.log(user, " entered at", currentTime);
                    cooldown.set(user, Date.now());
                }
            }
        }
    }

    for (const [name, timestamp] of cooldown.entries()) {
        if (!usersInRoom.includes(name) && Date.now() - timestamp >= COOLDOWN_TIMER) {
            cooldown.delete(name);
            unpingable.splice(unpingable.indexOf(name), 1); 
            console.log(`${name} can be pinged again at`, new Date().toLocaleTimeString());
        }
    }
}, 1000);

let isSoundEnabled = true;
const soundToggleButton = document.createElement('button');
soundToggleButton.textContent = 'SOUND IS ON';
soundToggleButton.style.width = '150px';
document.body.appendChild(soundToggleButton);

soundToggleButton.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggleButton.textContent = isSoundEnabled ? 'SOUND IS ON' : 'SOUND IS OFF';
});

const postUser = (username) => {
    const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false };
    const currentTimeHere = new Date().toLocaleTimeString('en-US', { ...options, timeZone: 'Europe/Berlin' });
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (isSoundEnabled) {
        const audio = new Audio('https://us-tuna-sounds-files.voicemod.net/a37fc336-638e-469e-99a6-c27a71ae9655-1640243756594.mp3');
        audio.play();
    }

    fetch(
        `${DISCORDURL}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'Rat',
                avatar_url: "https://i.imgur.com/9SIkuLc.png",
                content: `I found: **${username}** <t:${currentTimestamp}:R>! Squeek!` // Change this line to your liking.
            })
        }
    );
};
