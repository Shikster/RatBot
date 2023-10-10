// ==UserScript==
// @name         RatBot
// @namespace    https://github.com/Shikster/RatBot.git
// @version      1.8
// @description  Eep! I found someone!
// @author       Shikii
// @match        https://aberoth.com/*
// @icon         https://static.wikia.nocookie.net/bookofaberoth/images/a/af/Rat.gif/revision/latest/thumbnail/width/360/height/360?cb=20170606123406
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// Function to display a popup for adding names to the nameList
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
	
	textArea.addEventListener('keydown',(event)=>{
		event.stopPropagation();
	})	
	
}

// Function to create the setup menu
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
         <b>ADD NAMES:</b> Paste names you want to be skipped (whitelisted) like this: Name1, Name2, Name3,...
         </div>
         <div>
         <b>SOUND:</b> Plays Metal Gear's "!" sound when a player is detected by default but can be changed in the audio field.
         </div>
        <h2>Setup</h2>
        <label for="discordUrl">Discord Webhook URL:</label><br>
        <input type="text" id="discordUrl" name="discordUrl" value="${GM_getValue("DISCORDURL", "")}" required><br><br>
        <label for="myName">Your Scout Name:</label><br>
        <input type="text" id="myName" name="myName" value="${GM_getValue("MY_NAME", "")}" required><br><br>
        
        <label for="discordUrl2">Discord Webhook URL 2 (Whitelisted Users):</label><br>
        <input type="text" id="discordUrl2" name="discordUrl2" value="${GM_getValue("DISCORDURL2", "")}" required><br><br>
		
        <label for="mySound">Change audio. Full link to a .mp3 file:</label><br>
        <input type="text" id="mySound" name="mySound" value="${GM_getValue("MY_AUDIO", "")}" required><br><br>

        <h2>Add Names</h2>
         <div>
         <b>Adding players:</b> Click the button below to add names to the whitelist. Names on this list will be skipped from scouting. Every name that is not on this list will send a message to Discord and/or play a sound effect.
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
    const discordUrlInput2 = setupContainer.querySelector("#discordUrl2"); 
    const myNameInput = setupContainer.querySelector("#myName");
    const myAudioInput = setupContainer.querySelector("#mySound")

    saveButton.addEventListener("click", () => {
        const discordUrl = discordUrlInput.value;
        const discordUrl2 = discordUrlInput2.value; 
        const myName = myNameInput.value;
	const mySound = myAudioInput.value;
        GM_setValue("DISCORDURL", discordUrl);
        GM_setValue("DISCORDURL2", discordUrl2); 
        GM_setValue("MY_NAME", myName);
	GM_setValue("MY_AUDIO", mySound);
        document.body.removeChild(setupContainer);
    });
	
	setupContainer.addEventListener('keydown',(event)=>{
		event.stopPropagation();
	})
}

// Create and initialize setup button and other UI elements
const setupButton = document.createElement("button");
setupButton.textContent = "SETUP";
setupButton.style.width = '80px';
document.body.appendChild(setupButton);

setupButton.addEventListener("click", () => {
createSetupMenu();   
 //window.location.href = "https://aberoth.com/download.html";
    setTimeout(() => {
        if (document.getElementById("uniqueElementOnDownloadPage")) {
            createSetupMenu();
        }
    }, 1000);
});

if (window.location.href === "https://aberoth.com/download.html") {
	createSetupMenu();
}

// Variables for controlling bot behavior
let isDetecting = true;
let useNameList = true;

//Excluded list
const excludedNames = ["Tavelor", "Gomald", "Orc", "Rogue", "Thief", 
"Wolf", "Alchemist", "Bat", "Black Bat", "Disciple", "Forstyll", "Grand Shaman",
"Lich", "Master Alchemist", "Master Thief", "Minotaur", "Ourik", "Plague Rat", "Rat",
"Ratingar", "Rattle Snake", "Satyr", "Satyr Elder", "Shaman", "Skaldor", "Skeleton",
"Skelet Rat", "Skelet Wolf", "Vampire Bat"];

// Toggle buttons for detecting and using the name list
const toggleBtn = document.createElement('button');
toggleBtn.textContent = 'DETECTING ON';
toggleBtn.style.width = '150px';
document.body.appendChild(toggleBtn);

toggleBtn.addEventListener('click', () => {
    isDetecting = !isDetecting;
    toggleBtn.textContent = isDetecting ? 'DETECTING ON' : 'DETECTING OFF';
});

// Retrieve the name list from GM storage
const nameList = GM_getValue("NAME_LIST", []);

// Function to determine if a username should be detected
function shouldDetect(username) {
    if (useNameList) {
        return !nameList.includes(username); // Detect if the username is not in the nameList
    } else {
        return true; // Always detect if the whitelist is not used
    }
}

// Function to display the name list in a popup
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

// Button to view the name list
const viewNameListBtn = document.createElement('button');
viewNameListBtn.textContent = 'VIEW NAMELIST';
document.body.appendChild(viewNameListBtn);

viewNameListBtn.addEventListener('click', () => {
    displayNameListPopup();
});

// Constants and variables for bot behavior
const MY_NAME = GM_getValue("MY_NAME", "");
const DISCORDURL = GM_getValue("DISCORDURL", "");
const COOLDOWN_TIMER = 30 * 60 * 1000; // 30 minute cooldown before a user can be detected again
const skippedNameCooldown = new Map();
const SKIPPED_NAME_COOLDOWN_TIME = 30 * 60 * 1000; // 30 minute cooldown for skipped names (adjust as needed).

let usersInRoom = [];
let cooldown = new Map();
let unpingable = [];

// Main loop for detecting users
setInterval(() => {
    if (!isDetecting) {
        return;
    }

usersInRoom = [];
let invisFound = false; // Flag to track if Invis has been found
for (let key in app.game.Bc.DA) {
    let username = app.game.Bc.DA[key]['H1'];
    let color = app.game.Bc.DA[key]['color'];

    if (username === "You hear faint noises nearby." && color === "white" && !invisFound) {
        // Push Invis into the array only if color is "white" and Invis hasn't been added yet.
        usersInRoom.push(username);
        invisFound = true; // Set the flag to true to indicate Invis has been added.
    } else if (color === "#ffffff" || color === "#ffafaf" ) {
        // Push other users with the specified colors into the array.
        if (!usersInRoom.includes(username)) {
            usersInRoom.push(username);
        }
    }
}

for (let user of usersInRoom) {
    if (!cooldown.has(user) && !unpingable.includes(user)) {
        if (!nameList.includes(user)) {
            if (useNameList) {
                postUser(user);
            } else if (user !== MY_NAME) {
                postUser(user);
            }
            const currentTime = new Date().toLocaleTimeString();
            console.log(user, " entered at", currentTime);
            cooldown.set(user, Date.now());
        } else {
            postSkippedName(user);
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

// Variable for controlling the sound
let isSoundEnabled = true;
const soundToggleButton = document.createElement('button');
soundToggleButton.textContent = 'SOUND ON';
soundToggleButton.style.width = '150px';
document.body.appendChild(soundToggleButton);

soundToggleButton.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggleButton.textContent = isSoundEnabled ? 'SOUND ON' : 'SOUND OFF';
});


// Function to post a user to Discord
const postUser = (username) => {
    const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false };
    const currentTimeHere = new Date().toLocaleTimeString('en-US', { ...options, timeZone: 'Europe/Berlin' });
    const currentTimestamp = Math.floor(Date.now() / 1000);

if (isSoundEnabled) {
    const customSoundUrl = GM_getValue("MY_AUDIO", ""); 
    if (customSoundUrl) {
        const audio = new Audio(customSoundUrl);
        audio.play();
    } else {
        // If the custom sound URL is not set, play a default sound or handle it as needed.
        const defaultSoundUrl = 'https://us-tuna-sounds-files.voicemod.net/a37fc336-638e-469e-99a6-c27a71ae9655-1640243756594.mp3';
        const audio = new Audio(defaultSoundUrl);
        audio.play();
    }
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
    )
}

// Function to post skipped names to the webhook with cooldown
function postSkippedName(username) {
    const DISCORDURL2 = GM_getValue("DISCORDURL2", "");
    const myName = GM_getValue("MY_NAME", ""); // Get the value from "MyName" field

    if (DISCORDURL2 && !excludedNames.includes(username) && username !== myName) {
        const currentTime = Date.now();
        const currentTimestamp = Math.floor(currentTime / 1000);

        if (!skippedNameCooldown.has(username) || currentTime - skippedNameCooldown.get(username) >= SKIPPED_NAME_COOLDOWN_TIME) {
            fetch(
                `${DISCORDURL2}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'Rat',
                        avatar_url: "https://i.imgur.com/9SIkuLc.png",
                        content: `I saw an ally: **${username}** <t:${currentTimestamp}:R>! Squeek!` // Modify the message as needed.
                    })
                }
            );
            skippedNameCooldown.set(username, currentTime);
        }
    }
}

