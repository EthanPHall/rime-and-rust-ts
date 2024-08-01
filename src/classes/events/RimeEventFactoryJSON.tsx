import IRimeEvent from "./IRimeEvent";
import IRimeEventFactory from "./IRimeEventFactory";
import RimeEventJSON from "./RimeEventJSON";
import eventRawData from "../../data/event/events.json";
import { IItemFactory } from "../caravan/Item";
import ICombatEncounter from "../combat/ICombatEncounter";

class RimeEventFactoryJSON implements IRimeEventFactory{
    private itemFactory:IItemFactory;
    private setSceneId:(newId:number)=>void;
    private closeEventScreen:() =>void;
    private clearEventLocation: () => void;
    private setCombatEncounterKey: (newEncounter: string|null) => void;
    private clearExplorationInventory: () => void
    private returnToCaravan:() =>void;

    constructor(
        itemFactory:IItemFactory,
        setSceneId:(newId:number)=>void,
        closeEventScreen:() =>void,
        clearEventLocation: () => void,
        setCombatEncounterKey: (newEncounter: string|null) => void,
        clearExplorationInventory: () => void,
        returnToCaravan:() =>void
    ){
        this.setCombatEncounterKey = setCombatEncounterKey;
        this.clearEventLocation = clearEventLocation;
        this.closeEventScreen = closeEventScreen;
        this.setSceneId = setSceneId;
        this.itemFactory = itemFactory;
        this.clearExplorationInventory = clearExplorationInventory;
        this.returnToCaravan = returnToCaravan;
    }

    createEventById(id: string): RimeEventJSON {
        const data = eventRawData.allEvents.find((raw) => {
            return raw.key == id;
        });

        if(!data){
            console.log(`Event with key/id of ${id} not found, using default event instead.`)
            return new RimeEventJSON(eventRawData.allEvents[0].key, this.itemFactory, this.setSceneId, this.closeEventScreen, this.clearEventLocation, this.setCombatEncounterKey, this.clearExplorationInventory, this.returnToCaravan);
        }

        return new RimeEventJSON(data.key, this.itemFactory, this.setSceneId, this.closeEventScreen, this.clearEventLocation, this.setCombatEncounterKey, this.clearExplorationInventory, this.returnToCaravan);
    }
}

export default RimeEventFactoryJSON;