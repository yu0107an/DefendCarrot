import { _decorator, Component, instantiate, JsonAsset, Node, Prefab, v3, Vec3 } from 'cc';
import { Tower } from './Tower';
import { Game } from './Game';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('TowerLayer')
export class TowerLayer extends Component {

    @property(JsonAsset)
    weaponDt: JsonAsset;
    @property([Prefab])
    TowerPrefab: Prefab[] = new Array<Prefab>();

    start() {

    }

    createTower(id: number, pos: Vec3)
    {
        let tower = instantiate(this.TowerPrefab[id - 1001]);
        let data = this.weaponDt.json[id - 1001];
        tower.name = data.icon.split('.', 1)[0];
        let isPaused = this.node.parent.getComponent(Game).isPaused;
        tower.getComponent(Tower).init(data, isPaused, EventManager.Instance.getAttackPoint());
        this.node.addChild(tower);
        tower.setPosition(v3(pos.x - 480, pos.y - 320));
    }

    confirmAttackPoint(target: Node)
    {
        this.node.children.forEach((tower) => {
            tower.getComponent(Tower).comfirmAttackPoint(target);
        })
    }

    cancelAttackPoint() {
        this.node.children.forEach((tower) => {
            tower.getComponent(Tower).cancelAttackPoint();
        })
    }

}


