import IRimeEvent from "./IRimeEvent";
import IRimeEventFactory from "./IRimeEventFactory";
import RimeEventJSON from "./RimeEventJSON";
import eventRawData from "../../data/event/events.json";
import { IItemFactory } from "../caravan/Item";

class RimeEventFactoryJSON implements IRimeEventFactory{
    private itemFactory:IItemFactory;
    private setSceneId:(newId:number)=>void;
    private closeEventScreen:() =>void;
    private clearEventLocation: () => void;

    constructor(
        itemFactory:IItemFactory,
        setSceneId:(newId:number)=>void,
        closeEventScreen:() =>void,
        clearEventLocation: () => void
    ){
        this.clearEventLocation = clearEventLocation;
        this.closeEventScreen = closeEventScreen;
        this.setSceneId = setSceneId;
        this.itemFactory = itemFactory;
    }

    createEventById(id: string): RimeEventJSON {
        const data = eventRawData.allEvents.find((raw) => {
            return raw.key == id;
        });

        if(!data){
            console.log(`Event with key/id of ${id} not found, using default event instead.`)
            return new RimeEventJSON(eventRawData.allEvents[0].key, this.itemFactory, this.setSceneId, this.closeEventScreen, this.clearEventLocation);
        }

        return new RimeEventJSON(data.key, this.itemFactory, this.setSceneId, this.closeEventScreen, this.clearEventLocation);
    }
}

export default RimeEventFactoryJSON;