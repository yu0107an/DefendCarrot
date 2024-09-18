import { _decorator, Component, find, JsonAsset, Node } from 'cc';
import { UIControl } from './UIControl';
import { EnemyLayer } from './EnemyLayer';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(JsonAsset)
    levelDt: JsonAsset;
    theme: number = 1;
    level: number = 1;

    start() {
        this.initLevel();
    }

    initLevel()
    {
        let weaponDt = this.levelDt.json[this.theme - 1].weapon[this.level - 1];
        find('Canvas/UI').getComponent(UIControl).init(weaponDt);

        let monsterDt = this.levelDt.json[this.theme - 1].monsterid[this.level - 1];
        let waveDt = this.levelDt.json[this.theme - 1].wavemonstercount[this.level - 1];
        this.node.getChildByName('EnemyLayer').getComponent(EnemyLayer).init(monsterDt, waveDt);
    }

    update(deltaTime: number) {
        
    }
}


