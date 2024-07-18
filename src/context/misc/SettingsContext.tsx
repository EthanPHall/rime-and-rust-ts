import React from 'react';
import speedSettings from '../../data/settings/speed-settings.json';

type SpeedSetting = {
    name:string;
    speedMult:number;
};

interface ISettingsManager{
    getCorrectTiming(baseTiming:number):number;

    getSpeedSettings():SpeedSetting[];

    setSpeedSetting(name:string):void;

    clone():ISettingsManager;
}

class SettingsManager implements ISettingsManager{
    allSpeedSettings:SpeedSetting[] = speedSettings;
    currentSpeedSetting:SpeedSetting;

    constructor(startingSpeedSetting:string|undefined = undefined){
        //Dummy value to prevent undefined errors
        this.currentSpeedSetting = this.allSpeedSettings[0];

        if(startingSpeedSetting){
            this.setSpeedSetting(startingSpeedSetting);
        }
        else{
            this.setSpeedSetting("Normal");
        }
    }

    getCorrectTiming(baseTiming:number):number{
        return baseTiming * this.currentSpeedSetting.speedMult;
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

    clone(): ISettingsManager {
        return new SettingsManager(this.currentSpeedSetting.name);
    }
}

type SettingsContextType = {
    settingsManager:ISettingsManager;
    setSettingsManager:React.Dispatch<React.SetStateAction<ISettingsManager>>;
}

const SettingsContext = React.createContext<SettingsContextType>({settingsManager: new SettingsManager(), setSettingsManager: () => {}});
export {SettingsContext, SettingsManager};
export type {SpeedSetting, ISettingsManager, SettingsContextType};