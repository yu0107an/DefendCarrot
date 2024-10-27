import { _decorator, Component, Node, v2, v3, Vec2, view } from 'cc';
import { BulletLayer } from './BulletLayer';
import { EventManager, IObserverType } from './EventManager';
import { BulletChildren } from './BulletChildren';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component implements IObserver {

    target: Node;//目标
    shoterName: string//发射的防御塔name
    atk: number;//攻击力
    curLevel: number = 1;//等级
    id: number;
    nAck: number;
    bRotate: number;
    speedBuff: number;//给敌人的减速buff
    direction: Vec2;//方向
    isLoseTarget: boolean = false;//是否丢失目标
    isPaused: boolean;//是否暂停
    eventIndex: number = 0;//事件索引

    unuse()
    {
        this.node.children[this.curLevel - 1].getComponent(BulletChildren).setActive(false);
        EventManager.Instance.delObserver(this, IObserverType.GameState);
    }

    reuse(data: any)
    {
        this.shoterName = data[0];
        this.curLevel = data[1];
        this.target = data[2];
        this.atk = Math.floor(this.nAck / Math.abs(this.curLevel - 4)) + 1;
        this.node.children[this.curLevel - 1].getComponent(BulletChildren).setActive(true);
        this.isLoseTarget = false;
        this.eventIndex = 0;
        EventManager.Instance.addObserver(this, IObserverType.GameState);
    }

    init(data: any)
    {
        this.id = data.bulletID;
        this.nAck = data.nAck;
        this.bRotate = data.bRotate;
        this.speedBuff = data.speedbuff;
    }

    gameStateChanged(isPaused: boolean)
    {
        this.isPaused = isPaused;
    }

    update(deltaTime: number)
    {
        if (this.isPaused)
        {
            return;
        }
        if (!this.isLoseTarget)
        {
            if (this.target.parent)
            {
                let dx = this.target.position.x - this.node.position.x;
                let dy = this.target.position.y - this.node.position.y;
                this.direction = v2(dx, dy).normalize();

                //旋转子弹
                let rotation = Math.atan2(this.direction.y, this.direction.x) * (180 / Math.PI) - 90;
                this.node.angle = rotation;
            }
            else
            {
                this.isLoseTarget = true;    
            }
        }
        let x = this.node.position.x + this.direction.x * 400 * deltaTime;
        let y = this.node.position.y + this.direction.y * 400 * deltaTime;
        
        if (this.isOutScreen(x, y))
        {
            this.recycleSelf(false);
            return;
        }
        this.node.setPosition(v3(x, y));
    }

    isOutScreen(x: number, y: number): Boolean
    {
        let screenWidth = view.getVisibleSize().width;
        let screenHeight = view.getVisibleSize().height;
        return x < - screenWidth / 2 - 30 || x > screenWidth / 2 + 30 || y < - screenHeight / 2 - 30 || y > screenHeight / 2 + 30;
    }

    recycleSelf(needEffect: boolean)
    {
        if (needEffect)
        {
            EventManager.Instance.createEffect(this.target.position, this.shoterName, true);
        }
        let bulletPool = this.node.parent.getComponent(BulletLayer).bulletPools.get(this.id);
        bulletPool.put(this.node);
    }
}