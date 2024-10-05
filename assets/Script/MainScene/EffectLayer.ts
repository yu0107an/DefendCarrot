import { _decorator, Node, Component, instantiate, NodePool, Prefab, v3, Vec2, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EffectLayer')
export class EffectLayer extends Component {

    @property([Prefab])
    effects: Prefab[] = new Array<Prefab>();
    effectPools: Map<string, NodePool> = new Map<string, NodePool>();

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

    createEffect(pos: Vec2, name: string, followTarget?: Node)
    {
        let nodePool = this.effectPools.get(name);
        let effect = nodePool.get(followTarget);
        this.node.addChild(effect);
        effect.setPosition(v3(pos.x, pos.y));
    }
}


