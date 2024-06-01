//Trying to animate with CSS is probably more trouble than it's worth,
//but I'm going to try it anyway.
//Rarely, animations that occur in place, such as Bump, are skipped. 

import CombatEntity from "../combat/CombatEntity";
import CombatMapData from "../combat/CombatMapData";
import AnimationDetails from "./AnimationDetails";
import IAnimator, { IAnimationCleanup } from "./IAnimator";

class CSSCombatAnimator implements IAnimator {
    private CLEANUP_DELAY: number = 300;

    getMap: () => CombatMapData;
    refreshMap: () => void;

    constructor(getMap: () => CombatMapData, refreshMap: () => void) {
        this.getMap = getMap;
        this.refreshMap = refreshMap;
    }

    animate(animationDetails:AnimationDetails[]): Promise<IAnimationCleanup> {
        animationDetails.forEach((animationDetail) => {
            const entity:CombatEntity = this.getMap().getEntityById(animationDetail.entityToAnimateId);
            console.log(entity, this.getMap().locations[entity.position.y][entity.position.y].animationList);
            this.getMap().applyAnimationToEntity(animationDetail.entityToAnimateId, animationDetail);
        });
        
        this.refreshMap();
        const longestAnimation: number = Math.max(...animationDetails.map((animationDetail) => animationDetail.animationLength));
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const args: any[] = [
                    this.getMap,
                    this.refreshMap
                ];
                resolve({cleanupAnimations: this.cleanupAnimations, args: args});
            }, longestAnimation);
        });
    }

    cleanupAnimations(getMap: () => CombatMapData, refreshMap: () => void): Promise<void> {
        getMap().locations.forEach((row) => {
            row.forEach((location) => {
                location.animationList = [];
            });
        });
        refreshMap();

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, this.CLEANUP_DELAY);
        });
    }
}

export default CSSCombatAnimator;