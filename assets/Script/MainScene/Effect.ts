import { _decorator, Component, Node, Animation, tween, v3 } from 'cc';
import { EffectLayer } from './EffectLayer';
const { ccclass, property } = _decorator;

@ccclass('Effect')
export class Effect extends Component {

    followTarget: Node;
    
    unuse()
    {
        this.followTarget = null;
        let animation = this.node.getComponent(Animation);
        if (animation)
        {
            animation.off(Animation.EventType.LASTFRAME, this.recycleSelf, this);
        }
        
    }

    reuse(followTarget: Node)
    {
        if (followTarget[0])
        {
            this.followTarget = followTarget[0];
        }

        let animation = this.node.getComponent(Animation);
        if (animation)
        {
            animation.on(Animation.EventType.LASTFRAME, this.recycleSelf, this);
        }

        if (this.node.name.search(/money/gi) !== -1)
        {
            tween(this.node)
                .by(0.5, { position: v3(0, 20, 0) })
                .call(this.recycleSelf.bind(this))
                .start();
        }
    }
    
    recycleSelf()
    {
        let nodePool = this.node.parent.getComponent(EffectLayer).effectPools.get(this.node.name);
        nodePool.put(this.node);
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
                this.recycleSelf();    
            }
        }
    }

}


