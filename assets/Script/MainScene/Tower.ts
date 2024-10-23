import { _decorator, Component, Node, v2, Animation, Vec3, AudioSource } from 'cc';
import { EventManager, IObserverType } from './EventManager';
import { TowerChildren } from './TowerChildren';
import { PriorityQueue } from '../PriorityQueue';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component implements IObserver {
    
    id: number;
    audioId: number;
    level: number = 1;//等级
    createPrice: number[];//创建或升级花费
    sellPrice: number[];//卖塔所得费用
    shootSpeed: number[];//射击速度
    attackRange: number[];//攻击范围
    attackTarget_Enemy: PriorityQueue = new PriorityQueue;//在范围内的敌人集合
    attackTarget_Obstacle: Node[] = new Array<Node>();//在范围内的障碍物集合
    curAttackTarget: Node;//当前攻击目标
    attackPoint: Node;//攻击点(玩家手动点击的攻击目标,优先处理攻击点)
    curState: string = 'idle';//当前状态
    isPause: boolean;//是否暂停
    SpinType:boolean//旋转类型(是否能旋转)
    eventIndex: number = 0;//观察者事件索引

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    init(data: any, isPaused: boolean, target: Node)
    {
        this.id = data.weaponID;
        this.audioId = data.audioId;
        this.createPrice = data.createprice;
        this.sellPrice = data.sellprice;
        this.shootSpeed = data.shootSpeed;
        this.attackRange = data.attackrange;
        this.SpinType = data.SpinType;
        this.node.children[this.level - 1].getComponent(TowerChildren).setActive(true);
        this.isPause = isPaused;
        this.attackPoint = target;
        EventManager.Instance.changeCoin(-this.createPrice[this.level - 1]);
        EventManager.Instance.addObserver(this, IObserverType.GameState);
    }

    //升级或卖塔
    upgradeOrSell(type: string)
    {
        if (type === 'upgrade')
        {
            this.node.children[this.level - 1].getComponent(TowerChildren).setActive(false);
            EventManager.Instance.changeCoin(-this.createPrice[this.level]);
            this.level += 1;
            this.node.children[this.level - 1].getComponent(TowerChildren).setActive(true);
            this.attackTarget_Enemy.clear();
            this.attackTarget_Obstacle.length = 0;
            this.curState = 'idle';
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
        let pos = this.node.position;
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

    //当敌人进入或离开自身范围时调用
    changeAttackNumber(isAdd: boolean, target: Node)
    {
        if (isAdd)
        {
            this.attackTarget_Enemy.push(target);
            //如果标记目标进入范围，则修改自身攻击目标为该标记目标
            if (target === EventManager.Instance.getAttackPoint())
            {
                this.attackPoint = target;
            }
        }
        else
        {
            this.attackTarget_Enemy.splice(this.attackTarget_Enemy.findIndex(target), 1);
            this.changeState('idle');
        }
        this.curAttackTarget = this.attackTarget_Enemy.get(0);
    }

    //将障碍物加进自身范围
    addObstacle(target: Node)
    {
        this.attackTarget_Obstacle.push(target);
    }

    //确认攻击目标
    comfirmAttackPoint(target: Node)
    {
        let index = -1;
        if (target.parent.name === 'EnemyLayer')
        {
            index = this.attackTarget_Enemy.findIndex(target);
        }
        else if (target.parent.name === 'ObstacleLayer')
        {
            index = this.attackTarget_Obstacle.findIndex(value => value === target);
        }

        if (index !== -1)
        {
            this.attackPoint = target;
        }
        else
        {
            this.attackPoint = null;
        }
    }

    //取消攻击目标
    cancelAttackPoint()
    {
        this.attackPoint = null;
        this.changeState('idle');
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
        let target = this.attackPoint;
        if (!this.attackPoint)
        {
            target = this.curAttackTarget;
        }
        EventManager.Instance.createBullet(this.node.name, this.id, this.level, this.node.position, target);
        AudioManager.Instance.playAudioById(this.audioId);
    }

    gameStateChanged(isPaused: boolean)
    {
        this.isPause = isPaused;
        this.changeState('idle');
    }

    update(deltaTime: number) {
        if (this.isPause || (!this.attackPoint && this.attackTarget_Enemy.size() === 0))
        {
            this.changeState('idle');
            return;
        }

        let target = null;
        if (this.attackPoint)
        {
            target = this.attackPoint;
            this.update_attackPoint(target);
        }
        else if(this.curAttackTarget)
        {
            target = this.curAttackTarget;
            this.update_attackTarget(target);
        }
        
    }

    update_attackPoint(target: Node)
    {
        if (target)
        {
            if (!this.SpinType)
            {
                this.changeState('shot');
                return;
            }
            this.spin(target);
        }
        else
        {
            this.attackPoint = null;
        }
    }

    update_attackTarget(target: Node)
    {
        //由于敌人使用了对象池，当前攻击目标的内存不会被销毁，所以不能通过判断目标是否被销毁的方式来决定是否继续攻击
        if (target.parent)
        {
            if (!this.SpinType)
            {
                this.changeState('shot');
                return;
            }
            this.spin(target);
        }
        else
        {
            this.changeAttackNumber(false, target);
        }
    }

    //防御塔旋转
    spin(target: Node)
    {
        let dx = target.position.x - this.node.position.x;
        let dy = target.position.y - this.node.position.y;
        let dir = v2(dx, dy).normalize();

        //计算目标所在角度(Math.atan2方法计算弧度，乘以(180 / Math.PI)转化为角度，-90转换防御塔朝向)
        let rotation = this.normalizeAngle(Math.atan2(dir.y, dir.x) * (180 / Math.PI) - 90);

        let curAngle = this.normalizeAngle(this.node.children[this.level - 1].angle);
        this.node.children[this.level - 1].angle = this.lerpAngle(curAngle, rotation, 0.15);
        if (Math.abs(Math.floor(this.node.children[this.level - 1].angle) - Math.floor(rotation)) <= 4)
        {
            this.changeState('shot');
        }
    }

    // 插值函数，用于计算平滑角度变化
    lerpAngle(curAngle, targetAngle, t)
    {
        let diff = (targetAngle - curAngle + 180) % 360 - 180; // 计算差值
        return curAngle + diff * t;
    }

    //将角度限制在0~360度
    normalizeAngle(angle: number): number
    {
        return (angle + 360) % 360;
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END);
        EventManager.Instance.delObserver(this, IObserverType.GameState);
    }
}