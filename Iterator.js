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

const NodesGuruChains =  [
    'Gevulot',  'Ethos',    'Settlus',
    'Vistara',  'Initia',   'Swisstronik',
    'Rooch',    'Omni',     'Eclipse',
    'Astria',   'Odsy',     'Linera',
    'Aztec',    'Dflow',    'Nillion',
    'Kima',     'Side One', 'Monad',
    'Redstone', 'Ten',      'Bundlr',
    'Web3Auth', 'GNO Land', 'Gensyn',
    'Entropy',  'Espresso', 'Laconic'
  ];

 const rootDataChains =  [
    'LAMBDA',           'Nockchain',
    'ALLO',             'Autonity',
    'BOINC AI',         'ElosysELO',
    'EtherealETRL',     'PowBlocksXPB',
    'Pyrin',            'VinuChainVC',
    'EtraPay',          'KekChainKEK',
    'Ottochain',        'PWR Chain',
    'Aether',           'LiquidLayerLILA',
    'UPCXUPC',          'Engram Network',
    'Nomic',            'Erbie',
    'Inco Network',     'ArtheraAA',
    'Fhenix',           'Evadore',
    'HeliChain',        'WhiteBIT Network',
    'Sanpō Blockchain', 'Gevulot',
    'Movement Labs',    'QED Protocol'
  ];

 /*async function test (chains) {
     const i = new Iterator();
     for( c of chains){
       await i.iterate(c);
     }
  }

  test();*/





module.exports = Iterator;