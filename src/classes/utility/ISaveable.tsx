import { SaveObject } from "../../context/misc/SettingsContext";

interface ISaveable{
    createSaveObject():any;
    loadSaveObject(saveObject:any):any;
    isDataValid(saveData:any):boolean;
}

export default ISaveable;