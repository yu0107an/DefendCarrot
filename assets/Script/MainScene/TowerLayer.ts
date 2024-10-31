import { _decorator, Component, instantiate, JsonAsset, Node, Prefab, v3, Vec3 } from 'cc';
import { Tower } from './Tower';
import { Game } from './Game';
import { EventManager, IObserverType } from '../Frame/EventManager';
const { ccclass, property } = _decorator;

@ccclass('TowerLayer')
export class TowerLayer extends Component implements IObserver {

    @property(JsonAsset)
    weaponDt: JsonAsset;
    @property([Prefab])
    TowerPrefab: Prefab[] = new Array<Prefab>();
    @property(Prefab)
    upgradePrefab: Prefab;
    eventIndex: number = 0;

    onLoad()
    {
        EventManager.Instance.addObserver(this, IObserverType.Coin);
    }

    createTower(id: number, pos: Vec3)
    {
        let tower = instantiate(this.TowerPrefab[id - 1001]);
        let data = this.weaponDt.json[id - 1001];
        tower.name = data.icon.split('.', 1)[0];
        let isPaused = this.node.parent.getComponent(Game).isPaused;
        this.node.addChild(tower);
        tower.setPosition(v3(pos.x - 480, pos.y - 320));
        tower.getComponent(Tower).init(data, isPaused, EventManager.Instance.getAttackPoint());
    }

    confirmAttackPoint(target: Node)
    {
        this.node.children.forEach((tower) => {
            tower.getComponent(Tower).comfirmAttackPoint(target);
        })
    }

    cancelAttackPoint()
    {
        this.node.children.forEach((tower) => {
            tower.getComponent(Tower).cancelAttackPoint();
        })
    }

    gameCoinChanged(coinNumber: number)
    {
        this.node.children.forEach((tower) => {
            if (tower.getComponent(Tower).canUpgrade(coinNumber))
            {
                if (tower.getChildByName('Upgrade') === null)
                {
                    let upgrade = instantiate(this.upgradePrefab);
                    upgrade.name = 'Upgrade';
                    tower.addChild(upgrade);
                    upgrade.setPosition(0, 50);
                }
            }
            else
            {
                let upgrade = tower.getChildByName('Upgrade');
                if (upgrade !== null)
                {
                    upgrade.destroy();
                }
            }
        })
    }

}