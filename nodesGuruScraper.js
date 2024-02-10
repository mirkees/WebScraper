const puppeteer = require("puppeteer");
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Iterator = require("./Iterator");
const fs = require('fs');


class NodesGuruScraper {
      async nodesGuruScraper () {

        const botToken = process.env.CHAIN_SCRAPER_BOT_API;
        const bot = new TelegramBot(botToken);
        const chatId = process.env.CHAT_ID;
        const myIterator = new Iterator();
        try{
            const browser = await puppeteer.launch({
                //executablePath: '/usr/bin/google-chrome',
                args: ['--no-sandbox', '--disable-setuid-sandbox'] 
            });
            const page = await browser.newPage();
            await page.goto("https://nodes.guru/testnets", {waitUntil:"networkidle0"});
            await page.waitForSelector('nav');
            await page.evaluate(() => {[...document.querySelectorAll('nav a')].find(e => e.textContent === 'Upcoming').click()});
            await page.waitForTimeout(3000);
            await page.waitForSelector('.more__btn a');
            await page.click('.more__btn a');
            await page.waitForTimeout(3000);
            await page.click('.more__btn a');
    
            
            const blockChainNames = await page.evaluate(() => {
                const cards = Array.from(document.querySelectorAll("a.jsx-3889733663.cards__container-card"));
                return cards.map(card => {const nameElement = card.querySelector("h4");
                return nameElement ? nameElement.innerText.trim() : null;
                }).filter(name => name);
              });



              for(const name of blockChainNames){
                const added = await myIterator.iterate(name);
                if(added){
                    console.log(`${name} was added to the Json File`);
                    await page.goto(`https://nodes.guru/testnets/${name.toLowerCase()}`, {waitUntil:"networkidle0"});
                    const twitterLink = await page.evaluate(()=> {
                        const twitterAnchor = document.querySelector('a[href*="twitter.com"]');
                        return twitterAnchor ? twitterAnchor.href : null;
                    });
                    if(twitterLink){
                        await bot.sendMessage(chatId, `New testnet added: ${name}\nTwitter: ${twitterLink}`);
                    }
                }else{
                    console.log(`${name} already exists in the Json File`)
                }
              }
              await page.waitForTimeout(3000);
              await browser.close()
        }catch(error){
            console.log("error occured", error);
            fs.appendFileSync('error.log', `${new Date().toISOString()} - Error occurred: ${error}\n`);
        }
    };
}


module.exports = NodesGuruScraper;
