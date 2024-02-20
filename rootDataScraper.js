const puppeteer = require("puppeteer");
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Iterator = require("./Iterator");
const fs = require('fs');


class RootDataScraper {
    async rootDatascraper(){

        const botToken = process.env.CHAIN_SCRAPER_BOT_API;
        const chatId = process.env.CHAT_ID;
        const bot = new TelegramBot(botToken);
        const myIterator = new Iterator();

        try{

            const browser = await puppeteer.launch({
                executablePath: '/usr/bin/google-chrome',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
                headless: true
            });
            const page = await browser.newPage();
            await page.goto("https://www.rootdata.com/Projects", {waitUntil: "networkidle0"});
            await page.evaluate(()=>{
                const labels = Array.from(document.querySelectorAll("label"));
                const layer1Label = labels.find(label => label.textContent.trim() === "Layer1");
                if(layer1Label) {
                    const radioInput = layer1Label.querySelector('input[type="radio"]')
                    if(radioInput){
                        
                        radioInput.click();
                    }
                }
            });
            await page.waitForTimeout(3000);
            const blockChainNames = await page.evaluate(() =>{
                const cards = Array.from(document.querySelectorAll("a.list_name.animation_underline"));
                return cards.map(function(cards) {
                   return cards.textContent.trim()
                })
            });
            //const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));


          
            for (const name of blockChainNames) {
               // await delay(1000)
                const added = await myIterator.iterate(name);
                if (added) {
                    console.log(`${name} was added to the Json File`);
                    const [newPage] = await Promise.all([
                        new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))), 
                        page.evaluate((blockChainName) => {
                            const card = Array.from(document.querySelectorAll("a.list_name.animation_underline")).find(card => card.textContent.trim() === blockChainName);
                            if (card) {
                                card.click(); 
                            }
                        }, name)
                    ]);
                    const twitterLink = await newPage.evaluate(() => {
                        const twitterAnchor = document.querySelector('a[href*="twitter.com"]');
                        return twitterAnchor ? twitterAnchor.href : null;
                    });
                    if (twitterLink) {
                        await bot.sendMessage(chatId, `New testnet added: ${name}\nTwitter: ${twitterLink}`);
                        await newPage.close(); 
                    }
                } else {
                    console.log(`${name} already exists in the Json File`);
                }
            }

            
            await browser.close();
        }catch(error){
            console.log("error occured", error);
            fs.appendFileSync('error.log', `${new Date().toISOString()} - Error occurred: ${error}\n`);
        }
    }
}


module.exports = RootDataScraper;