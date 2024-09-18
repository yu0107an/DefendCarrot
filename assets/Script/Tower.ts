<<<<<<< HEAD
import { _decorator, Component, find, Node, tween, v2 } from 'cc';
=======
import { _decorator, Component, find, Graphics, Node, v2 } from 'cc';
>>>>>>> 93a3c53beff31a7b46cef040b463400ea51e8c07
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
<<<<<<< HEAD
    attackTarget: Node[] = new Array<Node>();
    curAttackTarget: Node;
    
=======

>>>>>>> 93a3c53beff31a7b46cef040b463400ea51e8c07
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

<<<<<<< HEAD
    changeAttackTarget(isAdd: boolean, target: Node)
    {
        if (isAdd)
        {
            this.attackTarget.push(target);
        }
        else
        {
            this.attackTarget.shift();
        }
        this.curAttackTarget = this.attackTarget[0];
    }

    update(deltaTime: number) {
        if (this.curAttackTarget !== undefined)
        {
            let dx = this.attackTarget[0].position.x - this.node.position.x;
            let dy = this.attackTarget[0].position.y - this.node.position.y;
            let dir = v2(dx, dy).normalize();
            let rotation = Math.atan2(dir.y, dir.x) * (180 / Math.PI) - 90;
            this.node.children[this.level - 1].angle = this.lerpAngle(this.node.children[this.level - 1].angle, rotation, 0.15);
            
        }
    }

    // 插值函数，用于计算平滑角度变化
    lerpAngle(curAngle, targetAngle, t)
    {
        let diff = (targetAngle - curAngle + 180) % 360 - 180; // 计算差值
        return curAngle + diff * t;
=======
    update(deltaTime: number) {
        
>>>>>>> 93a3c53beff31a7b46cef040b463400ea51e8c07
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END);
    }
}


