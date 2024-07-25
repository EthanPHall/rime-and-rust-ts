import eventData from "../../data/event/events.json"; 

class RimeEventJSON{
    private key:string;
    private name:string;

    constructor(key:string){
        this.key = key;
        this.name = "Error";

        const event = eventData.allEvents.find((data) => {
            return data.key == key;
        })

        if(event){
            this.name = event.name;
        }
    }

    getName():string{
        return this.name;
    }
    getKey():string{
        return this.key;
    }
}

export default RimeEventJSON;