import { _decorator, Collider2D, Component, Node, Contact2DType, IPhysics2DContact, ProgressBar, tween, v2, v3, Vec3 } from 'cc';
import { Tower } from './Tower';
import { Bullet } from './Bullet';
import { EnemyLayer } from './EnemyLayer';
import { struct } from './AStar';
import { EventManager, IObserverType } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component implements IObserver {

    id: number;
    maxHp: number;
    curHp: number;
    moveSpeed: number;
    reward: number;
    curPath: number;
    hpBar: ProgressBar;
    curMove: any;//当前的tween缓动
    path: Array<struct>;
    eventIndex: number = 0;

    start() {

    }

    reuse(data: any)
    {
        let collider = this.getComponent(Collider2D);
        if (collider)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        this.curHp = this.maxHp;
        this.hpBar.progress = 1;
        this.curPath = 1;
        this.node.children[0].active = false;
        this.node.setPosition(v3(data[1].x, data[1].y));
        this.path = data[0];
        this.onMove();
        EventManager.Instance.addObserver(this, IObserverType.GameState);
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    unuse()
    {
        let collider = this.getComponent(Collider2D);
        if (collider)
        {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        EventManager.Instance.delObserver(this, IObserverType.GameState);
        if (this.node === EventManager.Instance.getAttackPoint())
        {
            EventManager.Instance.cancelAttackPoint();
        }
    }

    init(data: any)
    {
        this.id = data.monsterid;
        this.maxHp = data.hp;
        this.curHp = this.maxHp;
        this.moveSpeed = data.speed;
        this.reward = data.reward;
        this.hpBar = this.node.children[0].children[0].getComponent(ProgressBar);
    }

    click()
    {
        if (this.node === EventManager.Instance.getAttackPoint())
        {
            EventManager.Instance.cancelAttackPoint();
        }
        else
        {
            EventManager.Instance.confirmAttackPoint(this.node);
        }
        
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        if (other.group === 2)
        {
            other.node.parent.getComponent(Tower).changeAttackNumber(true, self.node);
            
        }
        else if (other.group === 8)
        {
            EventManager.Instance.recycleBullet(other.node.parent);
            let bulletAtk = other.node.parent.getComponent(Bullet).atk;
            this.reduceHp(bulletAtk);
        }
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        if (other.group === 2)
        {
            other.node.parent.getComponent(Tower).changeAttackNumber(false);
        }
    }

    gameStateChanged(isPaused: boolean)
    {
        if (isPaused)
        {
            this.curMove.stop();
        }
        else
        {
            this.onMove();
        }
    }

    reduceHp(atk: number)
    {
        if (!this.node.children[0].active)
        {
            this.node.children[0].active = true;
        }
        this.curHp -= atk;
        if (this.curHp <= 0)
        {
            EventManager.Instance.createEffect(v2(this.node.position.x, this.node.position.y), 'Air');
            this.curMove.stop();
            let enemyPool = this.node.parent.getComponent(EnemyLayer).enemyPool;
            enemyPool.put(this.node);
        }
        let percent = this.curHp / this.maxHp;
        this.hpBar.progress = percent;
    }

    onMove()
    {
        if (this.curHp <= 0)
        {
            return;
        }
        let targetX = this.path[this.curPath].x * 80 + 40 - 480;
        let targetY = this.path[this.curPath].y * 80 + 40 - 320;
        let distance = Math.abs(targetX - this.node.position.x) + Math.abs(targetY - this.node.position.y);
        let time = distance / this.moveSpeed;
        this.curMove = tween(this.node)
            .to(time, { position: new Vec3(targetX, targetY) })
            .call(() => { 
                this.curPath += 1;
                if (this.curPath !== this.path.length - 1)
                {
                    this.onMove();
                }
            })
            .start();
    }

    update(deltaTime: number) {
        
    }
}
