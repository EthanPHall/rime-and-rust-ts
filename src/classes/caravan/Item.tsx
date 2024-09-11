import { useContext } from "react";
import { ItemFactoryContext, ProgressionContext, ProgressionContextType, ProgressionFlags } from "../../App";
import resourceData from "../../data/caravan/resources.json";
import sledData from  "../../data/caravan/sleds.json";
import sledDogData from "../../data/caravan/sled-dogs.json";
import equipmentData from "../../data/caravan/equipment.json";
import IdGenerator from "../utility/IdGenerator";
import ISaveable from "../utility/ISaveable";
import { CombatActionSeed } from "../combat/CombatAction";
import { PlayerCombatStatMod } from "../combat/PlayerCombatStats";
import { stat } from "fs";

type ItemJson = {
    key: string;
};

//These seed classes are important because createItem() in ItemFactoryJSON
//is recursive, and there needs to be "deadend" classes that won't lead
//to more Item generation, and to infinite recursion. These classes are those deadends.
class ItemSeed{
    key: string;

    constructor(json: ItemJson){
        this.key = json.key;
    }

    convertToItem(factory:IItemFactory):IItem{
        return factory.createItem(this.key);
    }
};
interface IItem{
    getKey: () => string;
    getName: () => string;
    getRecipe: () => RecipeSeed;
    getId: () => number;
    isUnlocked: (flags:ProgressionFlags) => boolean;
    inheritExistingData: (existing:IItem) => void;
}

type ResourceJson = {
    key: string;
    name: string;
    recipe: RecipeJson;
    unlockFlags: string[];
}
class ResourceSeed{
    key: string;
    name: string;
    recipe: RecipeSeed;
    unlockFlags: string[];

    constructor(
        json: ResourceJson
    ){
        this.key = json.key;
        this.name = json.name;
        this.recipe = new RecipeSeed(json.recipe);
        this.unlockFlags = json.unlockFlags;
    }

    convertToResource(factory:IItemFactory):Resource{
        return factory.createItem(this.key) as Resource;
    }
};
class Resource implements IItem{
    private key:string;
    private name:string;
    private recipe:RecipeSeed;
    private unlockFlags:string[];
    private id:number;

    constructor(key:string, name:string, recipe:RecipeSeed, unlockFlags:string[]){
        this.key = key;
        this.name= name;
        this.recipe = recipe;
        this.unlockFlags = unlockFlags;

        this.id = IdGenerator.generateUniqueId();
    }

    getKey():string{
        return this.key;
    }
    getName():string{
        return this.name;
    }
    getRecipe():RecipeSeed{
        return this.recipe;
    }
    getId():number{
        return this.id;
    }
    isUnlocked(flags: ProgressionFlags):boolean{
        return this.unlockFlags.some((flag) => {
            return !flags.getFlag(flag);
        })
    }

    clone(){
        return new Resource(this.key, this.name, this.recipe, this.unlockFlags);
    }

    inheritExistingData(existing:IItem){
        if(existing instanceof Resource){
            this.name = existing.getName();
            this.recipe = existing.getRecipe();
            this.unlockFlags = existing.unlockFlags;
        }
    }

    static pickOutResources(list:IItem[]): Resource[]{
        return list.filter((item) => {
            return item instanceof Resource;
        }) as Resource[];
    }
    static pickOutResourceQuantities(list:UniqueItemQuantitiesList|ItemQuantity[]): ResourceQuantity[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Resource;
            });
    
            return filteredList.map((quantity) => {
                return new ResourceQuantity(quantity.getBaseItem() as Resource, quantity.getQuantity())
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Resource;
            });
    
            return filteredList.map((quantity) => {
                return new ResourceQuantity(quantity.getBaseItem() as Resource, quantity.getQuantity())
            });
        }
    }
}

type EquipmentJson = {
    key: string;
    name: string;
    recipe: RecipeJson;
    unlockFlags: string[];
    actionKey: string;
    actionUses: number;
    statsMods: PlayerCombatStatMod[];
};
class EquipmentSeed{
    key: string;
    name: string;
    recipe: RecipeSeed;
    unlockFlags: string[];
    actionKey: string;
    actionUses: number;

    constructor(
        json: EquipmentJson
    ){
        this.key = json.key;
        this.name = json.name;
        this.recipe = new RecipeSeed(json.recipe);
        this.unlockFlags = json.unlockFlags;
        this.actionKey = json.actionKey;
        this.actionUses = json.actionUses;
    }

    convertToEquipment(factory:IItemFactory):Equipment{
        return factory.createItem(this.key) as Equipment;
    }
};
class Equipment implements IItem{
    private id:number;
    private key:string;
    private name:string;
    private recipe:RecipeSeed;
    private unlockFlags:string[];
    actionKey: string;
    actionUses: number;
    statsMods: PlayerCombatStatMod[];

    constructor(key:string, name:string, recipe:RecipeSeed, unlockFlags:string[], actionKey: string, actionUses: number, statMods: PlayerCombatStatMod[]){
        this.key = key;
        this.name= name;
        this.recipe = recipe;
        this.unlockFlags = unlockFlags;
        this.actionKey = actionKey;
        this.actionUses = actionUses;
        this.statsMods = statMods;

        this.id = IdGenerator.generateUniqueId();
    }

    getId():number{
        return this.id;
    }
    getKey():string{
        return this.key;
    }
    getName():string{
        return this.name;
    }
    getRecipe():RecipeSeed{
        return this.recipe;
    }
    isUnlocked(flags: ProgressionFlags):boolean{
        return this.unlockFlags.some((flag) => {
            return !flags.getFlag(flag);
        })
    }

    clone():IItem{
        return new Equipment(this.key, this.name, this.recipe, this.unlockFlags, this.actionKey, this.actionUses, this.statsMods);
    }

    inheritExistingData(existing:IItem){
        if(existing instanceof Equipment){
            this.name = existing.getName();
            this.recipe = existing.getRecipe();
            this.unlockFlags = existing.unlockFlags;
        }
    }

    getActionSeed():CombatActionSeed|null{
        if(this.actionKey == "") return null;

        return {name:this.actionKey, uses:this.actionUses, id:IdGenerator.generateUniqueId()};
    }

    getStatMods():PlayerCombatStatMod[]{
        return this.statsMods;
    }

    static pickOutEquipment(list:IItem[]): Equipment[]{
        return list.filter((item) => {
            return item instanceof Equipment;
        }) as Equipment[];
    }

    static pickOutEquipmentQuantities(list:UniqueItemQuantitiesList|ItemQuantity[]): EquipmentQuantity[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Equipment;
            });
    
            return filteredList.map((quantity) => {
                return new EquipmentQuantity(quantity.getBaseItem() as Equipment, quantity.getQuantity());
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Equipment;
            });
    
            return filteredList.map((quantity) => {
                return new EquipmentQuantity(quantity.getBaseItem() as Equipment, quantity.getQuantity());
            });
        }
    }
}


class EquipmentQuantity{
    private baseEquipment:Equipment;
    private quantity:number;

    constructor(
        equipment:Equipment,
        quantity:number,
    ){
        this.baseEquipment = equipment;
        this.quantity = quantity;
    }

    getBaseEquipment():Equipment{
        return this.baseEquipment;
    }
    getQuantity():number{
        return this.quantity;
    }
    modifyQuantity(mod:number){
        this.quantity += mod;
    }
    setQuantity(newQuantity:number){
        this.quantity = newQuantity;
    }
}

type SledJson = {
    key: string;
    name: string;
    recipe: RecipeJson;
    unlockFlags: string[];
    passiveRecipe: RecipeJson;
    workers: number;
    canCraftList: ItemJson[];
}
class SledSeed{
    key: string;
    name: string;
    recipe: RecipeSeed;
    unlockFlags: string[];
    passiveRecipe: RecipeSeed;
    workers: number;
    canCraftList: ItemSeed[];

    constructor(
        json: SledJson
    ){
        this.key = json.key;
        this.name = json.name;
        this.recipe = new RecipeSeed(json.recipe);
        this.unlockFlags = json.unlockFlags;
        this.passiveRecipe = new RecipeSeed(json.passiveRecipe);
        this.workers = json.workers;
        this.canCraftList = json.canCraftList.map((item) => {
            return new ItemSeed(item);
        });
    }

    convertToSled(factory:IItemFactory):Sled{
        return factory.createItem(this.key) as Sled;
    }
};
class Sled implements IItem{
    private key:string;
    private name:string;
    private recipe:RecipeSeed;
    private unlockFlags:string[];

    private passiveRecipe:RecipeSeed;
    private workers:number;
    private canCraftList: ItemSeed[];

    private factory:IItemFactory;
    private id:number;

    private getExistingSledCount:()=>number;

    constructor(
        key:string, 
        name:string, 
        recipe:RecipeSeed, 
        unlockFlags:string[],
        passiveRecipe:RecipeSeed,
        workers:number,
        canCraftList: ItemSeed[],
        factory:IItemFactory,
        getExistingSledCount:()=>number,
    ){
        this.key = key;
        this.name= name;
        this.recipe = recipe;
        this.unlockFlags = unlockFlags;

        this.passiveRecipe = passiveRecipe;
        this.workers = workers;
        this.canCraftList = canCraftList;

        this.factory = factory;
        this.id = IdGenerator.generateUniqueId();

        this.getExistingSledCount = getExistingSledCount;
    }

    getKey():string{
        return this.key;
    }
    getName():string{
        return this.name;
    }
    getRecipe():RecipeSeed{
        return this.getRecipeWithDogs(this.getExistingSledCount());
    }
    isUnlocked(flags: ProgressionFlags):boolean{
        return this.unlockFlags.some((flag) => {
            return !flags.getFlag(flag);
        })
    }

    clone():IItem{
        return new Sled(this.key, this.name, this.recipe, this.unlockFlags, this.passiveRecipe, this.workers, this.canCraftList, this.factory, this.getExistingSledCount);
    }

    inheritExistingData(existing:IItem){
        if(existing instanceof Sled){
            this.name = existing.getName();
            this.recipe = existing.getRecipe();
            this.unlockFlags = existing.unlockFlags;
            this.passiveRecipe = existing.getPassiveRecipe();
            this.workers = existing.getWorkers();
            this.canCraftList = existing.getCanCraftList();
        }
    }

    private getRecipeWithDogs(existingSleds:number):RecipeSeed{
        //using the existing sleds number, determine how many dogs are needed for this sled
        let howManyDogs = 0;
        switch(existingSleds){
            case 0:
            case 1:
                howManyDogs = 1;
                break;
            case 2:
            case 3:
            case 4:
                howManyDogs = 3;
                break;
            case 5:
            case 6:
            case 7:
                howManyDogs = 7;
                break;
            case 8:
            case 9:
            case 10:
                howManyDogs = 16;
                break;
            case 11:
                howManyDogs = 35;
                break;
            default:
                howManyDogs = 999;
        }

        //create a new list of costs, which is the regular recipe costs with the new dog cost
        const newCosts:ItemQuantitySeed[] = [...this.recipe.costs];
        newCosts.push(new ItemQuantitySeed(sledDogData["Default Key"], howManyDogs));

        //create a new Recipe with the new cost but the same results
        const newRecipe = new RecipeSeed({
            costs: newCosts,
            results: this.recipe.results
        });

        //return the new Recipe
        return newRecipe;
    }

    getSellRecipe(itemFactory:IItemFactory):Recipe{
        console.log(this.recipe);

        //Get the new costs list, which is just this Item with quantity 1
        const costs:ItemQuantity[] = [new ItemQuantity(this, 1)];

        //Get the new results list, which is the regular recipe costs with halved quantities
        const results:ItemQuantity[] = this.recipe.convertToRecipe(this.factory).getCosts().map((cost) => {
            return new ItemQuantity(cost.getBaseItem(), Math.floor(cost.getQuantity() / 2));
        });
        
        //return a new Recipe with these components.
        return new Recipe(costs, results);
    }
    getPassiveRecipe():RecipeSeed{
        return this.passiveRecipe;
    }
    getWorkers():number{
        return this.workers;
    }
    setWorkers(newWorkers:number):void{
        this.workers = newWorkers;
    }
    getCanCraftList():ItemSeed[]{
        return this.canCraftList;
    }
    getId():number{
        return this.id;
    }

    getWorkerAdjustedPassiveRecipe(itemFactory:IItemFactory):Recipe{
        const recipe:Recipe = this.passiveRecipe.convertToRecipe(itemFactory);
        
        const adjustedCosts = recipe.getCosts().map((cost) => {
          const newCost = cost.clone();
          newCost.setQuantity(newCost.getQuantity() * this.workers);
          return newCost;
        });
    
        const adjustedResults = recipe.getResults().map((result) => {
          const newResult = result.clone();
          newResult.setQuantity(newResult.getQuantity() * this.workers);
          return newResult;
        });
    
        return new Recipe(adjustedCosts, adjustedResults);
      }

    /**
     *      
     * @param list The list to look through to find ItemQuantities whose baseItem is a Sled. Could also be a list of IItems
     * @param ignoreZeroQuantitySleds If list is a UniqueItemQuantitiesList, should sleds with a quantity of 0 be ignored?
     * @returns An array of Sled objects
     */
    static pickOutSleds(list:UniqueItemQuantitiesList|IItem[], ignoreZeroQuantitySleds:boolean = false): Sled[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Sled && (ignoreZeroQuantitySleds ? itemQuantity.getQuantity() > 0 : true);
            });
    
            return filteredList.map((quantity) => {
                return quantity.getBaseItem() as Sled;
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity instanceof Sled;
            });
    
            return filteredList as Sled[];
        }
    }

    //TODO: the other pick out methods should be refactored to be like this one.
    /**
     * 
     * @param list The list to look through to find ItemQuantities whose baseItem is a Sled
     * @returns A list of new SledQuantities with the same quantities as the ItemQuantities in the list
     */
    static pickOutSledQuantities(list:UniqueItemQuantitiesList|ItemQuantity[]): SledQuantity[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Sled;
            });
    
            return filteredList.map((quantity) => {
                return new SledQuantity(quantity.getBaseItem() as Sled, quantity.getQuantity());
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Sled;
            });

            return filteredList.map((quantity) => {
                return new SledQuantity(quantity.getBaseItem() as Sled, quantity.getQuantity());
            });
        }
    }
}

type SledDogJson = {
    key: string;
    name: string;
    recipe: RecipeJson;
    unlockFlags: string[];
}
class SledDogSeed{
    key: string;
    name: string;
    recipe: RecipeSeed;
    unlockFlags: string[];

    constructor(
        json: SledDogJson
    ){
        this.key = json.key;
        this.name = json.name;
        this.recipe = new RecipeSeed(json.recipe);
        this.unlockFlags = json.unlockFlags;
    }

    convertToSledDog(factory:IItemFactory):SledDog{
        return factory.createItem(this.key) as SledDog;
    }
};
class SledDog implements IItem{
    private id: number;
    private key: string;
    private name: string;
    private recipe: RecipeSeed;
    private unlockFlags: string[];

    constructor(
        key: string,
        name: string,
        recipe: RecipeSeed,
        unlockFlags: string[]
    ) {
        this.id = IdGenerator.generateUniqueId();
        this.key = key;
        this.name = name;
        this.recipe = recipe;
        this.unlockFlags = unlockFlags;
    }

    getId(): number {
        return this.id;
    }

    getKey(): string {
        return this.key;
    }

    getName(): string {
        return this.name;
    }

    getRecipe(): RecipeSeed {
        return this.recipe;
    }

    isUnlocked(flags: ProgressionFlags): boolean {
        return this.unlockFlags.some((flag) => {
            return !flags.getFlag(flag);
        });
    }

    inheritExistingData(existing: IItem): void {
        if (existing instanceof SledDog) {
            this.name = existing.getName();
            this.recipe = existing.getRecipe();
            this.unlockFlags = existing.unlockFlags;
        }
    }

    clone(): IItem {
        return new SledDog(this.key, this.name, this.recipe, this.unlockFlags);
    }

    static pickOutSledDogs(list: UniqueItemQuantitiesList | IItem[]): SledDog[] {
        if (list instanceof UniqueItemQuantitiesList) {
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof SledDog;
            });

            return filteredList.map((quantity) => {
                return quantity.getBaseItem() as SledDog;
            });
        } else {
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity instanceof SledDog;
            });

            return filteredList as SledDog[];
        }
    }

    static pickOutSledDogQuantities(list: UniqueItemQuantitiesList | ItemQuantity[]): SledDogQuantity[] {
        if (list instanceof UniqueItemQuantitiesList) {
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof SledDog;
            });

            return filteredList.map((quantity) => {
                return new SledDogQuantity(quantity.getBaseItem() as SledDog, quantity.getQuantity());
            });
        } else {
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof SledDog;
            });

            return filteredList.map((quantity) => {
                return new SledDogQuantity(quantity.getBaseItem() as SledDog, quantity.getQuantity());
            });
        }
    }
}
class SledDogQuantity{
    private baseSledDog:SledDog;
    private quantity:number;

    constructor(
        sledDog:SledDog,
        quantity:number,
    ){
        this.baseSledDog = sledDog;
        this.quantity = quantity;
    }

    getSledDog():SledDog{
        return this.baseSledDog;
    }
    getQuantity():number{
        return this.quantity;
    }
    modifyQuantity(mod:number){
        this.quantity += mod;
    }
    setQuantity(newQuantity:number){
        this.quantity = newQuantity;
    }
}

class UniqueItemQuantitiesList implements ISaveable{
    private list:ItemQuantity[];
    private maxCapacity:number;
    private currentCapacity:number = 0;
    private itemFactory:IItemFactory;

    constructor(list:ItemQuantity[], itemFactory:IItemFactory, maxCapacity:number = Infinity){
        this.list = list;
        this.maxCapacity = maxCapacity ? maxCapacity : Infinity;
        this.itemFactory = itemFactory;
    }
    createSaveObject() {
        console.log(
            {
                listData:this.list.map((itemQuantity) => {
                    return {
                        itemKey:itemQuantity.getBaseItem().getKey(),
                        quantity:itemQuantity.getQuantity()
                    }
                }),
                maxCapacityData:this.maxCapacity,
                currentCapacityData:this.currentCapacity,
            }
        )

        return{
            listData:this.list.map((itemQuantity) => {
                return {
                    itemKey:itemQuantity.getBaseItem().getKey(),
                    quantity:itemQuantity.getQuantity()
                }
            }),
            maxCapacityData:this.maxCapacity,
            currentCapacityData:this.currentCapacity,
        }
    }
    loadSaveObject(inventoryData:any) {
        this.maxCapacity = inventoryData.maxCapacityData;
        this.currentCapacity = inventoryData.currentCapacityData;
        this.list = inventoryData.listData.map((itemQuantityData:any) => {
            const newItemQuantity = new ItemQuantity(this.itemFactory.createItem(itemQuantityData.itemKey), itemQuantityData.quantity);
            return newItemQuantity;
        })
    }

    isDataValid(inventoryData:any): boolean {
        return (
            inventoryData.maxCapacityData != undefined && inventoryData.maxCapacityData != null &&
            inventoryData.currentCapacityData != undefined && inventoryData.currentCapacityData != null &&
            inventoryData.listData != undefined && inventoryData.listData != null && Array.isArray(inventoryData.listData)
        );
    }

    clone():UniqueItemQuantitiesList{
        return new UniqueItemQuantitiesList(this.list, this.itemFactory, this.maxCapacity);
    }
    deepClone():UniqueItemQuantitiesList{
        return new UniqueItemQuantitiesList(this.list.map((itemQuantity) => {
            return itemQuantity.clone();
        }), 
        this.itemFactory,
        this.maxCapacity
    );
    }
    getListCopy():ItemQuantity[]{
        return [...this.list];
    }

    /**
     * 
     * @param newItemQuantity The new ItemQuantity to add to the list. If the item associated with the new quantity already exists in the list, increment the existing quantity. Otherwise, add the new quantity to the list.
     */
    modify(newItemQuantity:ItemQuantity){
        let existingIndex:number = -1;
        this.list.forEach((currentItemQuantity, index) => {
            if(currentItemQuantity.getBaseItem().getKey() == newItemQuantity.getBaseItem().getKey()){
                existingIndex = index;
                return;
            }
        })

        //If the item associated with the new quantity already exists in the list, increment the existing quantity
        if(existingIndex != -1){
            this.list[existingIndex].modifyQuantity(
                newItemQuantity.getQuantity()
            );
        }
        //else, add the new quantity to the list
        else{
            this.list.push(newItemQuantity);
        }
    }
    /**
     * 
     * @param itemQuantity The ItemQuantity whose quantity should be set in the list. If the item associated with the new quantity already exists in the list, set the existing quantity to the new quantity. Otherwise, add the new quantity to the list.
     */
    set(itemQuantity:ItemQuantity){
        let existingIndex:number = -1;
        this.list.forEach((currentItemQuantity, index) => {
            if(currentItemQuantity.getBaseItem().getKey() == itemQuantity.getBaseItem().getKey()){
                existingIndex = index;
                return;
            }
        })

        //If the item associated with the new quantity already exists in the list, increment the existing quantity
        if(existingIndex != -1){
            this.list[existingIndex].setQuantity(
                itemQuantity.getQuantity()
            );
        }
        //else, add the new quantity to the list
        else{
            this.list.push(itemQuantity);
        }
    }

    allQuantitiesArePositive():boolean{
        return this.list.every((itemQuantity) => {
            return itemQuantity.getQuantity() >= 0;
        });
    }

    getNegativeQuantities():ItemQuantity[]{
        return this.list.filter((itemQuantity) => {
            return itemQuantity.getQuantity() < 0;
        });
    }

    filter(predicate: (value: ItemQuantity, index: number, array: ItemQuantity[]) => unknown): ItemQuantity[]{
        return this.list.filter(predicate);
    }

    forEach(predicate: (value: ItemQuantity, index: number, array: ItemQuantity[]) => unknown): void{
        this.list.forEach(predicate);
    }

    find(predicate: (value: ItemQuantity, index: number, array: ItemQuantity[]) => unknown): ItemQuantity|undefined{
        return this.list.find(predicate);
    }

    getCurrentCapacity():number{
        let currentCapacity:number = 0;

        this.list.forEach((quantity) => {
            currentCapacity += quantity.getQuantity();
        })

        return currentCapacity;
    }
    
    getMaxCapacity():number{
        return this.maxCapacity;
    }

    capacityReached():boolean{
        return this.getCurrentCapacity() >= this.maxCapacity;
    }
}

type ItemQuantityJson = {
    key: string;
    quantity: number;
}
class ItemQuantitySeed{
    key: string;
    quantity: number;

    constructor(
        key: string,
        quantity: number
    ){
        this.key = key;
        this.quantity = quantity;
    }

    convertToItemQuantity(factory:IItemFactory):ItemQuantity{
        return new ItemQuantity(factory.createItem(this.key), this.quantity);
    }
};

class ItemQuantity{
    private baseItem:IItem;
    private quantity:number;

    constructor(
        item:IItem,
        quantity:number,
    ){
        this.baseItem = item;
        this.quantity = quantity;
    }

    clone():ItemQuantity{
        return new ItemQuantity(this.baseItem, this.quantity);
    }

    getBaseItem():IItem{
        return this.baseItem;
    }
    getQuantity():number{
        return this.quantity;
    }
    modifyQuantity(mod:number){
        this.quantity += mod;
    }

    setQuantity(newQuantity:number){
        this.quantity = newQuantity;
    }
}

class ResourceQuantity{
    private baseResource:Resource;
    private quantity:number;

    constructor(
        resource:Resource,
        quantity:number,
    ){
        this.baseResource = resource;
        this.quantity = quantity;
    }

    getBaseResource():Resource{
        return this.baseResource;
    }
    getQuantity():number{
        return this.quantity;
    }
    modifyQuantity(newQuantity:number){
        this.quantity += newQuantity;
    }
    setQuantity(newQuantity:number){
        this.quantity = newQuantity;
    }
}

class SledQuantity{
    private baseSled:Sled;
    private quantity:number;

    constructor(
        sled:Sled,
        quantity:number,
    ){
        this.baseSled = sled;
        this.quantity = quantity;
    }

    getBaseSled():Sled{
        return this.baseSled;
    }
    getQuantity():number{
        return this.quantity;
    }

    modifyQuantity(mod:number){
        this.quantity += mod;
    }

    setQuantity(newQuantity:number){
        this.quantity = newQuantity;
    }
}

type RecipeJson = {
    costs: ItemQuantityJson[];
    results: ItemQuantityJson[];
}
class RecipeSeed{
    costs: ItemQuantitySeed[];
    results: ItemQuantitySeed[];

    constructor(
        json: RecipeJson
    ){
        this.costs = json.costs.map((cost) => {
            return new ItemQuantitySeed(cost.key, cost.quantity);
        });
        this.results = json.results.map((result) => {
            return new ItemQuantitySeed(result.key, result.quantity);
        });
    }

    convertToRecipe(factory:IItemFactory):Recipe{
        return new Recipe(
            this.costs.map((cost) => {
                return new ItemQuantity(factory.createItem(cost.key), cost.quantity);
            }),
            this.results.map((result) => {
                return new ItemQuantity(factory.createItem(result.key), result.quantity);
            })
        );
    }
};
class Recipe{
    private costs:ItemQuantity[];
    private results:ItemQuantity[];

    constructor(
        costs:ItemQuantity[],
        results:ItemQuantity[]
    ){
        this.costs = costs;
        this.results = results;
    }

    getCosts():ItemQuantity[]{
        return this.costs;
    }
    getResults():ItemQuantity[]{
        return this.results;
    }

    removeCosts():void{
        this.costs = [];
    }

    stringifyCosts():string{
        return this.costs.map((cost) => {
            return cost.getBaseItem().getName() + ": " + cost.getQuantity();
        }).join("\n");
    }
}
interface IRecipeFail{
    getRecipe():Recipe;
    getReasons():string[];
}
class RecipeFail implements IRecipeFail{
    private _recipe:Recipe;
    private _reasons:string[];

    constructor(
        recipe:Recipe,
        reasons:string[]
    ){
        this._recipe = recipe;
        this._reasons = reasons;
    }

    getRecipe():Recipe{
        return this._recipe;
    }
    getReasons():string[]{
        return this._reasons;
    }
}

interface IItemFactory{
    createItem: (key:string) => IItem;
    getAllItems: () => IItem[];
}

class ItemFactoryJSON implements IItemFactory{
    private resourceJsons:{[key:string]: ResourceJson} = resourceData;
    private sledJsons:{[key:string]: SledJson} = sledData;
    private sledDogJsons:{[key:string]: SledDogJson} = sledDogData["Dog Data"];
    private equipmentJsons:{[key:string]: EquipmentJson} = equipmentData;

    private allItems:IItem[];

    private getExistingSledCount:()=>number;

    constructor(getExistingSledCount:()=>number){
        this.getExistingSledCount = getExistingSledCount;

        this.allItems = Object.keys(this.resourceJsons).map((key) => {
            return this.createItem(key);
        }).concat(
            Object.keys(this.sledDogJsons).map((key) => {
                return this.createItem(key);
            }
        )).concat(
            Object.keys(this.sledJsons).map((key) => {
                return this.createItem(key);
            }
        )).concat(
            Object.keys(this.equipmentJsons).map((key) => {
                return this.createItem(key);
            }
        ));
    }
    
    createItem(key: string): IItem{
        //If the key is a key within allResources, create and return a resource.
        if(Object.keys(this.resourceJsons).some((resourceKey) => {
            return key == resourceKey;
        })){
            return new Resource(
                this.resourceJsons[key].key,
                this.resourceJsons[key].name,
                new RecipeSeed(this.resourceJsons[key].recipe),
                this.resourceJsons[key].unlockFlags
            );
        }
        //Continue checking if it's in subsequent lists
        else if(Object.keys(this.sledJsons).some((sledKey) => {
            return key == sledKey;
        })){
            return new Sled(
                this.sledJsons[key].key,
                this.sledJsons[key].name,
                new RecipeSeed(this.sledJsons[key].recipe),
                this.sledJsons[key].unlockFlags,
                new RecipeSeed(this.sledJsons[key].passiveRecipe),
                this.sledJsons[key].workers,
                this.sledJsons[key].canCraftList.map((itemJson) => {
                    return new ItemSeed(itemJson);
                }),
                this,
                this.getExistingSledCount
            );
        }
        else if(Object.keys(this.sledDogJsons).some((sledDogKey) => {
            return key == sledDogKey;
        })){
            return new SledDog(
                this.sledDogJsons[key].key,
                this.sledDogJsons[key].name,
                new RecipeSeed(this.sledDogJsons[key].recipe),
                this.sledDogJsons[key].unlockFlags
            );
        }
        else if(Object.keys(this.equipmentJsons).some((equipmentKey) => {
            return key == equipmentKey;
        })){
            return new Equipment(
                this.equipmentJsons[key].key,
                this.equipmentJsons[key].name,
                new RecipeSeed(this.equipmentJsons[key].recipe),
                this.equipmentJsons[key].unlockFlags,
                this.equipmentJsons[key].actionKey,
                this.equipmentJsons[key].actionUses,
                this.equipmentJsons[key].statsMods
            );
        }
        //if it's not, return a dummy Resource
        else{
            return new Resource("Invalid Resource", "Invalid Resource", new RecipeSeed({costs:[],results:[]}), []);
        }
    }

    getAllItems():IItem[]{
        return this.allItems;
    }
}

interface ITradeManager{
    getTradeRecipe(recipe:Recipe):Recipe;
}

function useTradeManagerProgressionBased():ITradeManager{
    const progressionContext:ProgressionContextType = useContext(ProgressionContext);
    const itemFactoryContext = useContext(ItemFactoryContext);

    function getTradeRecipe(recipe: Recipe): Recipe {
        //TODO: Affect the costs and results of the recipe based on progression flags
        const multiplier = 2;

        const newRecipeCosts:ItemQuantity[] = recipe.getCosts().map((cost) => {
            return new ItemQuantity(cost.getBaseItem(), cost.getQuantity() * multiplier);
        });

        return new Recipe(newRecipeCosts, recipe.getResults());
    }

    return {getTradeRecipe};
}

export {EquipmentSeed, EquipmentQuantity, Equipment, SledDogQuantity, SledDog, SledDogSeed, RecipeFail, Resource, Sled, UniqueItemQuantitiesList, ItemQuantity, ResourceQuantity, SledQuantity, Recipe, ItemFactoryJSON, useTradeManagerProgressionBased, ItemSeed, ResourceSeed, SledSeed, RecipeSeed, ItemQuantitySeed}
export type {EquipmentJson, IRecipeFail, ItemJson, ResourceJson, SledJson, RecipeJson, ItemQuantityJson, IItem, IItemFactory, ITradeManager}