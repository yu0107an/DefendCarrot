import { _decorator, Component, Node, v2, v3, Vec2, view } from 'cc';
import { BulletLayer } from './BulletLayer';
import { EventManager, IObserverType } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component implements IObserver {

    target: Node;
    atk: number;
    curLevel: number = 1;
    id: number;
    nAck: number;
    bRotate: number;
    speedBuff: number;
    direction: Vec2;
    isLoseTarget: boolean = false;
    isPaused: boolean;
    eventIndex: number = 0;

    start() {

    }

    unuse()
    {
        this.node.children[this.curLevel - 1].active = false;
        EventManager.Instance.delObserver(this, IObserverType.GameState);
    }

    reuse(data: any)
    {
        this.curLevel = data[0];
        this.target = data[1];
        this.atk = Math.floor(this.nAck / Math.abs(this.curLevel - 4)) + 1;
        this.node.children[this.curLevel - 1].active = true;
        this.isLoseTarget = false;
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

    update(deltaTime: number) {
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
            }
            else
            {
                this.isLoseTarget = true;    
            }
        }
        let x = this.node.position.x + this.direction.x * 400 * deltaTime;
        let y = this.node.position.y + this.direction.y * 400 * deltaTime;
        let screenWidth = view.getVisibleSize().width;
        let screenHeight = view.getVisibleSize().height;
        if (x < - screenWidth / 2 - 30 || x > screenWidth / 2 + 30 || y < - screenHeight / 2 - 30 || y > screenHeight / 2 + 30)
        {
            let bulletPool = this.node.parent.getComponent(BulletLayer).bulletPools.get(this.id);
            bulletPool.put(this.node);
            return;
        }
        this.node.setPosition(v3(x, y));
    }
}


