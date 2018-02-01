/* 
Really simple DM spammer for Discord made by Gringo.
This code is free for everyone to use, modify and distribute.
All configurations should be changed in config.json
Never use this on your main account. 
Enjoy! :)
*/

const Discord = require('discord.js'); //Here we need to require the discord.js library to get some functions that we will use.
const colors = require('colors'); //Just to make add in some nice colors.

const bot = new Discord.Client(); //Here we define our client, most people call it "client" but I prefer to call it "bot".

const config = require('./config.json'); //Calling the our config file where we will store things like the login token and prefix.



//When our bot is ready.
bot.on("ready", () =>{

console.log('The bot is running'.green); //We will send a message to our console telling us that the bot has initiated correctly.

});

//When a message is received, run the following code.
bot.on("message", async message => {

if(message.author.bot) return; //This is a great practice to ignore other bots.

if(message.channel.type === "dm") return; //If the message was sent in a DM channel, ignore it. You can disable this by adding "//" without quotes to the beginning of this line.

if(!message.content.startsWith(config.prefix)) return; //If the message doesn't start with our prefix, we should ignore it.

const args = message.content.slice(config.prefix.length).trim().split(/ +/g); //Define our additional arguments and our command name.
const command = args.shift().toLowerCase(); //Make the command content lowercase.


//Here we make a simple ping command.
if(command === "ping"){
    let pingms = new Date().getTime() - message.createdTimestamp;
  
    message.reply(`Pong! :ping_pong: ${pingms}ms`);
}


//Here we define our DM All command.
if(command === "dmall"){
    
    let Members = await message.guild.fetchMembers(); //Fetch the members of the guild.
    let dmMessage = args.join(' '); //Define the message content
    let time = config.waitTime;  //Gets the time from the config for the interval. We set the interval at a minimum of 3000ms to avoid Discord banning you for spam.

    if(isNaN(time)) return console.log("Fix waitTime in config.json and make it a valid number.".red); //Here we make sure the configured time is a number and not something else.

    if(!dmMessage) return console.log("Specify a message to DM. \nExample: ;dmall Hey! What's up?".yellow); //If the message content doesn't exist, it should tell you.


    Members.members.forEach(member =>{ //We are going to run some code for each member found in the server.
        if(member.user.id === bot.user.id) return; //This makes sure the bot doesn't send a message to itself.
        
        setTimeout(function () {  //Here we set a timeout so Discord doesn't ban you instantly.
            bot.users.get(member.user.id).send(dmMessage); //Send the user the message defined with the command.
        }, time)
    });
}

});

bot.login(config.token); //Login as our bot using the token specified in config.json.