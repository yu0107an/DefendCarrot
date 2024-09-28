import { _decorator, Component, instantiate, JsonAsset, Node, Prefab, v3, Vec2 } from 'cc';
import { Tower } from './Tower';
import { Game } from './Game';
const { ccclass, property } = _decorator;

@ccclass('TowerLayer')
export class TowerLayer extends Component {

    @property(JsonAsset)
    weaponDt: JsonAsset;
    @property([Prefab])
    TowerPrefab: Prefab[] = new Array<Prefab>();

    start() {

    }

    createTower(data: any, pos: Vec2)
    {
        let tower = instantiate(this.TowerPrefab[data.weaponID - 1001]);
        tower.name = data.icon.split('.', 1)[0];
        let isPaused = this.node.parent.getComponent(Game).isPaused;
        tower.getComponent(Tower).init(data, isPaused);
        this.node.addChild(tower);
        tower.setPosition(v3(pos.x - 480, pos.y - 320));
    }

    confirmAttackPoint(target: Node)
    {
        this.node.children.forEach((value) => {
            value.getComponent(Tower).changeAttackPoint(target);
        })
    }

}


