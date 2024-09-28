import { _decorator, Component, Node, Animation } from 'cc';
import { EffectLayer } from './EffectLayer';
const { ccclass, property } = _decorator;

@ccclass('Effect')
export class Effect extends Component {

    followTarget: Node;
    start() {
    
    }

    unuse()
    {
        this.followTarget = null;
        let animation = this.node.getComponent(Animation);
        animation.off(Animation.EventType.LASTFRAME, this.finished, this);
    }

    reuse(followTarget: Node)
    {
        if (followTarget[0])
        {
            this.followTarget = followTarget[0];
        }
        let animation = this.node.getComponent(Animation);
        animation.on(Animation.EventType.LASTFRAME, this.finished, this);
    }
    
    finished()
    {
        let nodePool = this.node.parent.getComponent(EffectLayer).effectPools.get(this.node.name);
        nodePool.put(this.node);
    }

    gameStateChanged(isPaused: boolean)
    {
        let animation = this.node.getComponent(Animation);
        if (isPaused)
        {
            animation.pause();
        }
        else
        {
            animation.resume(); 
        }
    }

    update(deltaTime: number){
        if (this.followTarget)
        {
            if (this.followTarget.parent)
            {
                this.node.setPosition(this.followTarget.position);
            }
            else
            {
                this.finished();    
            }
        }
    }

}


