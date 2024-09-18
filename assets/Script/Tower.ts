import { _decorator, Component, find, Graphics, Node, v2 } from 'cc';
import { UIControl } from './UIControl';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {

    id: number;
    level: number = 1;
    createPrice: number[];
    sellPrice: number[];
    shootSpeed: number[];
    attackRange: number[];

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    init(data: any)
    {
        this.id = data.weaponID;
        this.createPrice = data.createprice;
        this.sellPrice = data.sellprice;
        this.shootSpeed = data.shootSpeed;
        this.attackRange = data.attackrange;
        this.node.children[this.level - 1].active = true;
    }

    upgradeOrSell(type: string)
    {
        if (type === 'upgrade')
        {
            this.node.children[this.level - 1].active = false;
            this.level += 1;
            this.node.children[this.level - 1].active = true;
        }
        else if (type === 'sell')
        {
            this.node.destroy();
        }
    }

    click()
    {
        let radius = this.attackRange[this.level - 1];
        let pos = v2(this.node.position.x, this.node.position.y);
        let upgradePrice;
        if (this.level === 3)
        {
            upgradePrice = '0_CN';
        }
        else
        {
            upgradePrice = this.createPrice[this.level].toString();
        }
        let sellPrice = this.sellPrice[this.level - 1].toString();
        find('Canvas/UI').getComponent(UIControl).drawTowerInfo(radius, pos, upgradePrice, sellPrice, this.upgradeOrSell.bind(this));
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END);
    }
}


