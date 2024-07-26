import IRimeEvent from "./IRimeEvent";
import IRimeEventFactory from "./IRimeEventFactory";
import RimeEventJSON from "./RimeEventJSON";
import eventRawData from "../../data/event/events.json";
import { IItemFactory } from "../caravan/Item";

class RimeEventFactoryJSON implements IRimeEventFactory{
    private itemFactory:IItemFactory;

    constructor(itemFactory:IItemFactory){
        this.itemFactory = itemFactory;
    }

    createEventById(id: string): RimeEventJSON {
        const data = eventRawData.allEvents.find((raw) => {
            return raw.key == id;
        });

        if(!data){
            console.log(`Event with key/id of ${id} not found, using default event instead.`)
            return new RimeEventJSON(eventRawData.allEvents[0].key, this.itemFactory);
        }

        return new RimeEventJSON(data.key, this.itemFactory);
    }
}

export default RimeEventFactoryJSON;