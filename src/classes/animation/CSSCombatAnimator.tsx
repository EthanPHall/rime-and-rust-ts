import CombatMapData from "../combat/CombatMapData";
import AnimationDetails from "./AnimationDetails";
import IAnimator, { IAnimationCleanup } from "./IAnimator";

class CSSCombatAnimator implements IAnimator {
    getMap: () => CombatMapData;
    refreshMap: () => void;

    constructor(getMap: () => CombatMapData, refreshMap: () => void) {
        this.getMap = getMap;
        this.refreshMap = refreshMap;
    }

    animate(animationDetails:AnimationDetails[]): Promise<IAnimationCleanup> {
        animationDetails.forEach((animationDetail) => {
            this.getMap().applyAnimationToEntity(animationDetail.entityToAnimateId, animationDetail.getFullname());
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

    cleanupAnimations(getMap: () => CombatMapData, refreshMap: () => void): void {
        getMap().locations.forEach((row) => {
            row.forEach((location) => {
                location.animationList = [];
            });
        });
        refreshMap();
    }
}

export default CSSCombatAnimator;