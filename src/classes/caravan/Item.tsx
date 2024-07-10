import { useContext } from "react";
import { ItemFactoryContext, ProgressionContext, ProgressionContextType, ProgressionFlags } from "../../App";
import resourceData from "../../data/caravan/resources.json";
import sledData from  "../../data/caravan/sleds.json";
import sledDogData from "../../data/caravan/sled-dogs.json";
import IdGenerator from "../utility/IdGenerator";

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
    static pickOutResourceQuantities(list:UniqueItemQuantitiesList|ItemQuantity[], factory:IItemFactory): ResourceQuantity[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Resource;
            });
    
            return filteredList.map((quantity) => {
                return new ResourceQuantity(quantity.getBaseItem() as Resource, quantity.getQuantity(), factory)
            });
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Resource;
            });
    
            return filteredList.map((quantity) => {
                return new ResourceQuantity(quantity.getBaseItem() as Resource, quantity.getQuantity(), factory)
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
                howManyDogs = 6;
                break;
            case 8:
            case 9:
            case 10:
                howManyDogs = 12;
                break;
            case 11:
                howManyDogs = 24;
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
        //Get the new costs list, which is just this Item with quantity 1
        const costs:ItemQuantity[] = [new ItemQuantity(this, 1, itemFactory)];

        //Get the new results list, which is the regular recipe costs with halved quantities
        const results:ItemQuantity[] = this.recipe.convertToRecipe(this.factory).getCosts().map((cost) => {
            return new ItemQuantity(cost.getBaseItem(), Math.floor(cost.getQuantity() / 2), itemFactory);
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
          const newCost = cost.deepClone(itemFactory);
          newCost.modifyQuantity(newCost.getQuantity() * this.workers);
          return newCost;
        });
    
        const adjustedResults = recipe.getResults().map((result) => {
          const newResult = result.deepClone(itemFactory);
          newResult.modifyQuantity(newResult.getQuantity() * this.workers);
          return newResult;
        });
    
        return new Recipe(adjustedCosts, adjustedResults);
      }

    static pickOutSleds(list:UniqueItemQuantitiesList|IItem[]): Sled[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Sled;
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
    static pickOutSledQuantities(list:UniqueItemQuantitiesList|ItemQuantity[], factory:IItemFactory): SledQuantity[]{
        if(list instanceof UniqueItemQuantitiesList){
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Sled;
            });

            const result:SledQuantity[] = [];
            filteredList.forEach((itemQuantity) => {
                const convertedQuantity:SledQuantity = new SledQuantity(itemQuantity.getBaseItem() as Sled, 0, factory);
                convertedQuantity.setSleds(itemQuantity.getItems() as Sled[]);
                result.push(convertedQuantity);
            });
    
            return result;
        }
        else{
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof Sled;
            });
    
            const result:SledQuantity[] = [];
            filteredList.forEach((itemQuantity) => {
                const convertedQuantity:SledQuantity = new SledQuantity(itemQuantity.getBaseItem() as Sled, 0, factory);
                convertedQuantity.setSleds(itemQuantity.getItems() as Sled[]);
                result.push(convertedQuantity);
            });

            return result;
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

    static pickOutSledDogQuantities(list: UniqueItemQuantitiesList | ItemQuantity[], factory:IItemFactory): SledDogQuantity[] {
        if (list instanceof UniqueItemQuantitiesList) {
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof SledDog;
            });

            return filteredList.map((quantity) => {
                return new SledDogQuantity(quantity.getBaseItem() as SledDog, quantity.getQuantity(), factory);
            });
        } else {
            const filteredList = list.filter((itemQuantity) => {
                return itemQuantity.getBaseItem() instanceof SledDog;
            });

            return filteredList.map((quantity) => {
                return new SledDogQuantity(quantity.getBaseItem() as SledDog, quantity.getQuantity(), factory);
            });
        }
    }
}
class SledDogQuantity{
    private baseSledDog:SledDog;
    private dogs:SledDog[];
    private factory:IItemFactory;
    private quantity:number;

    constructor(
        sledDog:SledDog,
        quantity:number,
        factory:IItemFactory
    ){
        this.baseSledDog = sledDog;
        this.factory = factory;
        this.quantity = quantity;
        this.dogs = [];

        for(let i = 0; i < quantity; i++){
            this.dogs.push(factory.createItem(sledDog.getKey()) as SledDog);
        }
    }

    getSledDog():SledDog{
        return this.baseSledDog;
    }
    getQuantity():number{
        return this.quantity;
    }
    modifyQuantity(mod:number){
        this.quantity += mod;

        if(mod > 0){
            for(let i = this.dogs.length; i < this.quantity; i++){
                this.dogs.push(this.factory.createItem(this.baseSledDog.getKey()) as SledDog);
            }
        }
        else{
            this.dogs = this.dogs.slice(0, Math.max(this.dogs.length + mod, 0));
        }
    }
    removeViaIds(idsToRemove:number[]){
        this.dogs = this.dogs.filter((dog) => {
            return !idsToRemove.includes(dog.getId());
        });

        this.quantity = this.dogs.length;
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
    shallowClone():UniqueItemQuantitiesList{
        return new UniqueItemQuantitiesList(this.list);
    }
    getListCopy():ItemQuantity[]{
        return [...this.list];
    }

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
        return new ItemQuantity(factory.createItem(this.key), this.quantity, factory);
    }
};

class ItemQuantity{
    private baseItem:IItem;
    private items:IItem[];
    private factory:IItemFactory;
    private quantity:number;

    constructor(
        item:IItem,
        quantity:number,
        factory:IItemFactory
    ){
        this.baseItem = item;
        this.factory = factory;
        this.quantity = quantity;
        this.items = [];

        for(let i = 0; i < quantity; i++){
            this.items.push(factory.createItem(item.getKey()));
        }
    }

    //did some refactoring, this method still has the factory arg to maintain the deepClone signature
    deepClone(factory?:IItemFactory):ItemQuantity{
        const result:ItemQuantity = new ItemQuantity(this.factory.createItem(this.baseItem.getKey()), this.quantity, this.factory);

        result.items.forEach((item, index) => {
            item.inheritExistingData(this.items[index]);
        });
        return result;
    }

    getBaseItem():IItem{
        return this.baseItem;
    }
    getQuantity():number{
        return this.quantity;
    }
    modifyQuantity(mod:number){
        this.quantity += mod;

        if(mod > 0){
            for(let i = this.items.length; i < this.quantity; i++){
                this.items.push(this.factory.createItem(this.baseItem.getKey()));
            }
        }
        else{
            this.items = this.items.slice(0, Math.max(this.items.length + mod, 0));
        }
    }

    setQuantity(newQuantity:number){
        this.quantity = newQuantity;

        if(newQuantity > this.items.length){
            for(let i = this.items.length; i < newQuantity; i++){
                this.items.push(this.factory.createItem(this.baseItem.getKey()));
            }
        }
        else{
            this.items = this.items.slice(0, Math.max(newQuantity, 0));
        }
    }

    removeViaIds(idsToRemove:number[]){
        this.items = this.items.filter((item) => {
            return !idsToRemove.includes(item.getId());
        });

        this.quantity = this.items.length;
    }

    getItemById(id:number):IItem|undefined{
        return this.items.find((item) => {
            return item.getId() == id;
        });
    }

    getItems():IItem[]{
        return this.items;
    }
}

class ResourceQuantity{
    private baseResource:Resource;
    private resources:Resource[];
    private factory:IItemFactory;
    private quantity:number;

    constructor(
        resource:Resource,
        quantity:number,
        factory:IItemFactory
    ){
        this.baseResource = resource;
        this.factory = factory;
        this.quantity = quantity;
        this.resources = [];

        for(let i = 0; i < quantity; i++){
            this.resources.push(factory.createItem(resource.getKey()) as Resource);
        }
    }

    getResource():Resource{
        return this.baseResource;
    }
    getQuantity():number{
        return this.quantity;
    }
    modifyQuantity(newQuantity:number){
        this.quantity += newQuantity;

        if(newQuantity > 0){
            for(let i = this.resources.length; i < this.quantity; i++){
                this.resources.push(this.factory.createItem(this.baseResource.getKey()) as Resource);
            }
        }
        else{
            this.resources = this.resources.slice(0, Math.max(this.resources.length + newQuantity, 0));
        }
    }
    removeViaIds(idsToRemove:number[]){
        this.resources = this.resources.filter((resource) => {
            return !idsToRemove.includes(resource.getId());
        });

        this.quantity = this.resources.length;
    }
}

class SledQuantity{
    private baseSled:Sled;
    private sleds:Sled[];
    private quantity:number;
    private factory:IItemFactory;

    constructor(
        sled:Sled,
        quantity:number,
        factory:IItemFactory
    ){
        this.baseSled = sled;
        this.factory = factory;
        this.quantity = quantity;
        this.sleds = [];

        for(let i = 0; i < quantity; i++){
            this.sleds.push(sled);
        }
    }

    setSleds(sleds:Sled[]){
        this.sleds = sleds;
        this.quantity = sleds.length;
    }

    getBaseSled():Sled{
        return this.baseSled;
    }
    getQuantity():number{
        return this.quantity;
    }

    getSledById(id:number):Sled|undefined{
        return this.sleds.find((sled) => {
            return sled.getId() == id;
        });
    }

    getList():Sled[]{
        return this.sleds;
    }

    modifyQuantity(mod:number){
        this.quantity += mod;

        if(mod > 0){
            for(let i = this.sleds.length; i < this.quantity; i++){
                this.sleds.push(this.factory.createItem(this.baseSled.getKey()) as Sled);
            }
        }
        else{
            this.sleds = this.sleds.slice(0, Math.max(this.sleds.length + mod, 0));
        }
    }

    removeViaIds(idsToRemove:number[]){
        this.sleds = this.sleds.filter((sled) => {
            return !idsToRemove.includes(sled.getId());
        });

        this.quantity = this.sleds.length;
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
                return new ItemQuantity(factory.createItem(cost.key), cost.quantity, factory);
            }),
            this.results.map((result) => {
                return new ItemQuantity(factory.createItem(result.key), result.quantity, factory);
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
    const itemFactoryContext = useContext(ItemFactoryContext);

    function getTradeRecipe(recipe: Recipe): Recipe {
        //TODO: Affect the costs and results of the recipe based on progression flags
        const multiplier = 2;

        const newRecipeCosts:ItemQuantity[] = recipe.getCosts().map((cost) => {
            return new ItemQuantity(cost.getBaseItem(), cost.getQuantity() * multiplier, itemFactoryContext);
        });

        return new Recipe(newRecipeCosts, recipe.getResults());
    }

    return {getTradeRecipe};
}

export {SledDogQuantity, SledDog, SledDogSeed, RecipeFail, Resource, Sled, UniqueItemQuantitiesList, ItemQuantity, ResourceQuantity, SledQuantity, Recipe, ItemFactoryJSON, useTradeManagerProgressionBased, ItemSeed, ResourceSeed, SledSeed, RecipeSeed, ItemQuantitySeed}
export type {IRecipeFail, ItemJson, ResourceJson, SledJson, RecipeJson, ItemQuantityJson, IItem, IItemFactory, ITradeManager}