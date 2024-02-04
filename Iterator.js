const fs = require("fs");
const jsonFilePath = "blockchains.json";

class Iterator{
    async iterate(chain){
        try{
            const data = await fs.promises.readFile(jsonFilePath, "utf-8");
            let jsonData = JSON.parse(data);
            const containsKey = Object.hasOwnProperty.call(jsonData, chain);
            if(!containsKey) {
                jsonData[chain] = chain;
                await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.error("Error occured:", err);
        }
    }
}

module.exports = Iterator;