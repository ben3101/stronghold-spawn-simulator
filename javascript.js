//-----------------UI-----------------------------
//element variables

//event listeners





//-------------Console Log Version:--------------------
//Troops:
class Troop{
    name = "";
    spawnType = "";
    //either wall def, or left blank if not
    type = "";
    spawnSize = 0;

    constructor(n, t, sType, sSize) {
        this.name = n;
        this.type = t;
        this.spawnType = sType;
        this.spawnSize = sSize;
    }

    //getter methods
    getName(){
        return this.name;
    }
    getType(){
        return this.type;
    }
    getSpawnSize(){
        return this.spawnSize;
    }
    getSpawnType(){
        return this.spawnType;
    }
}
//Strongholds:
class Stronghold{

    name;
    //percentage of Warzone Points in the sector at time of SH conquer
    wzpMultiplier;
    //base spawn size = 5b, min = 100m
    baseAmount = 5000000000;
    minAmount = 100000000;
    owner = "Evil King";
    //WZP value of it
    shWzp = 500000;

    //the Troops that will be in every SH
    Troops = [
        //lvl10s
        new Troop("Goblin"), new Troop("Prawn"), new Troop("Orc"),
        new Troop("Witch"), new Troop("Gargoyle"), new Troop("Black Widow"),
        new Troop("Firebeast"), new Troop("Gorgon"), new Troop("Lizard"),
        //innums
        new Troop("Vampire"), new Troop("Butcher"), new Troop("Demon"),
        new Troop("Fallen"), new Troop("Cyclops"), new Troop("Troll"),
        new Troop("Reaper"),
        //wall def
        new Troop("Traps", "wall"), new Troop("Falling Rocks", "wall"),
        new Troop("Guard Tower", "wall"), new Troop("Turret", "wall")
    ];

    constructor(shName){
        this.name = shName;
        this.owner = "Evil King";
        this.wzpMultiplier = 1;
        this.calcSpawnSize();
    }

    // SH methods
    assignType(){
        //assign small, medium or big to troop's spawn type
        //-set all to medium initally
        //-pick 1 random to be small, and 1 big
        
        for(let troop of this.Troops){
            troop.spawnType = "medium";
        }

        let randBig = Math.floor(Math.random()*this.Troops.length);
        this.Troops[randBig].spawnType = "big";

        let randSmall = randBig;
        while(randSmall === randBig){
            randSmall = Math.floor(Math.random()*this.Troops.length);
        }
        this.Troops[randSmall].spawnType = "small";
    }

    calcSpawnSize(){
        //assign the spawn types to each troop using the assignType method
        this.assignType();
        //overwrite this in the event it is an Evil King SH:
        //-Evil King always gets a big spawn equal to 150% of wzp multiplier
        //-always gets a large wall def spawn
        //-always gets medium spawns for every non-wall def troop type
        if(this.getOwner() === "Evil King"){
            this.wzpMultiplier = 1.5;
            for(let troop of this.Troops){
                if(troop.getType()==="wall"){
                    troop.spawnType = "big";
                }else{
                    troop.spawnType = "medium";
                }
            }
        }
        //calculate the troop counts for all medium spawns
        for(let troop of this.Troops){
            //random variation of up to +/-20%
            let variation = 1 + (Math.random()*2-1)*0.25;
            troop.spawnSize = variation * ((this.baseAmount * this.wzpMultiplier) + this.minAmount); 
        //then buff the spawn for big spawn type, nerf for small type
            if(troop.spawnType === "big"){
                troop.spawnSize*=4;
            }else if(troop.spawnType === "small"){
                troop.spawnSize*=0.25;
            }
        }
        //round all troops down to a whole number
        for(let troop of this.Troops){
            troop.spawnSize = Math.floor(troop.spawnSize);
        }
    }

    //method for displaying WZP on a SH
    wzp(faction){
        let dragonWzp = 0;
        let phoenixWzp = 0;

        //calculate the WZP that will be displayed in the sector
        if(faction === "Dragon"){
            dragonWzp = this.shWzp*this.wzpMultiplier;
            phoenixWzp = this.shWzp - dragonWzp;
        }else if(faction === "Phoenix"){
            phoenixWzp = this.shWzp*this.wzpMultiplier;
            dragonWzp = this.shWzp - phoenixWzp;
        }
        //make variable string that will be displayed
        let wzpDisplay = "Dragon: "+dragonWzp+ "\nPhoenix: "+phoenixWzp;
        //if it has been reset to EK, show EK wzp
        if(this.getOwner()==="Evil King"){
            wzpDisplay+="\nEvil King: "+this.shWzp;
        }

        return wzpDisplay;

    }

    //method for changing SH ownership
    conquerSH(faction, wzpPercent){
        //set wzpmultiplier
        this.setWzpMultiplier(wzpPercent);
        //capitalise first letter
        faction = faction.toLowerCase();
        faction = faction.substring(0,1).toUpperCase()+faction.substring(1);
        //accept lowercase/abreviations and convert to used format
        if(faction === "evil king" || faction === "Evil king" || 
        faction === "ek" || faction === "EK"){
            faction = "Evil King";
        }
        //message that is returned
        let message = "";

        //switch statement for each faction
        switch(faction){
            case "Dragon":
                console.log("["+faction+" has conquered "+this.getName()+"]");
                message = "["+faction+" has conquered "+this.getName()+"]";
                this.owner = faction;
                break;

            case "Phoenix":
                console.log("["+faction+" has conquered "+this.getName()+"]");
                message = "["+faction+" has conquered "+this.getName()+"]";
                this.owner = faction;
                break;

            case "Evil King":
                console.log("["+this.getName()+" has reverted to Evil King]");
                message = "["+this.getName()+" has reverted to Evil King";
                this.owner = faction;
                break;

            default:
                console.log("Invalid Faction name. Current factions: Dragon, Phoenix, Evil King.");
                message ="Invalid Faction name. Current factions: Dragon, Phoenix, Evil King.";
        }
        //calc the new spawn and then display message
        this.calcSpawnSize();
        return message;       
    }

    //method to display the spawn of a SH
    displaySPawn(){
        console.log("Stronghold spawn: \n");

        for(let troop of this.Troops){
            console.log(troop.getName()+" ");
            console.log(troop.getSpawnSize().toLocaleString('en-US'));
            console.log(" ("+troop.getSpawnType+" spawn)");
        }
        console.log("");
    }

    //display info of sh
    shinfo(){
        //name of sh
        console.log(this.getName());
        //sh owner
        console.log("Owner: "+this.getOwner());
        //wzp total for each faction
        console.log(this.wzp(this.getOwner()));
        this.displaySPawn();
    }

    getShinfo(){
        let s = "";
        //sh owner
        s+="("+this.getOwner()+")"+"\n\n";
        //wzp totals
        s+="Forces:\n"+this.wzp(this.getOwner())+"\n";
        //sh spawn
        s+="----------------------------------------\n\n";
        s+="Stronghold Spawn:\n\n";
        for(let troop of this.Troops){
            s+=troop.getName()+" ";
            s+=troop.getSpawnSize().toLocaleString('en-US');
            s+=" \t\t("+troop.getSpawnType()+" spawn)\n";
        }
        return s;
    }

    //getter methods
    getName(){
        return this.name;
    }
    getShWzp(){
        return this.shWzp;
    }
    getOwner(){
        return this.owner;
    }
    //setter methods
    setOwner(newOwner){
        this.owner = newOwner;
    }
    setWzp(newWzp){
        this.shWzp = newWzp;
    }
    setWzpMultiplier(wzpPercentage){
        //if given wzp % is over 100, use 100
        if(wzpPercentage>=100){
            wzpPercentage=100;
        }//if less than 0, use 0
        else if(wzpPercentage<0){
            wzpPercentage=0;
        }
        //use percentage to apply multiplier
        this.wzpMultiplier = wzpPercentage/100;
    }
}






