import { CombatActionSeed } from "../combat/CombatAction";
import ISaveable from "../utility/ISaveable";
import { Equipment } from "./Item";

class EquipmentActionsManager implements ISaveable {
    
    private equipmentActions: { [key: string]: CombatActionSeed[] } = {};

    constructor(initialEquipmentActions?: { [key: string]: CombatActionSeed[] }) {
        if(initialEquipmentActions){
            this.equipmentActions = initialEquipmentActions;
        }
    }

    private addAction(equipment: string, action: CombatActionSeed) {
        if (!this.equipmentActions[equipment]) {
            this.equipmentActions[equipment] = [];
        }
        this.equipmentActions[equipment].push(action);
    }

    private getActions(equipment: string): CombatActionSeed[] {
        return this.equipmentActions[equipment] || [];
    }


    requestActions(equipment:Equipment, amount:number):[CombatActionSeed[], EquipmentActionsManager] {
        if(!equipment.getActionSeed()){
            return [[], this.clone()];
        }

        if(!this.equipmentActions[equipment.getName()]){
            this.equipmentActions[equipment.getName()] = [];
        }
        
        const actions = this.getActions(equipment.getName());
        for(let i = 0; i < amount - actions.length; i++){
            this.addAction(equipment.getName(), equipment.getActionSeed() || {name: "Error trying to request actions.", id:-1, uses:0});
        }

        return [actions.slice(0, amount), this.clone()];
    }

    getLatterActions(equipment:Equipment, after:number):CombatActionSeed[] {
        return this.getActions(equipment.getName()).slice(after);
    }

    getAllActions():CombatActionSeed[] {
        return Object.values(this.equipmentActions).reduce((acc, val) => acc.concat(val), []);
    }

    getAllActionsExcludingKeys(toExclude:string[]):CombatActionSeed[] {
        return Object.entries(this.equipmentActions).reduce<CombatActionSeed[]>((acc, [key, value]) => {
            if(toExclude.includes(key)){
                return acc;
            }
            return acc.concat(value);
        }, []);
    }
    
    clone(): EquipmentActionsManager {
        return new EquipmentActionsManager(JSON.parse(JSON.stringify(this.equipmentActions)));
    }

    createSaveObject() {
        throw new Error("Method not implemented.");
    }
    loadSaveObject(saveObject: any) {
        throw new Error("Method not implemented.");
    }
    isDataValid(saveData: any): boolean {
        throw new Error("Method not implemented.");
    }
}

export default EquipmentActionsManager;