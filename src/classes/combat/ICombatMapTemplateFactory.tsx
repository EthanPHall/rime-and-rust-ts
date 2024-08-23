import { CombatMapTemplate } from "../../components/combat/CombatParent/CombatParent";
import { RNGFunction } from "../../context/misc/SettingsContext";

interface ICombatMapTemplateFactory{
    createMap(mapKey:string, rng:RNGFunction):CombatMapTemplate;
}

export default ICombatMapTemplateFactory;