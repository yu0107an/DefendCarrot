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

    reuse(data: Node)
    {
        if (data[0])
        {
            this.followTarget = data[0];
        }

        let animation = this.node.getComponent(Animation);
        if (animation && data[1])
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
    
    update(deltaTime: number)
    {
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

    recycleSelfByTime(time: number)
    {
        this.unschedule(this.recycleSelf);
        this.scheduleOnce(this.recycleSelf, time);
    }

    recycleSelf()
    {
        let nodePool = this.node.parent.getComponent(EffectLayer).effectPools.get(this.node.name);
        nodePool.put(this.node);
    }

}