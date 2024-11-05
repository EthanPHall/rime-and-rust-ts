interface IRimeEventAction{
    execute():void;
    getName():string;
    getRequisiteItems():string[];
}

export default IRimeEventAction;