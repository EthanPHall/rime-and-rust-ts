import CombatMapData from "../combat/CombatMapData";
import AnimationDetails from "./AnimationDetails";
import IAnimator from "./IAnimator";

class CSSCombatAnimator implements IAnimator {
    getMap: () => CombatMapData;
    refreshMap: () => void;

    constructor(getMap: () => CombatMapData, refreshMap: () => void) {
        this.getMap = getMap;
        this.refreshMap = refreshMap;
    }

    animate(animationDetails:AnimationDetails[]): Promise<void> {
        animationDetails.forEach((animationDetail) => {
            this.getMap().applyAnimationToEntity(animationDetail.entityToAnimateId, animationDetail.getFullname());
        });
        this.refreshMap();

        const longestAnimation: number = Math.max(...animationDetails.map((animationDetail) => animationDetail.animationLength));
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // this.removeAnimations();
                resolve();
            }, longestAnimation);
        });
    }

    removeAnimations(): void {
        this.getMap().locations.forEach((row) => {
            row.forEach((location) => {
                location.animationList = [];
            });
        });
        this.refreshMap();
    }
}

export default CSSCombatAnimator;