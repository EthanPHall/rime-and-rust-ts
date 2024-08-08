import { SaveObject } from "../../context/misc/SettingsContext";

interface ISaveable{
    createSaveObject():any;
    loadSaveObject(saveObject:any):any;
}

export default ISaveable;