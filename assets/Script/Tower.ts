import { _decorator, Component, find, Node, v2, Animation, v3 } from 'cc';
import { BulletLayer } from './BulletLayer';
import { Map } from './Map';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {

    id: number;
    level: number = 1;
    createPrice: number[];
    sellPrice: number[];
    shootSpeed: number[];
    attackRange: number[];
    attackTarget: Node[] = new Array<Node>();
    curAttackTarget: Node;
    curState: string = 'idle';

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
        find('Canvas/Map').getComponent(Map).drawTowerInfo(radius, pos, upgradePrice, sellPrice, this.upgradeOrSell.bind(this));
    }

    changeAttackTarget(isAdd: boolean, target: Node)
    {
        if (isAdd)
        {
            this.attackTarget.push(target);
        }
        else
        {
            this.attackTarget.shift();
            this.changeState('idle');
        }
        this.curAttackTarget = this.attackTarget[0];
    }

    changeState(state: string)
    {
        if (this.curState === state)
        {
            return;
        }
        this.curState = state;
        if (this.curState === 'idle')
        {
            let animation = this.node.children[this.level - 1].getComponent(Animation);
            let state = animation.getState(this.node.children[this.level - 1].name);
            if (state)
            {
                state.time = 0;
                state.sample();
            }
            animation.stop();
        }
        else if(this.curState === 'shot')
        {
            this.node.children[this.level - 1].getComponent(Animation).play();
        }
    }

    shot()
    {
        let x = this.node.position.x + this.node.children[this.level - 1].position.x;
        let y = this.node.position.y + this.node.children[this.level - 1].position.y;
        let pos = v3(x, y);
        let angle = this.node.children[this.level - 1].angle;
        find('Canvas/Game/BulletLayer').getComponent(BulletLayer).addBullet(this.id, this.level, pos, this.curAttackTarget, angle);
    }

    update(deltaTime: number) {
        if (this.curAttackTarget !== undefined)
        {
            let dx = this.attackTarget[0].position.x - this.node.position.x;
            let dy = this.attackTarget[0].position.y - this.node.position.y;
            let dir = v2(dx, dy).normalize();
            let rotation = Math.atan2(dir.y, dir.x) * (180 / Math.PI) - 90;
            this.node.children[this.level - 1].angle = this.lerpAngle(this.node.children[this.level - 1].angle, rotation, 0.15);
            
            if (Math.floor(this.node.children[this.level - 1].angle) + 1 >= Math.floor(rotation) - 1)
            {
                this.changeState('shot');
            }
        }
    }

    // 插值函数，用于计算平滑角度变化
    lerpAngle(curAngle, targetAngle, t)
    {
        let diff = (targetAngle - curAngle + 180) % 360 - 180; // 计算差值
        return curAngle + diff * t;
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END);
    }
}


