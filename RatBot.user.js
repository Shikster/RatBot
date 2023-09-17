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



// Function to create and display the nameList pop-up for pasting usernames
function displayPasteNamesPopup() {
    // Create a pop-up container
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.background = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.border = '1px solid #ccc';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.color = 'black'; // Set font color to black

    document.body.appendChild(popupContainer);

    // Create a close button for the pop-up
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginBottom = '10px'; // Add spacing below the close button
    popupContainer.appendChild(closeButton);

    // Create a text area for typing or pasting usernames
    const textArea = document.createElement('textarea');
    textArea.placeholder = 'Type or paste usernames separated by commas';
    textArea.style.width = '100%';
    textArea.style.height = '100px';
    textArea.style.resize = 'none';
    popupContainer.appendChild(textArea);

    // Create a button to add the usernames to the nameList
    const addButton = document.createElement('button');
    addButton.textContent = 'Add to NameList';
    addButton.style.marginTop = '10px'; // Add spacing above the add button
    popupContainer.appendChild(addButton);

    // Add a click event listener to the close button
    closeButton.addEventListener('click', () => {
        // Remove the pop-up from the DOM when the close button is clicked
        document.body.removeChild(popupContainer);
    });

    // Add a click event listener to the add button
    addButton.addEventListener('click', () => {
        // Get the typed or pasted usernames from the text area and split them by commas
        const usernames = textArea.value.split(',').map(username => username.trim());

        // Filter out empty usernames
        const validUsernames = usernames.filter(username => username !== '');

        // Add the valid usernames to the nameList
        nameList.push(...validUsernames);

        // Clear the text area
        textArea.value = '';

        // Optionally, display the updated nameList
        console.log('Updated nameList:', nameList);

        // Save the updated nameList to GM storage
        GM_setValue("NAME_LIST", nameList);

        // Close the pop-up
        document.body.removeChild(popupContainer);
    });
}

// Function to create the setup menu
function createSetupMenu() {
    // Create a setup menu container
    const setupContainer = document.createElement('div');
    setupContainer.style.position = 'fixed';
    setupContainer.style.top = '50%';
    setupContainer.style.left = '50%';
    setupContainer.style.transform = 'translate(-50%, -50%)';
    setupContainer.style.background = 'white';
    setupContainer.style.padding = '20px';
    setupContainer.style.border = '1px solid #ccc';
    setupContainer.style.zIndex = '1000';
    setupContainer.style.color = 'black'; // Set font color to black
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

    // Add a click event listener to the "ADD NAMES" button in the setup menu
    const addNamesButton = setupContainer.querySelector('#addNamesButton');
    addNamesButton.addEventListener('click', () => {
        // Call the function to display the pop-up for pasting usernames
        displayPasteNamesPopup();
    });

    // Add a click event listener to the "Save" button in the setup menu
    const saveButton = setupContainer.querySelector("#saveButton");
    const discordUrlInput = setupContainer.querySelector("#discordUrl");
    const myNameInput = setupContainer.querySelector("#myName");

    saveButton.addEventListener("click", () => {
        const discordUrl = discordUrlInput.value;
        const myName = myNameInput.value;

        // Save values using GM_setValue
        GM_setValue("DISCORDURL", discordUrl);
        GM_setValue("MY_NAME", myName);

        // Remove the setup menu
        document.body.removeChild(setupContainer);
    });
}

// Create a button for setup
const setupButton = document.createElement("button");
setupButton.textContent = "SETUP";
setupButton.style.width = '80px'; // Set a fixed width
document.body.appendChild(setupButton);

setupButton.addEventListener("click", () => {
    // Redirect to the download page
    window.location.href = "https://aberoth.com/download.html";

    // Add a query parameter to indicate that the setup menu should be opened
    setTimeout(() => {
        // Check if the download page has loaded by looking for an element unique to that page
        if (document.getElementById("uniqueElementOnDownloadPage")) {
            // Open the setup menu after the page has loaded
            createSetupMenu();
        }
    }, 1000); // Adjust the delay as needed
});

// Check the current URL for the download page
if (window.location.href === "https://aberoth.com/download.html") {
    // If we are on the download page, open the setup menu immediately
    createSetupMenu();
}



// AFK counter-measure - adds a button to bottom left, click to toggle when AFKing. Sends a "keyup" event to counteract camping
let afkinterval;
let clicked = true; // Set to true to make the script active by default
const btn = document.createElement('button');
btn.textContent = 'AFK ON'; // Set initial text
btn.setAttribute('id', 'afkbtn');
btn.style.width = '80px'; // Set a fixed width
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
    btn.textContent = clicked ? 'AFK ON' : 'AFK OFF'; // Update the button text
});

// Player detection script, modify the namelist (line 53) to add enemies. Turning namelist on means Rat Bot will only report names in the list.
let isDetecting = true; // Initially, detection is active
let useNameList = true; // Initially, using nameList is active

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

// Retrieve the nameList from GM storage
const nameList = GM_getValue("NAME_LIST", []);

// Function to create and display the nameList pop-up with detected names
function displayNameListPopup() {
    // Create a pop-up container
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.background = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.border = '1px solid #ccc';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.color = 'black'; // Set font color to black
    popupContainer.style.overflow = 'auto'; // Enable scrolling
    popupContainer.style.maxHeight = '70vh'; // Limit maximum height

    document.body.appendChild(popupContainer);

    // Create a close button for the pop-up
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginBottom = '10px'; // Add spacing below the close button
    popupContainer.appendChild(closeButton);

    // Create a list to display the names in the nameList
    const nameListContainer = document.createElement('ul');
    popupContainer.appendChild(nameListContainer);

    // Populate the list with names from the nameList
    nameList.forEach(name => {
        const listItem = document.createElement('li');

        // Create a div to contain the name and remove button
        const nameContainer = document.createElement('div');
        nameContainer.style.display = 'flex';
        nameContainer.style.alignItems = 'center';

        // Display the name
        const nameElement = document.createElement('span');
        nameElement.textContent = name;
        nameContainer.appendChild(nameElement);

        // Create a remove button for each name
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.style.marginLeft = '10px'; // Add spacing between name and button

        // Add a click event listener to remove the name from the nameList
        removeButton.addEventListener('click', () => {
            // Remove the name from the nameList
            const index = nameList.indexOf(name);
            if (index !== -1) {
                nameList.splice(index, 1);
                // Update the displayed name list
                nameListContainer.removeChild(listItem);
                // Save the updated nameList to GM storage
                GM_setValue("NAME_LIST", nameList);
            }
        });

        // Append the remove button to the name container
        nameContainer.appendChild(removeButton);
        listItem.appendChild(nameContainer);
        nameListContainer.appendChild(listItem);
    });

    // Add a click event listener to the close button
    closeButton.addEventListener('click', () => {
        // Remove the pop-up from the DOM when the close button is clicked
        document.body.removeChild(popupContainer);
    });
}

// Create a button to trigger displaying the nameList pop-up
const viewNameListBtn = document.createElement('button');
viewNameListBtn.textContent = 'VIEW NAMELIST';
document.body.appendChild(viewNameListBtn);

// Add a click event listener to the "VIEW NAMELIST" button
viewNameListBtn.addEventListener('click', () => {
    // Call the function to display the nameList pop-up
    displayNameListPopup();
});



// Retrieve values from GM_getValue
const MY_NAME = GM_getValue("MY_NAME", ""); // Default value is an empty string
const DISCORDURL = GM_getValue("DISCORDURL", ""); // Default value is an empty string
const COOLDOWN_TIMER = 30 * 60 * 1000; // 30 minute cooldown before a user can be detected again
let usersInRoom = [];
let cooldown = new Map();
let unpingable = [];

setInterval(() => {
    if (!isDetecting) {
        return; // If detection is stopped, do nothing
    }

    // Generate an array of current users
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

    // Check if those users are not currently in cooldown (already pinged) && are in whitelist/nameList
    for (let user of usersInRoom) {
        if (!cooldown.has(user) && !unpingable.includes(user)) {
            // If using namelist, check it, otherwise check for any name
            if (useNameList) { // Changed from USE_NAME_LIST
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

    // Check unpingable people (users who stand in the room post-cooldown)
    // If they're no longer in the room, they may be pinged again
    for (const [name, timestamp] of cooldown.entries()) {
        if (!usersInRoom.includes(name) && Date.now() - timestamp >= COOLDOWN_TIMER) {
            cooldown.delete(name);
            unpingable.splice(unpingable.indexOf(name), 1); // Remove from unpingable array
            console.log(`${name} can be pinged again at`, new Date().toLocaleTimeString());
        }
    }
}, 1000);

// POST req discord webhook
// Variable to track whether sound is enabled
let isSoundEnabled = true;

// Create a button for toggling sound
const soundToggleButton = document.createElement('button');
soundToggleButton.textContent = 'SOUND IS ON';
soundToggleButton.style.width = '150px';
document.body.appendChild(soundToggleButton);

// Add a click event listener to the sound toggle button
soundToggleButton.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggleButton.textContent = isSoundEnabled ? 'SOUND IS ON' : 'SOUND IS OFF';
});

// Modify the postUser function to play audio based on the sound toggle
const postUser = (username) => {
    const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false };
    const currentTimeHere = new Date().toLocaleTimeString('en-US', { ...options, timeZone: 'Europe/Berlin' });
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Check if sound is enabled
    if (isSoundEnabled) {
        // Create an Audio object and provide the URL of the audio file
        const audio = new Audio('https://us-tuna-sounds-files.voicemod.net/a37fc336-638e-469e-99a6-c27a71ae9655-1640243756594.mp3');

        // Play the audio
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
                content: `I found: **${username}** at Tavelor, on Red Realm <t:${currentTimestamp}:R>! Squeek!` // Change this line to your liking.
            })
        }
    );
};
