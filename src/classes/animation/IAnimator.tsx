import AnimationDetails from "./AnimationDetails";

interface IAnimator {
    animate: (animationDetails: AnimationDetails[]) => Promise<void>;
}

export default IAnimator;