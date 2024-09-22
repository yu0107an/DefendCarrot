import { _decorator, Component, Node, Animation } from 'cc';
import { EffectLayer } from './EffectLayer';
const { ccclass, property } = _decorator;

@ccclass('Effect')
export class Effect extends Component {

    start() {
    
    }

    unuse()
    {
        let animation = this.node.getComponent(Animation);
        if (animation)
        {
            animation.off(Animation.EventType.LASTFRAME, this.finished, this);
        }
    }

    reuse() {
        let animation = this.node.getComponent(Animation);
        if (animation)
        {
            animation.on(Animation.EventType.LASTFRAME, this.finished, this);
        }
    }
    

    finished()
    {
        this.node.parent.getComponent(EffectLayer).effectPool.put(this.node);
    }

}


