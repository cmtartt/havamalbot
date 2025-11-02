/*import * as bellowsJson from './assets/bellows.json';
import * as icelandicJson from './assets/icelandic.json';
import * as brayJson from './assets/bray.json';
import * as petitJson from './assets/petit.json';
*/
const { Client, Events, GatewayIntentBits } = require('discord.js');

const bellowsJson = require('./assets/bellows.json');
const brayJson = require('./assets/bray.json');
const pettitJson = require('./assets/petit.json');
const icelandicJson = require('./assets/icelandic.json');


// 

console.log(process.env);

console.log(pettitJson.data[126].text);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    console.log("Received an interaction:");
    console.log(interaction);
});

client.on('messageCreate', async message => {

        // Ignore messages from other bots to prevent infinite loops
        if (message.author.bot) return;
        
        if (message.content.toLowerCase().indexOf("!havamal") == 0) { 
            console.log("Begin havamal parsing");
            const messageSplits = message.content.toLowerCase().split(' ');
            console.log(messageSplits);
            // assume first split is command, 2nd is 
            var stanzaId = 0;
            
            if(messageSplits[1]) { 
                try {                     
                    stanzaId = parseInt(messageSplits[1], 10) - 1;                    
                } catch(e) { 
                    console.log(e);
                    message.channel.send("Invalid stanza");
                    return;
                }
                
                if(stanzaId > 164 || stanzaId < 0 || isNaN(stanzaId)) { 
                    message.channel.send("Invalid stanza");
                    return;
                }   

                console.log("DEBUG: " + stanzaId);
            } else { 
                stanzaId = Math.floor(Math.random() * 164);
            }
            
            var stanzaText = '';
            var attestationText = '';
            
            if(messageSplits[2]) { 
                const translation = messageSplits[2];
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
                    case 'pettit':
                    default:
                        stanzaText = pettitJson.data[stanzaId].text;
                        attestationText = "Pettit's Translation";
                        break;
                }
            } else { 
                stanzaText = pettitJson.data[stanzaId].text;
                attestationText = "Pettit's Translation";
            }

            stanzaText += "- Havamal, stanza " + (stanzaId + 1) + ` (${attestationText})`;

            console.log("Sending stanzaId: " + stanzaId);
            message.channel.send(stanzaText);
            if(stanzaId == 68) { 
                message.channel.send("nice.");
            }
        }
    });

client.login(process.env.BOT_TOKEN);