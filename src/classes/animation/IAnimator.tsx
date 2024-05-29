import AnimationDetails from "./AnimationDetails";

interface IAnimationCleanup {
    cleanupAnimations: (...args: any[]) => Promise<void>;
    args: any[];
}

interface IAnimator {
    animate: (animationDetails: AnimationDetails[]) => Promise<IAnimationCleanup>;
}

export default IAnimator;
export type {IAnimationCleanup};