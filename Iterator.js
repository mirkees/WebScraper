const fs = require("fs");
const jsonFilePath = "blockchains.json";


class Iterator{
    async iterate(chain){
        try{

            const formatedChain = this.formatBlockchainName(chain);
            const data = await fs.promises.readFile(jsonFilePath, "utf-8");
            let jsonData = data ? JSON.parse(data) : {};
            const containsKey = Object.hasOwnProperty.call(jsonData, formatedChain);
            if(!containsKey) {
                jsonData[formatedChain] = formatedChain;
                await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");
                return true;
            }else{
                return false;
            }
        }catch(error){
            
            fs.appendFileSync('error.log', `${new Date().toISOString()} - Error occurred: ${error}\n`);
        }
    }

    formatBlockchainName(chain){
        return chain.toLowerCase().replace(/\s+/g, '').replace(/^\w/, c => c.toUpperCase());
    }
}






module.exports = Iterator;