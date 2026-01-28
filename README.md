Havamal Bot 1.1.1 - Powered by the [Digital Havamal](https://everheartempire.com/digital-havamal)

------

Requirements: NodeJS, MySQL/MariaDB and a working bot token for discord.

To install: Ensure mysql is setup and working, run `node index.js` from the root or check your system's documentation to setup a service using systemd or similar

Edit the botsetup.sql and add:

`use <havamalbot database>`

To the first line

In mysql: run `mysql <config goes here> < botsetup.sql`, 

To configure: add an environment variables in .env(or through the shell's local environment variables) 

Run `node index.js` or as appropriate in your environment and enjoy! 

------

Usage:

!havamal for random stanza

!havamal \<number\> for a stanza

!havamal \<number\> \<translation\> for a specific translation!

Config: 

For Admin users, use:


!havamalconfig set hotdtime \<time\> 
!havamalconfig set hotdchannel \<channel\>  
!havamalconfig set hotdtranslation \<translation\> 

With the time being relative to UTC, tag the channel itself when doing hotdchannel.

Valid translations:

bray

bellows

pettit

icelandic

hollander

thorpe

Havamal of the Day