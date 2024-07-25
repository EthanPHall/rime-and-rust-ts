import IRimeEvent from "./IRimeEvent";

interface IRimeEventFactory{
    createEventById(id:string):IRimeEvent;
}

export default IRimeEventFactory;