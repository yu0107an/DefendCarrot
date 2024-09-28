import { _decorator, Component, find, Node, v2, Animation, v3 } from 'cc';
import { BulletLayer } from './BulletLayer';
import { EventManager, IObserverType } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component implements IObserver {

    id: number;
    level: number = 1;
    createPrice: number[];
    sellPrice: number[];
    shootSpeed: number[];
    attackRange: number[];
    attackTarget: Node[] = new Array<Node>();
    curAttackTarget: Node;
    attackPoint: Node;
    curState: string = 'idle';
    isPause: boolean;
    eventIndex: number = 0;

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    init(data: any, isPaused: boolean)
    {
        this.id = data.weaponID;
        this.createPrice = data.createprice;
        this.sellPrice = data.sellprice;
        this.shootSpeed = data.shootSpeed;
        this.attackRange = data.attackrange;
        this.node.children[this.level - 1].active = true;
        this.isPause = isPaused;
        EventManager.Instance.changeCoin(-this.createPrice[this.level - 1]);
        EventManager.Instance.addObserver(this, IObserverType.GameState);
    }

    upgradeOrSell(type: string)
    {
        if (type === 'upgrade')
        {
            this.node.children[this.level - 1].active = false;
            EventManager.Instance.changeCoin(-this.createPrice[this.level]);
            this.level += 1;
            this.node.children[this.level - 1].active = true;

        }
        else if (type === 'sell')
        {
            EventManager.Instance.changeCoin(this.sellPrice[this.level - 1]);
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
        EventManager.Instance.drawTowerRangeAndInfo(radius, pos, upgradePrice, sellPrice, this.upgradeOrSell.bind(this));
    }

    changeAttackNumber(isAdd: boolean, target?: Node)
    {
        if (isAdd)
        {
            this.attackTarget.push(target);
            if (target === EventManager.Instance.getAttackPoint())
            {
                this.attackPoint = target;
                this.curAttackTarget = target;
            }
        }
        else
        {
            if (this.attackTarget[0] === EventManager.Instance.getAttackPoint())
            {
                this.attackPoint = null;
            }
            this.attackTarget.shift();
            this.changeState('idle');
        }

        if (!this.attackPoint)
        {
            this.curAttackTarget = this.attackTarget[0];
        }
    }

    changeAttackPoint(target: Node)
    {
        let index = this.attackTarget.findIndex(value => value === target)
        if (index !== -1)
        {
            this.attackPoint = target;
            this.curAttackTarget = this.attackPoint;
        }
        else
        {
            this.attackPoint = null;
        }
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

    gameStateChanged(isPaused: boolean)
    {
        this.isPause = isPaused;
        this.changeState('idle');
    }

    update(deltaTime: number) {
        if (this.isPause || this.attackTarget.length === 0)
        {
            return;
        }

        if (this.curAttackTarget.parent)
        {
            let dx = this.curAttackTarget.position.x - this.node.position.x;
            let dy = this.curAttackTarget.position.y - this.node.position.y;
            let dir = v2(dx, dy).normalize();
            let rotation = Math.atan2(dir.y, dir.x) * (180 / Math.PI) - 90;
            this.node.children[this.level - 1].angle = this.lerpAngle(this.node.children[this.level - 1].angle, rotation, 0.15);
            
            if (Math.floor(this.node.children[this.level - 1].angle) + 1 >= Math.floor(rotation) - 1)
            {
                this.changeState('shot');
            }
        }
        else
        {
            if (this.attackPoint)
            {
                this.attackPoint = null;
            }
            else
            {
                this.changeAttackNumber(false);
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
        EventManager.Instance.delObserver(this, IObserverType.GameState);
    }
}


