import { useEffect } from "react";
import CombatEnemy from "../../classes/combat/CombatEnemy";
import CombatPlayer from "../../classes/combat/CombatPlayer";
import CombatHazard from "../../classes/combat/CombatHazard";
import CombatMapData from "../../classes/combat/CombatMapData";
import CombatEntity from "../../classes/combat/CombatEntity";


function useCombatHazardReactions(player:CombatPlayer, enemies:CombatEnemy[], hazards:CombatHazard[], map:CombatMapData, updateEntity:(id: number, newEntity: CombatEntity) => void){
    useEffect(() => {
        hazards.forEach(hazard => {
            const entityInSameSpace:CombatEntity|null = map.locations[hazard.position.y][hazard.position.x].entity;
            if(entityInSameSpace !== null){
                if(entityInSameSpace instanceof CombatPlayer){
                    const newPlayer:CombatPlayer|null = hazard.handleNewEntityOnThisSpace(entityInSameSpace) as CombatPlayer;
                    if(newPlayer !== null){
                        updateEntity(newPlayer.id, newPlayer);
                    }
                }else if(entityInSameSpace instanceof CombatEnemy){
                    const newEnemy = hazard.handleNewEntityOnThisSpace(entityInSameSpace) as CombatEnemy;
                    if(newEnemy !== null){
                        updateEntity(newEnemy.id, newEnemy);
                    }
                }
            }
        });
    }, [player, enemies]);
}

export default useCombatHazardReactions;