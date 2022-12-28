//classes
//Troop:
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

//Stronghold:
class Stronghold{

    name;
    //percentage of Warzone Points in the sector at time of SH conquer
    wzpMultiplier;
    //base spawn size = 5b, min = 100m, used in spawn calculations
    baseAmount = 5000000000;
    minAmount = 100000000;
    owner = "Evil King";
    //total WZP in the sector
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
        //middle sectors should have double wzp
        if(this.name==="Stronghold 2" ||
        this.name==="Stronghold 5" ||
        this.name==="Stronghold 8"){
            this.shWzp = 1000000;
        }
    }

    // SH methods
    //(some have been adjusted for UI, others are just for use in the console.)
    assignType(){
        //assign small, medium or big to troop's spawn type
        //-set all to medium initially
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
        //save reference to the element for this SH
        let sh = document.getElementById(this.name);
        //selectedSH = document.getElementById(this.name);
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

        //first, make sure it is not associated with any faction
        sh.classList.remove('drag');
        sh.classList.remove('phx');
        sh.classList.remove('ek');

        //switch statement for each faction
        switch(faction){
            case "Dragon":
                console.log("["+faction+" has conquered "+this.getName()+"]");
                message = "["+faction+" has conquered "+this.getName()+"]";
                this.owner = faction;
                sh.classList.add('drag');
                break;

            case "Phoenix":
                console.log("["+faction+" has conquered "+this.getName()+"]");
                message = "["+faction+" has conquered "+this.getName()+"]";
                this.owner = faction;
                sh.classList.add('phx');
                break;

            case "Evil King":
                console.log("["+this.getName()+" has reverted to Evil King]");
                message = "["+this.getName()+" has reverted to Evil King]";
                this.owner = faction;
                sh.classList.add('ek');
                break;

            default:
                console.log("Invalid Faction name. Current factions: Dragon, Phoenix, Evil King.");
                message ="Invalid Faction name. Current factions: Dragon, Phoenix, Evil King.";
        }
        //update display with message
        notifications.textContent = message; 
        //calc the new spawn and then display message
        this.calcSpawnSize();
        //return message;  

    }

    //method to display the spawn of a SH
    displaySpawn(){
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
        this.displaySpawn();
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
        //infoP.textContent = s;
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


//variables
let wzCreated = false;
//array that will store strongholds
let strongholds = [];
//create the warzone
createWz();
//button colour changes
let normalButton = "black";
let highlightedButton = "#00ffff5e";
let selectedButton = "cyan";

//element variables
const notifications = document.getElementById('notifications');
const infoP = document.getElementById('infoP');
const changeOwnerMenu = document.getElementById('owner');
const changeOwnerBtn = document.getElementById('change-owner');
const resetBtn = document.getElementById('reset-wz');
//store reference to last selected element. Initialise at sh1
let selectedSH = document.getElementById('Stronghold 1');
selectedSH.click();

//event listeners
changeOwnerBtn.addEventListener('click', updateSH);
resetBtn.addEventListener('click', resetWz);
//add event listener to prevent the screen reloading when
//enter is pressed.
document.addEventListener('keydown', function(e){
    //check if enter was pressed
    if(e.keyCode == 13){
        //don't do anything
        e.preventDefault();
    }
});




//function that selects the sh that was clicked on
//and displays the relevant info below
function selectSH(){
    //first, check if any previous button was selected
    if(selectedSH!==""){
        //revert previously selected button to normal
        selectedSH.style.color = normalButton;
    }
    //save reference of new selected button and update its colour
    selectedSH = document.getElementById(this.id);
    selectedSH.style.color = selectedButton;
    
    
    let id = selectedSH.getAttribute('id');
    // console.log(`currently selecting ${selectedSH.id}`);
    let index = id.substring(id.length-1);
    sh = strongholds[index-1];

    //calculate the WZP that will be displayed in the sector
    let dragonWzp = 0;
    let phoenixWzp = 0;
    let faction = sh.getOwner();
    if(faction === "Dragon"){
        dragonWzp = sh.shWzp*sh.wzpMultiplier;
        phoenixWzp = sh.shWzp - dragonWzp;
    }else if(faction === "Phoenix"){
        phoenixWzp = sh.shWzp*sh.wzpMultiplier;
        dragonWzp = sh.shWzp - phoenixWzp;
    }

    //Update the displayed information about selected sector/SH
    //sh name
    infoP.innerHTML = sh.getName();
    infoP.innerHTML += '<br><br>';
    //sh owner
    infoP.innerHTML += sh.getOwner();
    infoP.innerHTML += '<br><br>';
    //sh wzp
    infoP.innerHTML += "Forces: <br>";
    infoP.innerHTML += `Dragon: ${dragonWzp}<br>`;
    infoP.innerHTML += `Phoenix: ${phoenixWzp}<br>`;
    //if it has been reset to EK, show EK wzp
    if(sh.getOwner()==="Evil King"){
        infoP.innerHTML +=`Evil King: ${sh.shWzp}<br>`;
    }

    //sh spawn
    infoP.innerHTML += '<hr>';
    infoP.innerHTML +=`<br>Stronghold Spawn:<br><br>`;
    for(let troop of sh.Troops){
        //only display the spawn size next to big and small
        let spawn = troop.getSpawnType();
        if(spawn==='medium'){
            spawn = '';
        }else{
            spawn=`(${spawn})`;
        }
        
        infoP.innerHTML+=`${troop.getName()}
        ${troop.getSpawnSize().toLocaleString('en-US')}          
        ${spawn}<br>`;
    }

}

//method to change SH ownership
//changing the owner to the same faction will simply re-roll sh spawn
function updateSH(){
    //locate the sh in the strongholds array and store a reference to it
    let id = selectedSH.getAttribute('id');
    let index = id.substring(id.length-1);
    sh = strongholds[index-1];
    //conquer it
    let wzp = document.getElementById('wzp-input').value;
    sh.conquerSH(changeOwnerMenu.value, wzp);
    //click the button with .click() to select it again and show updated info
    document.getElementById(id).click();
}

//function used to create a Warzone of 9 sectors
function createWz(cols){
    if(wzCreated){
        //if it already exists, do nothing
        return;
    }
    //create a grid of 9 square sectors
    for(let i=1; i<=9; i++){
        //create divs, give them an id and class
        let name = `Stronghold `+i;
        console.log('making sectors');
        btn = document.createElement('button');
        btn.setAttribute('id', 'Stronghold '+i);
        btn.setAttribute('name', name);
        btn.textContent = `${btn.getAttribute('name')}`;
        btn.classList.add('sector-item');
        //initially all sectors
        btn.classList.add('ek');
        strongholds[i-1] = new Stronghold(name);
        btn.addEventListener('click', selectSH);
        //add eventListener for hovering
        btn.addEventListener('mouseover', hoverOverFunction);
        btn.addEventListener('mouseout', hoverOutFunction);

        //add them to the main div
        mainDiv.appendChild(btn);
    }
    wzCreated = true;
}

//function for reset button, reloads page
function resetWz(){
    location.reload();
}

//change appearance of sh buttons when hovered over
function hoverOverFunction(){
    // console.log(`Hovering over ${this.name}`)
    //change text color of button slightly
    if(selectedSH !== this){
        //only change it if not selected
        this.style.color = highlightedButton;
    }
}

function hoverOutFunction(){
    //change the text color of a button back to normal
    if(selectedSH !== this){
        //only change it back if not selected
    this.style.color = normalButton;
    }
}









