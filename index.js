/*import * as bellowsJson from './assets/bellows.json';
import * as icelandicJson from './assets/icelandic.json';
import * as brayJson from './assets/bray.json';
import * as petitJson from './assets/petit.json';
*/

import mysql from 'mysql2/promise';
import { Client, Events, GatewayIntentBits } from 'discord.js';

import 'dotenv/config';

import bellowsJson from './assets/bellows.json' with { type: 'json'};
import brayJson from './assets/bray.json' with { type: 'json'};
import pettitJson from './assets/petit.json' with { type: 'json'};
import icelandicJson from './assets/icelandic.json' with { type: 'json'};
import thorpeJson from './assets/thorpe.json' with { type: 'json'};
import hollanderJson from './assets/hollander.json' with { type: 'json'};
import { config } from 'dotenv';


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    console.log("Received an interaction:");
    console.log(interaction);
});

client.on('messageCreate', async message => {
        const isDev = process.env.HAVAMALBOT_IS_DEV ? true : false; // Setting this to anything, even false, enables dev mode.
        const triggerTerm = isDev ? '!devhavamal' : '!havamal';
        const configTriggerTerm = isDev ? '!devhavamalconfig' : '!havamalconfig';
        
        async function handleConfig(message) {             
            let guild = await client.guilds.fetch(message.guild.id);
            let user = await guild.members.fetch(message.author.id);            
            
            // is admin user?
            let isAdminUser = (user.permissions.bitfield & 0x8n) > 0n;
            
            if(!isAdminUser) { 
                return;
            }
            
            message.author.send("Configuring havamalbot with message: " + message.content);
            const messageSplits = message.content.toLowerCase().split(' ');
            
            const configType = messageSplits[1];
            if(configType.toLowerCase() == 'set') { 
                message.author.send(`Setting config ${messageSplits[2]} with value ${messageSplits[3]}`);
                setConfigValue(messageSplits, guild.id);
            } else if(configType.toLowerCase() == 'unset') { 
                message.author.send(`Removing config ${messageSplits[2]}`);
                unsetConfigValue(messageSplits, guild.id);
            } else { 
                message.author.send("Invalid option, valid options are `set` and `unset`");
            }            
        }

        async function setConfigValue(messageSplits, guildId) {
            const connection = await mysql.createConnection({
                host: process.env.HAVAMALBOT_MYSQL_HOST,
                user: process.env.HAVAMALBOT_MYSQL_USER,
                password: process.env.HAVAMALBOT_MYSQL_PASSWORD,
                database: process.env.HAVAMALBOT_MYSQL_DB,
            });
            // Strips <# and > from config value
            if(messageSplits[3].indexOf('<#') == 0) { 
                messageSplits[3] = messageSplits[3].slice(2,-1);
            }

            try {
                const [results, fields] = await connection.query(
                    'SELECT * FROM `configs` WHERE `key` = ? AND `guildId` = ?', [messageSplits[2], guildId]
                );                
                if(results.length == 0) { 
                    const [results, fields] = await connection.query(
                        'INSERT INTO `configs` (`key`, `value`, `guildId`) VALUES (?, ?, ?)', [messageSplits[2], messageSplits[3], guildId]
                    );
                } else { 
                    const [results, fields] = await connection.query(
                        'UPDATE `configs` SET `value` = ? where `key` = ? AND `guildId` = ?', [messageSplits[3], messageSplits[2], guildId]
                    );
                }

            } catch (err) {
                console.log(err);
            }
        }

        async function unsetConfigValue(messageSplits, guildId) { 
            console.log("Unsetting value from splits: ");
            console.log(messageSplits);
        }

        // Ignore messages from other bots to prevent infinite loops
        if (message.author.bot) return;

        if (message.content.toLowerCase().indexOf(configTriggerTerm) == 0) {
            handleConfig(message);                        
            return;        
        }
        
        if (message.content.toLowerCase().indexOf(triggerTerm) == 0) {
            console.log("Begin havamal parsing");
            const messageSplits = message.content.toLowerCase().split(' ');            
            // assume first split is command, 2nd is
            var stanzaId = Math.floor(Math.random() * 163);
            var translation = 'pettit';
            var hasStanzaOverride = false;
            var hasTranslationOverride = false;

            for(let split in messageSplits) {
                if(split == 0) { 
                    continue;
                }                
                try {
                    const parsedInt = parseInt(messageSplits[split], 10) - 1;
                    if(isNaN(parsedInt)) {
                        translation = messageSplits[split]
                        hasTranslationOverride = true;
                    } else {
                        stanzaId = parsedInt;
                        hasStanzaOverride = true;
                    }
                } catch(e) {
                    console.log(e);
                    message.channel.send("Invalid stanza");
                    return;
                }
            }            
            sendHavamal(translation, stanzaId, message.channel);
        }
        
    });

    function magic(arg, channel) {
        switch(arg) {
            case 1:
                channel.send("https://tenor.com/view/shrimp-as-that-clash-royale-hee-hee-hee-haw-gif-25054781");
                return;                
        }
    }
    
    function sendHavamal(translation, stanzaId, channel) {     
            if(stanzaId > 163 || stanzaId < 0) {
                channel.send("Invalid stanza");
                return;
            }

            var stanzaText = '';
            var attestationText = '';

        
            switch(translation) {
                case 'bray':
                    stanzaText = brayJson.data[stanzaId].text;
                    attestationText = "Bray's Translation";
                    break;
                case 'bellows':
                    stanzaText = bellowsJson.data[stanzaId].text;
                    attestationText = "Bellows's Translation";
                    break;
                case 'icelandic':
                    stanzaText = icelandicJson.data[stanzaId].text;
                    attestationText = "Icelandic Text";
                    break;
                case 'thorpe':
                    stanzaText = thorpeJson.data[stanzaId].text;
                    attestationText = "Thorpe's Translation";
                    break;
                case 'hollander':
                    stanzaText = hollanderJson.data[stanzaId].text;
                    attestationText = "Hollander's Translation";
                    break;
                case 'woolsey':
                    magic(1, channel);
                    return;                        
                case 'pettit':
                    stanzaText = pettitJson.data[stanzaId].text;
                    attestationText = "Pettit's Translation";
                    break;
                default:
                    channel.send("Invalid translation");
                    return;
                    
            }
        

            stanzaText += "-- Havamal, stanza " + (stanzaId + 1) + ` (${attestationText})`;

            console.log("Sending stanzaId: " + stanzaId);
            channel.send(stanzaText);
        }
    

await client.login(process.env.BOT_TOKEN);

function getNextMidnight() { 
    var utcNow = new Date();
    var utcMidnightTime = Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(),
                utcNow.getUTCDate(), utcNow.getUTCHours(),
                utcNow.getUTCMinutes(), utcNow.getUTCSeconds());

    var utcMidnight = new Date(utcMidnightTime);
    const utcOffset = utcMidnight.getTimezoneOffset();
    
    utcMidnight.setDate(utcMidnight.getUTCDate() + 1);
    utcMidnight.setHours(0, (utcOffset * -1), 0, 0); // Set to the start of tomorrow
    
    const nextMidnight = utcMidnight.getTime() - utcNow.getTime() ; // Returns milliseconds
    
    return nextMidnight;
}

async function setNextSOTDFire(time) { 
    console.log("Scheduling Stanza of the Day instances");
    setTimeout(async () => { 
        await handleHotd();
        const nextMidnight = getNextMidnight();
        setNextSOTDFire(nextMidnight);        
    }, time);    
}

async function handleHotd() { 
    const connection = await mysql.createConnection({
        host: process.env.HAVAMALBOT_MYSQL_HOST,
        user: process.env.HAVAMALBOT_MYSQL_USER,
        password: process.env.HAVAMALBOT_MYSQL_PASSWORD,
        database: process.env.HAVAMALBOT_MYSQL_DB,
    });
    const [results, fields] = await connection.query(
        'SELECT * FROM `configs` WHERE (`key` = ?)', ['hotdtime']
    );
    
    for(let entry in results) {                       
        
        const [channelResults, channelFields] = await connection.query(
            'SELECT * FROM `configs` WHERE `key` = ? AND `guildId` = ?', ['hotdchannel', results[entry].guildId]
        );            
        const [translationResults, translationFields] = await connection.query(
            'SELECT * FROM `configs` WHERE `key` = ? AND `guildId` = ?', ['hotdtranslation', results[entry].guildId]
        );            

        var translation = 'pettit';
        if(translationResults.length > 0) { 
            translation = translationResults[0].value;
        }

        console.log("Scheduling SotD for guildId: " + results[entry].guildId + " At " + results[entry].value + " To channelId: " + channelResults[0].value + " with translation: " + translation);
        const hotdChannel = await client.channels.fetch(channelResults[0].value);            
        const stanzaId = Math.floor(Math.random() * 164);
        const nextHour = parseInt(results[entry].value.slice(0,2), 10);
        const nextMinute = parseInt(results[entry].value.slice(3,5), 10);
        const fireOn = new Date();
        const utcOffset = fireOn.getTimezoneOffset()
        fireOn.setHours(nextHour, nextMinute + utcOffset, 0, 0, 0);
        
        const now = new Date();
        const fireTime = fireOn.getTime() - now.getTime();        
        setTimeout((timeoutTranslation, timeoutStanzaId, timeoutHotdChannel) => {
            sendHavamal(timeoutTranslation, timeoutStanzaId, timeoutHotdChannel);
        }, fireTime, translation, stanzaId, hotdChannel);            
    }
}

setNextSOTDFire(getNextMidnight());