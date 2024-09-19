import { _decorator, Component, instantiate, JsonAsset, Node, Prefab, v3, Vec2 } from 'cc';
import { Tower } from './Tower';
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
        tower.getComponent(Tower).init(data);
        this.node.addChild(tower);
        tower.setPosition(v3(pos.x - 480, pos.y - 320));
    }

}


