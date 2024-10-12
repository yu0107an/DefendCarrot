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
        
    start() {
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
    createEffect(pos: Vec3, name: string, followTarget?: Node, coinNumber?: number)
    {
        let nodePool = this.effectPools.get(name);
        if (!nodePool)
        {
            this.effectPools.set(name, new NodePool('Effect'));
            nodePool = this.effectPools.get(name);
            if (name === 'Money')
            {
                name = 'money';
                if (coinNumber < 10)
                {
                    name += '0';
                }
                name += coinNumber.toString();
                for (let j = 0; j < 30; j++)
                {
                    let effect = new Node('Money');
                    effect.addComponent(Sprite).spriteFrame = this.atlas.getSpriteFrame(name);
                    effect.addComponent(Effect);
                    nodePool.put(effect);
                }
            }
            else
            {
                for (let j = 0; j < 30; j++)
                {
                    let effect = new Node(name);
                    effect.addComponent(Effect);
                    nodePool.put(effect);
                }
            }
        }
        let effect = nodePool.get(followTarget);
        this.node.addChild(effect);
        effect.setPosition(pos);
    }
}


