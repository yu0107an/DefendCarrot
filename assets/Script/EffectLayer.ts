import { _decorator, Animation, Component, instantiate, NodePool, Prefab, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EffectLayer')
export class EffectLayer extends Component {

    @property([Prefab])
    effects: Prefab[] = new Array<Prefab>();
    effectPool: NodePool;

    start() {
        this.effectPool = new NodePool('Effect');
        for (let i = 0; i < 30; i++)
        {
            let effect = instantiate(this.effects[0]);
            this.effectPool.put(effect);
        }
    }

    createEffect(pos: Vec2)
    {
        let effect = this.effectPool.get();
        this.node.addChild(effect);
        effect.setPosition(v3(pos.x, pos.y));
    }
}


