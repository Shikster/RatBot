# RatBot
- A scout bot for Aberoth!
- Written by Shikii
- Version number: 1.5

#### Features
- Autoscout based on a custom namelist
- Your namelist is saved locally
- Send a message to discord via webhook. Read more about setting up webhooks here: [Webhook](https://github.com/Shikster/RatBot#Webhooks)
- Play a sound on a successful scout
- Anti AFK (anti camp feature)


#### Installation
In order to use RatBot you must have [Tampermonkey](https://www.tampermonkey.net/) installed.
RatBot has only been tested in Chrome, there might be issues you run into when trying this on any other browser.

After Tampermonkey has been installed, use the button below to add RatBot to your TamperMonkey userscripts:
### [Click to Install](https://github.com/Shikster/RatBot/raw/main/RatBot.user.js)

#### Webhooks
If you want RatBot to send messages to your discord server, you may want to setup a webhook.
This can be done by creating your own server (you need mod/admin perms), and then right clicking the setting cog in any channel (edit channel).
Click on integrations, webhooks, and then New Webhook. The name for the webhook doesn't matter, as Rat Bot will override it with it's post function. Copy the WebHook URL and paste it into the SETUP (after Rat Bot has been installed). 

More information about webhooks can be found here:
https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
