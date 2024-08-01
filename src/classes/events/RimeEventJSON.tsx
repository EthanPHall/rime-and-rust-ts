import IRimeEvent from "./IRimeEvent";
import IRimeEventScene from "./IRimeEventScene";
import eventRawData from "../../data/event/events.json"; 
import RimeEventSceneRewards from "./RimeEventSceneRewards";
import RimeEventSceneTextOnly from "./RimeEventSceneTextOnly";
import IRimeEventAction from "./IRimeEventAction";
import RimeEventActionGoto from "./RimeEventActionGoto";
import RimeEventActionClose from "./RimeEventActionClose";
import { IItemFactory, ItemQuantity, UniqueItemQuantitiesList } from "../caravan/Item";
import RimeEventActionCloseAndClear from "./RimeEventActionCloseAndClear";
import RimeEventActionStartCombat from "./RimeEventActionStartCombat";
import ICombatEncounter from "../combat/ICombatEncounter";
import CombatEncounterJSON from "../combat/CombatEncounter";
import RimeEventActionReturnAndLose from "./RimeEventActionReturnAndLose";
import RimeEventActionReturn from "./RimeEventActionReturn";
import RimeEventSceneActionOnly from "./RimeEventSceneActionOnly";



class RimeEventJSON implements IRimeEvent{
    private key:string;
    private name:string;
    private scenes:IRimeEventScene[] = [];
    private itemFactory:IItemFactory;
    private setSceneId:(newId:number)=>void;
    private closeEventScreen:() =>void;
    private returnToCaravan:() =>void;
    private clearEventLocation: () => void;
    private setCombatEncounterKey: (newEncounter: string|null) => void;
    private clearExplorationInventory: () => void;

    constructor(
        key:string,
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

        this.key = key;
        this.name = "Error, event " + key + " not found.";

        const event = eventRawData.allEvents.find((data) => {
            return data.key == key;
        })

        if(event){
            this.name = event.name;
            
            event.scenes?.forEach((scene) => {
                const options:IRimeEventAction[] = [];
                scene.options.forEach((action) => {
                    switch(action.actionType.split(" ")[0]){
                        case eventRawData.actionTypes.goto:
                            options.push(new RimeEventActionGoto(setSceneId, parseInt(action.actionType.split(" ")[1])));
                            break;
                        case eventRawData.actionTypes.close:
                            options.push(new RimeEventActionClose(closeEventScreen));
                            break;
                        case eventRawData.actionTypes.closeAndClearLocation:
                            options.push(new RimeEventActionCloseAndClear(clearEventLocation, closeEventScreen));
                            break;
                        case eventRawData.actionTypes.returnToCaravan:
                            options.push(new RimeEventActionReturn(returnToCaravan));
                            break;
                        case eventRawData.actionTypes.returnAndLoseInventory:
                            options.push(new RimeEventActionReturnAndLose(clearExplorationInventory, returnToCaravan));
                            break;
                        case eventRawData.actionTypes.startCombat:
                            options.push(new RimeEventActionStartCombat(setCombatEncounterKey, action.actionType.split(" ")[1]));
                            break;
                        default:
                            console.log("Unsupported scene action:", action.actionType);
                    }
                });
                
                switch(scene.type){
                    case eventRawData.sceneTypes.rewards:
                        if(!scene.rewards){
                            console.log("Event with type 'rewards' did not have a rewards field.");
                            break;
                        }

                        const itemQuantities:ItemQuantity[] = [];
                        scene.rewards.forEach((reward) => {
                            const newQuantity = new ItemQuantity(
                                this.itemFactory.createItem(reward.itemKey),
                                Math.floor(Math.random() * (Math.max(reward.range.max - reward.range.min, 0) + 1)) + reward.range.min
                            );

                            itemQuantities.push(newQuantity);
                        })
                        const rewardsInventory:UniqueItemQuantitiesList = new UniqueItemQuantitiesList(itemQuantities);

                        this.scenes.push(
                            new RimeEventSceneRewards(
                                scene.sceneKey,
                                scene.type,
                                scene.text,
                                options,
                                rewardsInventory
                            )
                        );
                        break;
                    case eventRawData.sceneTypes.textOnly:
                        this.scenes.push(
                            new RimeEventSceneTextOnly(
                                scene.sceneKey,
                                scene.type,
                                scene.text,
                                options
                            )
                        );
                        break;
                    case eventRawData.sceneTypes.actionOnly:
                        this.scenes.push(
                            new RimeEventSceneActionOnly(
                                scene.sceneKey,
                                scene.type,
                                options
                            )
                        );
                        break;
                    default:
                        console.log("Unsupported scene type:", scene.type);
                }
            });
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