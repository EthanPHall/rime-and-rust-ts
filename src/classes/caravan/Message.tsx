import { ProgressionFlags } from "../../App";
import ISaveable from "../utility/ISaveable";
import { IItem, IRecipeFail, Recipe } from "./Item";

class Message implements ISaveable{
    private _message: string;
    private _classes: MessageClass[];

    constructor(message: string, messageClasses: MessageClass[]){
        this._message = message;
        this._classes = messageClasses;
    }
    createSaveObject() {
        return {
            messageData: this._message,
            classesData: this._classes
        }
    }
    loadSaveObject(messageData:any) {
        this._message = messageData.messageData;
        this._classes = messageData.classesData;
    }
    isDataValid(messageData: any): boolean {
        return (
            messageData.messageData != null && messageData.messageData != undefined && 
            messageData.classesData != null && messageData.classesData != undefined
        )
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

interface IMessageManager extends ISaveable{
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
    createSaveObject() {
        return{
            messagesData: this._messages.map((message) => {return message.createSaveObject()}),
            messageLimitData:this._messageLimit
        }
    }
    loadSaveObject(messagesLoadObject:any) {
        this._messages = messagesLoadObject.messagesData.map((data:any) => {
            const newMessage = new Message("", []);
            newMessage.loadSaveObject(data);
            return newMessage;
        });

        this._messageLimit = messagesLoadObject.messageLimitData;
    }
    isDataValid(messagesLoadObject: any): boolean {
        return (
            messagesLoadObject.messagesData != null && messagesLoadObject.messagesData != undefined && Array.isArray(messagesLoadObject.messagesData) &&
            messagesLoadObject.messageLimitData != null && messagesLoadObject.messageLimitData != undefined
        );
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