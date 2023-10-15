// ==UserScript==
// @name         RatBot
// @namespace    https://github.com/Shikster/RatBot.git
// @version      2.0
// @description  Eep! I found someone!
// @author       Shikii
// @match        https://aberoth.com/*
// @icon         https://static.wikia.nocookie.net/bookofaberoth/images/a/af/Rat.gif/revision/latest/thumbnail/width/360/height/360?cb=20170606123406
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// Function to display a popup for adding names to the nameList
function displayPasteNamesPopup() {
    // Create a popup container
    const popupContainer = document.createElement('div');
    popupContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border: 1px solid #ccc;
        z-index: 1000;
        color: black;
    `;
    document.body.appendChild(popupContainer);

    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginBottom = '10px';
    popupContainer.appendChild(closeButton);

    // Text area for input
    const textArea = document.createElement('textarea');
    textArea.placeholder = 'Type or paste usernames separated by commas';
    textArea.style.cssText = `
        width: 100%;
        height: 100px;
        resize: none;
    `;
    popupContainer.appendChild(textArea);

    // Add button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add to NameList';
    addButton.style.marginTop = '10px';
    popupContainer.appendChild(addButton);

    // Event listeners
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popupContainer);
    });

addButton.addEventListener('click', () => {
    const usernames = textArea.value.split(',').map(username => username.trim());
    const validUsernames = usernames.filter(username => username !== '');
    
    // Remove duplicates from the validUsernames list
    const uniqueUsernames = [...new Set(validUsernames)];
    
    // Filter out the usernames that are already in nameList
    const newNames = uniqueUsernames.filter(username => !nameList.includes(username));

    // Add the new names to nameList
    nameList.push(...newNames);
    
    textArea.value = '';
    console.log('Updated nameList:', nameList);
    GM_setValue("NAME_LIST", nameList);
    document.body.removeChild(popupContainer);
});


    textArea.addEventListener('keydown', (event) => {
        // Prevent event propagation
        event.stopPropagation();
    });
}

// Function to create the setup menu
function createSetupMenu() {
    const setupContainer = document.createElement('div');
    setupContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border: 1px solid #ccc;
        z-index: 1000;
        color: black;
        overflow-y: auto;
    `;

    setupContainer.innerHTML = `
        <!-- Your setup menu HTML -->
        <div style="max-height: 500px; overflow-y: auto;">
            <h2>Information</h2>
            <div><b>DETECT ON/OFF:</b> Turns rat bot on or off.</div>
            <div><b>ADD NAMES:</b> Paste names you want to be skipped (whitelisted) like this: Name1, Name2, Name3,...</div>
            <div><b>SOUND:</b> Plays a radar sound when a player is detected by default, but can be changed in the audio field.</div>

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
            <div><b>Adding players:</b> Click the button below to add names to the whitelist. Names on this list will be skipped from scouting. Every name that is not on this list will send a message to Discord and/or play a sound effect.</div>
            <br>
            <button id="addNamesButton">Add names</button>
            <br>
            <br>
            <button id="saveButton">Save</button>
        </div>
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
    const myAudioInput = setupContainer.querySelector("#mySound");

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

    setupContainer.addEventListener('keydown', (event) => {
        // Prevent event propagation
        event.stopPropagation();
    });
}

// Create and initialize setup button and other UI elements
const setupButton = document.createElement("button");
setupButton.textContent = "SETUP";
setupButton.style.width = '80px';
document.body.appendChild(setupButton);

setupButton.addEventListener("click", () => {
    createSetupMenu();

    // Check for a unique element on the download page
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

// Excluded list
const excludedNames = [
    "Tavelor", "Gomald", "Orc", "Rogue", "Thief",
    "Wolf", "Alchemist", "Bat", "Black Bat", "Disciple", "Forstyll", "Grand Shaman",
    "Lich", "Master Alchemist", "Master Thief", "Minotaur", "Ourik", "Plague Rat", "Rat",
    "Ratingar", "Rattle Snake", "Satyr", "Satyr Elder", "Shaman", "Skaldor", "Skeleton",
    "Skelet Rat", "Skelet Wolf", "Vampire Bat", "Inala", "Sholop", "Lysis", "Darklow", "Wodon",
    "Magerlin", "Gurun"
];

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
    popupContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border: 1px solid #ccc;
        z-index: 1000;
        color: black;
        overflow: auto;
        max-height: 70vh;
    `;
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
        nameContainer.style.cssText = `
            display: flex;
            align-items: center;
        `;

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
}, 500);

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

//Scouting for unknowns, and making screenshot
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

const postUser = (username) => {
    const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false };
    const currentTimeHere = new Date().toLocaleTimeString('en-US', { ...options, timeZone: 'Europe/Berlin' });
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const myName = GM_getValue("MY_NAME", ""); // Get the value from "MyName" field

    if (!excludedNames.includes(username) && username !== myName) {
        if (isSoundEnabled) {
            const customSoundUrl = GM_getValue("MY_AUDIO", "");
            if (customSoundUrl) {
                const audio = new Audio(customSoundUrl);
                audio.play();
            } else {
                // If the custom sound URL is not set, play a default sound or handle it as needed.
                const defaultSoundUrl = 'https://us-tuna-sounds-files.voicemod.net/cb9d618a-1795-4c5d-923a-61c767040b3e-1687765406207.mp3';
                const audio = new Audio(defaultSoundUrl);
                audio.play();
            }

            // Capture the game canvas and convert to a File
            var gameCanvas = document.getElementById('screen');
            var pngDataUrl = gameCanvas.toDataURL('image/png');
            var pngFile = dataURLtoFile(pngDataUrl, 'screenshot.png');

            // Create a FormData object
            const formData = new FormData();
            formData.append('file', pngFile); // Append the screenshot file

            formData.append('username', 'Rat');
            formData.append('avatar_url', 'https://i.imgur.com/9SIkuLc.png');
            formData.append('content', `I found: **${username}** <t:${currentTimestamp}:R>! Squeek!`);

            fetch(
                `${DISCORDURL}`,
                {
                    method: 'POST',
                    body: formData, // Use the FormData object as the request body
                }
            );
        }
    }
}

//Scouting allies
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
