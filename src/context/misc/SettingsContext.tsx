import React from 'react';
import speedSettings from '../../data/settings/speed-settings.json';
import IMap from '../../classes/exploration/IMap';
import { UniqueItemQuantitiesList } from '../../classes/caravan/Item';
import { ProgressionFlags } from '../../App';
import { Message } from '../../classes/caravan/Message';
import ISaveable from '../../classes/utility/ISaveable';

type SpeedSetting = {
    name:string;
    speedMult:number;
};

interface ISettingsManager{
    getCorrectTiming(baseTiming:number):number;
    getCurrentSpeedSetting():SpeedSetting;
    getSpeedSettings():SpeedSetting[];

    setSpeedSetting(name:string):void;

    clone():ISettingsManager;

    getSaveObject(
        map:ISaveable|null,
        inventory:ISaveable|null,
        explorationInventory:ISaveable|null,
        freeWorkers:number,
        flags:ISaveable|null,
        messages:ISaveable|null
    ):SaveObject
}

class SettingsManager implements ISettingsManager{
    allSpeedSettings:SpeedSetting[] = speedSettings;
    currentSpeedSetting:SpeedSetting;

    private seed:number;

    constructor(startingSpeedSetting:string|undefined = undefined, seed:number = 0){
        //Dummy value to prevent undefined errors
        this.currentSpeedSetting = this.allSpeedSettings[0];

        if(startingSpeedSetting){
            this.setSpeedSetting(startingSpeedSetting);
        }
        else{
            this.setSpeedSetting("Normal");
        }

        this.seed = seed;
    }

    getCorrectTiming(baseTiming:number):number{
        return baseTiming * this.currentSpeedSetting.speedMult;
    }

    getCurrentSpeedSetting():SpeedSetting{
        return this.currentSpeedSetting;
    }

    getSpeedSettings():SpeedSetting[]{
        return this.allSpeedSettings;
    }

    setSpeedSetting(name:string){
        const newSpeedSetting = this.allSpeedSettings.find((speedSetting) => speedSetting.name === name);

        if(newSpeedSetting){
            this.currentSpeedSetting = newSpeedSetting;
        }
        else{
            console.error("Speed setting not found: " + name);
        }
    }

    setSeed(newSeed:number){
        this.seed = newSeed;
    }
    getSeed():number{
        return this.seed;
    }

    /*
    IMap
    UniqueItemQuantitiesList
    UniqueItemQuantitiesList
    ProgressionFlags
    Message
    */
    getSaveObject(
        map:ISaveable|null,
        inventory:ISaveable|null,
        explorationInventory:ISaveable|null,
        freeWorkers:number,
        flags:ISaveable|null,
        messages:ISaveable|null
    ):SaveObject{
        const mapData:any = map ? map.createSaveObject() : null;
        const inventoryData:any = inventory ? inventory.createSaveObject() : null;
        const explorationInventoryData:any = explorationInventory ? explorationInventory.createSaveObject() : null;
        const messagesData:any = messages ? messages.createSaveObject(): null;
        const flagsData:any = flags ? flags.createSaveObject(): null;
        
        return {
            seed: this.seed,
            mapData: mapData,
            inventoryData:inventoryData,
            explorationInventoryData:explorationInventoryData,
            freeWorkers:freeWorkers,
            messagesData:messagesData,
            flagsData: flagsData
        }
    }

    clone(): ISettingsManager {
        return new SettingsManager(this.currentSpeedSetting.name);
    }
}

type SettingsContextType = {
    settingsManager:ISettingsManager;
    setSettingsManager:React.Dispatch<React.SetStateAction<ISettingsManager>>;
}

type SaveObject = {
    seed:number;
    mapData:any;
    inventoryData:any;
    explorationInventoryData:any;
    freeWorkers:number;
    messagesData:any;
    flagsData:any;
}

const SettingsContext = React.createContext<SettingsContextType>({settingsManager: new SettingsManager(), setSettingsManager: () => {}});
export {SettingsContext, SettingsManager};
export type {SpeedSetting, ISettingsManager, SettingsContextType, SaveObject};