
# Host a telegram bot on firebase functions

lots of the articles I found on this topic dont do it properly and the instace shuts down after several minutes and the bot dies with it.
this is a working serverless telegram bot hosted on firebase functions.
 step by step tutorial

 
## Requirements

[node.js](https://nodejs.org/en/download)

[firebase cli](https://firebase.google.com/docs/cli/) (```npm install -g firebase-tools```)

[curl](https://curl.se/download.html)
## Setup

### clone repo
star this repo ⭐
```
git clone https://github.com/y0av/telegram-bot-serverless-firebase-functions.git
```

### BotFather
send ```/newbot``` to [BotFather](https://telegram.me/BotFather)
and copy the token

### .env
create an .env file inside functions/bot
```
BOT_TOKEN=<bot token from BotFather>
```

### firebase
[create a new firebase project](https://console.firebase.google.com/u/0/)
upgrade your project to Blaze plan using a google billing account

in your project folder
copy the ```firebase.json``` file aside 
```
firebase init
```
- initialize firebase functions
- choose existing project
- dont recreate package.json file
then move back the ```firebase.json``` file instead of the one created by firebase init cmd


#### deploy to firebase

navigate to bot directory
```
cd function
cd bot
```
fix lint issues with
```
npx eslint --fix --ext .ts .
```
navigate back to main firebase directory
```
cd ..
cd ..
firebase deploy
```
when the deploy is successful, you will get a link to the newly created function.
copy this link

### Set bot's webhook url
now you need to tell telegram that your bot is using a webhook.
this will make telegram call your https function every time your bot is triggered
you only need to do it once
you can do it using curl like so:
```
curl -X POST https://api.telegram.org/bot<YOUR BOT TOKEN>/setWebhook -H "Content-type: application/json" -d '{"url": "<YOUR FUNCTION URL>"}'
```
but for accessing this function from the actual telegram bot you will have to set the function security to public accesss 
from the [cloud run section in google cloud console](https://console.cloud.google.com/run?deploymentType=function) select your bot function and then go to security tab and select public access
so if your bot code require private access only and you want to restrict only your bot to be able to access this function you will need to secure it at the application layer.
telegram allows setting a secret token for the webhook so instead of the curl command above we can do:
```
curl -X POST https://api.telegram.org/bot<YOUR BOT TOKEN>/setWebhook -H "Content-type: application/json" -d '{"url": "<YOUR FUNCTION URL>","secret_token":"<your-64-char-secret>"}'
```
you can use any 64 char secret. an exaple way to produce one easily is:
```
ode -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
