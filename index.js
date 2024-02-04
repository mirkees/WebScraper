const chronium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Iterator = require("./Iterator");

const botToken = process.env.CHAIN_SCRAPER_BOT_API;
const bot = new TelegramBot(botToken, {polling: true});



exports.handler = async (event) => {

    const myIterator = new Iterator();
    try{

        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto("https://nodes.guru/testnets", {waitUntil:"networkidle0"});
        await page.waitForSelector('nav');
        await page.evaluate(() => {[...document.querySelectorAll('nav a')].find(e => e.textContent === 'Upcoming').click()});
        await page.waitForTimeout(3000);
        await page.waitForSelector('.more__btn a');
        await page.click('.more__btn a');
        await page.waitForTimeout(3000);

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
            }else{
                console.log(`${name} already exists in the Json File`)
            }
          }
    }catch{
        console.error("Error occured:", error);
    }
}

exports.handler({}).then(result => console.log(result)).catch(error => console.error(error));