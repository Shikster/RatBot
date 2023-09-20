// ==UserScript==
// @name         RatBot
// @namespace    https://github.com/Shikster/RatBot.git
// @version      1.6
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



const friendName = "Shikii";
let friendCoords;
let selectedFriend = null; // Variable to track the selected friend
const myName = GM_getValue("MY_NAME", "");
let myCoords;

const UP = 87;
const DOWN = 83;
const LEFT = 65;
const RIGHT = 68;

const KeyPress = (code) => {
  document.body.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: code }));
};

const KeyUp = (code) => {
  document.body.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: code }));
};

let movementEnabled = false; // Variable to track if movement is enabled
let wasMovementEnabled = false; // Variable to track previous movement state

const startMoving = (H, V) => {
  // Release all keys
  KeyUp(UP);
  KeyUp(DOWN);
  KeyUp(LEFT);
  KeyUp(RIGHT);

  if (H > 0) { // Move right
    console.log("moving RIGHT");
    KeyPress(RIGHT);
  } else if (H < 0) { // Move left
    console.log("moving LEFT");
    KeyPress(LEFT);
  }

  if (V > 0) { // Move up (reverse sign for vertical movement)
    console.log("moving UP");
    KeyPress(UP);
  } else if (V < 0) { // Move down (reverse sign for vertical movement)
    console.log("moving DOWN");
    KeyPress(DOWN);
  }
};

const toggleMovement = () => {
  wasMovementEnabled = movementEnabled; // Store previous movement state
  movementEnabled = !movementEnabled; // Toggle the movement state

  if (!movementEnabled) {
    // Release all keys if movement is disabled
    KeyUp(UP);
    KeyUp(DOWN);
    KeyUp(LEFT);
    KeyUp(RIGHT);
  }
};

const ABORT = () => {
  // Call the ABORT function only when there's a change in movement state
  if (wasMovementEnabled) {
    console.log("Movement aborted");
  }
};

const selectFriend = (friend) => {
  selectedFriend = friend;
};

const createFriendMenu = () => {
  const menu = document.createElement("div");
  menu.id = "friendMenu";
  menu.style.display = "none"; // Hide the menu initially
  document.body.appendChild(menu);

  // Define the colors to check for
  const allowedColors = ["#ffffff", "#ffafaf"];

  // Populate the menu with available friends with allowed colors
  for (let key in app.game.Bc.DA) {
    let username = app.game.Bc.DA[key]['H1'];
    let color = app.game.Bc.DA[key]['color'];

    // Check if the color is in the allowed colors list
    if (allowedColors.includes(color)) {
      if (!usersInRoom.includes(username)) {
        const friendButton = document.createElement("button");
        friendButton.textContent = username;
        friendButton.addEventListener('click', () => {
          selectFriend(username);
          toggleMovement(); // Toggle the movement when a friend is selected
        });
        menu.appendChild(friendButton);

        usersInRoom.push(username);
      }
    }
  }

  // Create a button to close the menu
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener('click', () => {
    menu.style.display = "none"; // Hide the menu when the close button is clicked
  });
  menu.appendChild(closeButton);

  // Create a button to open the menu
  const openButton = document.createElement("button");
  openButton.textContent = "FOLLOW MENU";
  openButton.addEventListener('click', () => {
    menu.style.display = "block"; // Show the menu when the open button is clicked
  });
  document.body.appendChild(openButton);

  // Create a "STOP FOLLOW" button in the menu
  const stopFollowButton = document.createElement("button");
  stopFollowButton.textContent = "Stop Follow";
  stopFollowButton.addEventListener('click', () => {
    toggleMovement(); // Toggle the movement to stop following
    selectFriend(null); // Clear the selected friend
  });
  menu.appendChild(stopFollowButton);
};


const calcCoords = () => {
  friendCoords = null;

  for (let key in app.game.Bc.DA) {
    // Set friend
    let username = app.game.Bc.DA[key]['H1'];
    if (username === selectedFriend) {
      friendCoords = app.game.Bc.DA[key]['Cq'];
    }
    if (username === myName) {
      myCoords = app.game.Bc.DA[key]['Cq'];
    }
  }

  if (movementEnabled && friendCoords !== null) { // Check if movement is enabled
    let targetX = friendCoords.x - myCoords.x;
    let targetY = myCoords.y - friendCoords.y; // Reverse sign for vertical movement
    console.log(targetX, targetY);
    startMoving(targetX, targetY);
  } else {
    ABORT(); // Call the ABORT function only when there's a change in movement state
  }
};

// Create the friend menu
createFriendMenu();

// Call calcCoords initially and then at regular intervals
calcCoords();
setInterval(calcCoords, 500); // Adjust the interval as needed







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
         else if (app.game.Bc.DA[key]['color'] === "white") {
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
