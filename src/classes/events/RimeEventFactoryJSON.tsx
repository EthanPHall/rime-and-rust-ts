import IRimeEvent from "./IRimeEvent";
import IRimeEventFactory from "./IRimeEventFactory";
import RimeEventJSON from "./RimeEventJSON";

class RimeEventFactoryJSON implements IRimeEventFactory{
    createEventById(id: string): RimeEventJSON {
        throw new Error("Method not implemented.");
    }
}

export default RimeEventFactoryJSON;