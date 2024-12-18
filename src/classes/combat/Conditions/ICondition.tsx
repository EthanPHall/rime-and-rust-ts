import CombatEntity from "../CombatEntity";

interface ICondition{
    getTurnsUntilWearsOff(): number;
    
    /**
     * Returns true if the condition should wear off.
     * Performs work to determine if the condition should wear off next turn, so calling this more than once per turn may lead to conditions wearing off faster than intended.
     * To simply get whether or not the condition has worn off, use shouldWearOff.
     */
    evaluateShouldWearOff(affected:CombatEntity): boolean;
    shouldWearOff(affected:CombatEntity): boolean;
    executeCondition(affected:CombatEntity): void;
}

export default ICondition;