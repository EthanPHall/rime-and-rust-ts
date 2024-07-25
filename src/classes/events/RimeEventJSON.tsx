import eventData from "../../data/event/events.json"; 
import IRimeEvent from "./IRimeEvent";
import IRimeEventScene from "./IRimeEventScene";



class RimeEventJSON implements IRimeEvent{
    private key:string;
    private name:string;
    private scenes:IRimeEventScene[] = [];

    constructor(key:string){
        this.key = key;
        this.name = "Error, event " + key + " not found.";

        const event = eventData.allEvents.find((data) => {
            return data.key == key;
        })

        if(event){
            this.name = event.name;
        }
    }

    getScenes(): IRimeEventScene[] {
        return this.scenes;
    }

    getName():string{
        return this.name;
    }
    getKey():string{
        return this.key;
    }
}

export default RimeEventJSON;