import { ProgressionFlags } from "../../App";
import { IItem, IRecipeFail, Recipe } from "./Item";

class Message{
    private _message: string;
    private _classes: MessageClass[];

    constructor(message: string, messageClasses: MessageClass[]){
        this._message = message;
        this._classes = messageClasses;
    }

    get message(){
        return this._message;
    }

    get messageClasses(){
        return this._classes;
    }
}

enum MessageClass{
    TANYA = 'tanya-dialogue',
}

interface IMessageManager{
    addMessage(message: Message): void;
    getMessages(): Message[];
}

interface IMessageFactory{
    createItemGetMessage(item:IItem): Message;
    createFlagSetMessage(flagName:string): Message;
    // createEventMessage(eventName:string): Message;
    createFailedRecipeMessage(recipeFail:IRecipeFail): Message;
}

interface IMessageHandling{
    getFactory(): IMessageFactory;
    getManager(): IMessageManager;
}

class MessageContext implements IMessageHandling{
    private _factory: IMessageFactory;
    private _manager: IMessageManager;

    constructor(factory: IMessageFactory, manager: IMessageManager){
        this._factory = factory;
        this._manager = manager;
    }

    clone(){
        return new MessageContext(this._factory, this._manager);
    }

    getFactory(){
        return this._factory;
    }

    getManager(){
        return this._manager;
    }
}

class MessageFactoryJson implements IMessageFactory{
    createItemGetMessage(item:IItem): Message{
        return new Message(`You found a ${item.getName()}!`, []);
    }

    createFlagSetMessage(flagName:string): Message{
        return new Message(`You have unlocked a new area!`, []);
    }

    createFailedRecipeMessage(recipeFail:IRecipeFail): Message{
        return new Message(`Not enough ` + recipeFail.getReasons().join(', '), []);
    }
}

class MessageManager implements IMessageManager{
    private _messages: Message[] = [];
    private _messageLimit: number = 20;

    constructor(messageLimit: number){
        this._messageLimit = messageLimit;
    }

    addMessage(message: Message){
        this._messages.unshift(message);
        if(this._messages.length > this._messageLimit){
            this._messages.pop();
        }
    }

    getMessages(){
        return this._messages;
    }
}

export {Message, MessageClass, MessageContext, MessageFactoryJson, MessageManager}
export type {IMessageHandling, IMessageFactory, IMessageManager}