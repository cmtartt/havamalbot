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
const thorpeJson = require('./assets/thorpe.json');
const hollanderJson = require('./assets/hollander.json');

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

	function magic(arg) {
	    switch(arg) {
		case 1:
		message.channel.send("https://tenor.com/view/shrimp-as-that-clash-royale-hee-hee-hee-haw-gif-25054781");
		return;
		break;
	    }
	}

        // Ignore messages from other bots to prevent infinite loops
        if (message.author.bot) return;

        if (message.content.toLowerCase().indexOf("!havamal") == 0) {
            console.log("Begin havamal parsing");
            const messageSplits = message.content.toLowerCase().split(' ');
            console.log(messageSplits);
            // assume first split is command, 2nd is
            var stanzaId = Math.floor(Math.random() * 164);
   	    var translation = 'pettit';
	    var hasStanzaOverride = false;
	    var hasTranslationOverride = false;

	    for(split in messageSplits) {
	    	console.log(split);
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

            if(hasStanzaOverride) {
                if(stanzaId > 164 || stanzaId < 0) {
                    message.channel.send("Invalid stanza");
                    return;
                }

                console.log("DEBUG: " + stanzaId);
            }

            var stanzaText = '';
            var attestationText = '';

            if(hasTranslationOverride) {
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
			magic(1);
			return;
			break;
                    case 'pettit':
                    default:
                        stanzaText = pettitJson.data[stanzaId].text;
                        attestationText = "Pettit's Translation";
                        break;
                }
            }

            stanzaText += "-- Havamal, stanza " + (stanzaId + 1) + ` (${attestationText})`;

            console.log("Sending stanzaId: " + stanzaId);
            message.channel.send(stanzaText);
        }
    });

client.login(process.env.BOT_TOKEN);
