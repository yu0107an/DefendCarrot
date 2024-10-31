import { _decorator, Node, Component, instantiate, NodePool, Prefab, Sprite, SpriteAtlas, Vec3 } from 'cc';
import { Effect } from './Effect';
const { ccclass, property } = _decorator;

@ccclass('EffectLayer')
export class EffectLayer extends Component {

    @property([Prefab])
    effects: Prefab[] = new Array<Prefab>();
    effectPools: Map<string, NodePool> = new Map<string, NodePool>();
    @property(SpriteAtlas)
    atlas: SpriteAtlas;
        
    start()
    {
        for (let i = 0; i < this.effects.length; i++)
        {
            this.effectPools.set(this.effects[i].name, new NodePool('Effect'));
            let nodePool = this.effectPools.get(this.effects[i].name);
            for (let j = 0; j < 30; j++)
            {
                let effect = instantiate(this.effects[i]);
                nodePool.put(effect);
            }
        }
    }

    //effect用name区分，分别是Air、Appear、Money以及各种子弹击中的效果(对应的name是防御塔的类型名字)
    createEffect(pos: Vec3, name: string, autoDisappear: boolean, followTarget?: Node, coinNumber?: number)
    {
        let nodePool;
        if (name === 'Money')
        {
            nodePool = this.effectPools.get(name + coinNumber.toString());
            if (!nodePool)
            {
                name += coinNumber.toString();
                this.effectPools.set(name, new NodePool('Effect'));
                nodePool = this.effectPools.get(name);
                let spriteFrameName = 'money';
                if (coinNumber < 10)
                {
                    spriteFrameName += '0';
                }
                spriteFrameName += coinNumber.toString();
                for (let j = 0; j < 30; j++)
                {
                    let effect = new Node(name);
                    effect.addComponent(Sprite).spriteFrame = this.atlas.getSpriteFrame(spriteFrameName);
                    effect.addComponent(Effect);
                    nodePool.put(effect);
                }
            }
        }
        else
        {
            nodePool = this.effectPools.get(name);
        }
        let effect = nodePool.get(followTarget, autoDisappear);
        this.node.addChild(effect);
        effect.setPosition(pos);
    }

    //修改跟随型effect的消失时间，为0则直接消失
    setEffect(target: Node, shoterName: string, destroyTime: number)
    {
        let effect = this.node.children.find((value) => {
            let followTarget = value.getComponent(Effect).followTarget;
            return followTarget && followTarget === target;
        });

        if (effect)
        {
            effect.getComponent(Effect).recycleSelfByTime(destroyTime);
        }
        else if (destroyTime != 0)
        {
            let nodePool = this.effectPools.get(shoterName.split('T', 2)[1]);
            effect = nodePool.get(target, false);
            this.node.addChild(effect);
            effect.setPosition(target.position);
            effect.getComponent(Effect).recycleSelfByTime(destroyTime);
        }
    }

    isExistEffect(target: Node, name: string): boolean
    {
        if (this.node.children.find(value => value.getComponent(Effect).followTarget === target && value.name === name))
        {
            return true;
        }
        return false;
    }
}


