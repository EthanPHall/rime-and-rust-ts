import { CombatMapTemplate } from "../../components/combat/CombatParent/CombatParent";

interface ICombatMapTemplateFactory{
    createMap(mapKey:string):CombatMapTemplate;
}

export default ICombatMapTemplateFactory;