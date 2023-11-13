# RatBot
- A scout bot for Aberoth!
- Written by Shikii (and Sayob)
- Version number: 2.1

https://github.com/Shikster/RatBot/assets/90510626/7e6f3263-89b2-464c-b88b-7a54b832ae89

#### Features
- NEW! version 2.1: fetches data from aberoth highscores. Appends skill level to username if available.
- version 2.0: takes screenshots of enemies and posts them to the webhook! Only for enemies or PvP-enabled characters.
- Autoscout based on a custom whitelist
- Namelist is saved locally
- Names added to the namelist are the names it skips scouting for
- Sends a message to discord via webhook. Read more about setting up webhooks here: [Webhook](https://github.com/Shikster/RatBot#Webhooks)
- Plays a sound on a successful scout
- Anti AFK (anti camp feature)



#### Installation
In order to use RatBot you must have [Tampermonkey](https://www.tampermonkey.net/) installed.
RatBot has only been tested in Chrome and Firefox, there might be issues with any other browser.

After Tampermonkey has been installed, use the button below to add RatBot to your TamperMonkey userscripts:
### [Click to Install](https://github.com/Shikster/RatBot/raw/main/RatBot.user.js)

When RatBot is added to your Tampmonkey scripts, a menu appears when you open Aberoth in the browser. From this menu you can setup: your scout's name, webhook url, audio and whitelist.

<img src="https://github.com/Shikster/RatBot/assets/90510626/33684d7b-e614-42e2-afab-06ec228c0fb7" width="300">


#### Webhooks
If you want RatBot to send messages to your discord server, you may want to setup a webhook.
This can be done by creating your own discord server (you need mod/admin perms), and then right clicking the setting cog in any channel (edit channel).
Click on integrations, webhooks, and then New Webhook. The name for the webhook doesn't matter, as Rat Bot will override it with it's post function. Copy the WebHook URL and paste it into the SETUP (after Rat Bot has been installed). 

If the webhook isn't working, your browser might be blocking it! Try a different browser, or even better, set up RatBot in a virtualmachine.

More information about webhooks can be found here:
[Discord Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
