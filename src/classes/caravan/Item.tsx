import { useContext } from "react";
import { ItemFactoryContext, ProgressionContext, ProgressionContextType, ProgressionFlags } from "../../App";
import resourceData from "../../data/caravan/resources.json";
import sledData from  "../../data/caravan/sleds.json";
import sledDogData from "../../data/caravan/sled-dogs.json";

type ItemJson = {
    key: string;
};

//These seed classes are important because createItem() in ItemFactoryJSON
//is recursive, and there need to be "deadend" classes that won't lead
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
    isUnlocked: (flags:ProgressionFlags) => boolean;
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

    constructor(key:string, name:string, recipe:RecipeSeed, unlockFlags:string[]){
        this.key = key;
        this.name= name;
        this.recipe = recipe;
        this.unlockFlags = unlockFlags;
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

    clone(){
        return new Resource(this.key, this.name, this.recipe, this.unlockFlags);
    }

    static pickOutResources(list:IItem[]): Resource[]{
        return list.filter((item) => {
            return item instanceof Resource;
        }) as Resource[];
    }
    static pickOutResourceQuantities(list:UniqueItemQuantitiesList|ItemQuantity[]): ResourceQuantity[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getItem() instanceof Resource;
            });
    
            return filteredList.map((quantity) => {
                return new ResourceQuantity(quantity.getItem() as Resource, quantity.getQuantity())
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getItem() instanceof Resource;
            });
    
            return filteredList.map((quantity) => {
                return new ResourceQuantity(quantity.getItem() as Resource, quantity.getQuantity())
            });
        }
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
        getExistingSledCount:()=>number
    ){
        this.key = key;
        this.name= name;
        this.recipe = recipe;
        this.unlockFlags = unlockFlags;

        this.passiveRecipe = passiveRecipe;
        this.workers = workers;
        this.canCraftList = canCraftList;

        this.factory = factory;

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
                howManyDogs = 6;
                break;
            case 8:
            case 9:
            case 10:
                howManyDogs = 11;
                break;
            case 11:
                howManyDogs = 18;
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

    getSellRecipe():Recipe{
        //Get the new costs list, which is just this Item with quantity 1
        const costs:ItemQuantity[] = [new ItemQuantity(this, 1)];

        //Get the new results list, which is the regular recipe costs with halved quantities
        const results:ItemQuantity[] = this.recipe.convertToRecipe(this.factory).getCosts().map((cost) => {
            return new ItemQuantity(cost.getItem(), Math.floor(cost.getQuantity() / 2));
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

    static pickOutSleds(list:UniqueItemQuantitiesList|IItem[]): Sled[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getItem() instanceof Sled;
            });
    
            return filteredList.map((quantity) => {
                return quantity.getItem() as Sled;
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity instanceof Sled;
            });
    
            return filteredList as Sled[];
        }
    }
    static pickOutSledQuantities(list:UniqueItemQuantitiesList|ItemQuantity[]): SledQuantity[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getItem() instanceof Sled;
            });
    
            return filteredList.map((quantity) => {
                return new SledQuantity(quantity.getItem() as Sled, quantity.getQuantity())
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getItem() instanceof Sled;
            });
    
            return filteredList.map((quantity) => {
                return new SledQuantity(quantity.getItem() as Sled, quantity.getQuantity())
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
    private key:string;
    private name:string;
    private recipe:RecipeSeed;
    private unlockFlags:string[];

    constructor(
        key:string, 
        name:string, 
        recipe:RecipeSeed, 
        unlockFlags:string[]
    ){
        this.key = key;
        this.name= name;
        this.recipe = recipe;
        this.unlockFlags = unlockFlags;
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

    static pickOutSledDogs(list:UniqueItemQuantitiesList|IItem[]): SledDog[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getItem() instanceof SledDog;
            });
    
            return filteredList.map((quantity) => {
                return quantity.getItem() as SledDog;
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity instanceof SledDog;
            });
    
            return filteredList as SledDog[];
        }
    }

    static pickOutSledDogQuantities(list:UniqueItemQuantitiesList|ItemQuantity[]): SledDogQuantity[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getItem() instanceof SledDog;
            });
    
            return filteredList.map((quantity) => {
                return new SledDogQuantity(quantity.getItem() as SledDog, quantity.getQuantity())
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getItem() instanceof SledDog;
            });
    
            return filteredList.map((quantity) => {
                return new SledDogQuantity(quantity.getItem() as SledDog, quantity.getQuantity())
            });
        }
    }
}
class SledDogQuantity{
    private sledDog:SledDog;
    private quantity:number;

    constructor(
        sledDog:SledDog,
        quantity:number
    ){
        this.sledDog = sledDog;
        this.quantity = quantity;
    }

    getSledDog():SledDog{
        return this.sledDog;
    }
    getQuantity():number{
        return this.quantity;
    }
}


class UniqueItemQuantitiesList{
    private list:ItemQuantity[];

    constructor(list:ItemQuantity[]){
        this.list = list;
    }

    deepClone(factory:IItemFactory):UniqueItemQuantitiesList{
        return new UniqueItemQuantitiesList(
            this.list.map((itemQuantity) => {
                return itemQuantity.deepClone(factory);
            })
        );
    }
    getListCopy():ItemQuantity[]{
        return [...this.list];
    }

    modify(newItemQuantity:ItemQuantity){
        let existingIndex:number = -1;
        this.list.forEach((currentItemQuantity, index) => {
            if(currentItemQuantity.getItem().getKey() == newItemQuantity.getItem().getKey()){
                existingIndex = index;
                return;
            }
        })

        //If the item associated with the new quantity already exists in the list, increment the existing quantity
        if(existingIndex != -1){
            this.list[existingIndex].setQuantity(
                this.list[existingIndex].getQuantity() + newItemQuantity.getQuantity()
            );
        }
        //else, add the new quantity to the list
        else{
            this.list.push(newItemQuantity);
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
    private item:IItem;
    private quantity:number;

    constructor(
        item:IItem,
        quantity:number
    ){
        this.item = item;
        this.quantity = quantity;
    }

    deepClone(factory:IItemFactory):ItemQuantity{
        return new ItemQuantity(factory.createItem(this.item.getKey()), this.quantity);
    }

    getItem():IItem{
        return this.item;
    }
    getQuantity():number{
        return this.quantity;
    }
    setQuantity(newQuantity:number){
        this.quantity = newQuantity;
    }
}

class ResourceQuantity{
    private resource:Resource;
    private quantity:number;

    constructor(
        resource:Resource,
        quantity:number
    ){
        this.resource = resource;
        this.quantity = quantity;
    }

    getResource():Resource{
        return this.resource;
    }
    getQuantity():number{
        return this.quantity;
    }
    setQuantity(newQuantity:number){
        this.quantity = newQuantity;
    }
}

class SledQuantity{
    private sled:Sled;
    private quantity:number;

    constructor(
        sled:Sled,
        quantity:number
    ){
        this.sled = sled;
        this.quantity = quantity;
    }

    getSled():Sled{
        return this.sled;
    }
    getQuantity():number{
        return this.quantity;
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

    stringifyCosts():string{
        return this.costs.map((cost) => {
            return cost.getItem().getName() + ": " + cost.getQuantity();
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

    function getTradeRecipe(recipe: Recipe): Recipe {
        //TODO: Affect the costs and results of the recipe based on progression flags
        const multiplier = 2;

        const newRecipeCosts:ItemQuantity[] = recipe.getCosts().map((cost) => {
            return new ItemQuantity(cost.getItem(), cost.getQuantity() * multiplier);
        });

        return new Recipe(newRecipeCosts, recipe.getResults());
    }

    return {getTradeRecipe};
}

export {SledDogQuantity, SledDog, SledDogSeed, RecipeFail, Resource, Sled, UniqueItemQuantitiesList, ItemQuantity, ResourceQuantity, SledQuantity, Recipe, ItemFactoryJSON, useTradeManagerProgressionBased, ItemSeed, ResourceSeed, SledSeed, RecipeSeed, ItemQuantitySeed}
export type {IRecipeFail, ItemJson, ResourceJson, SledJson, RecipeJson, ItemQuantityJson, IItem, IItemFactory, ITradeManager}