import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, ProgressBar, tween, v3, Vec3 } from 'cc';
import { EnemyLayer } from './EnemyLayer';
import { struct } from './AStar';
import { EventManager, IObserverType } from './EventManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component implements IObserver {

    id: number;
    maxHp: number;
    curHp: number;
    moveSpeed: number;
    curSpeedBuff: number;
    reward: number;
    curPath: number;
    hpBar: ProgressBar;
    curMove: any;//当前的tween缓动
    path: Array<struct>;
    eventIndex: number = 0;

    reuse(data: any)
    {
        this.curHp = this.maxHp;
        this.hpBar.progress = 1;
        this.curPath = 0;
        this.curSpeedBuff = 100;
        this.node.children[0].active = false;
        this.path = data[0];
        this.node.setPosition(v3(this.path[0].x - 480, this.path[0].y - 320));
        this.eventIndex = 0;
        this.onMove();
        EventManager.Instance.addObserver(this, IObserverType.GameState);
        this.node.on(Node.EventType.TOUCH_END, this.click, this);

        let collider = this.node.getComponent(Collider2D);
        if (collider)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    unuse()
    {
        EventManager.Instance.delObserver(this, IObserverType.GameState);
        if (this.node === EventManager.Instance.getAttackPoint())
        {
            EventManager.Instance.cancelAttackPoint();
        }
        let collider = this.node.getComponent(Collider2D);
        if (collider)
        {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        if (other.group === 16)
        {
            EventManager.Instance.reduceHp_Carrot(1);
            this.recycleSelf(false);
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

    //点击敌人,确认攻击目标
    click()
    {
        //取消攻击目标
        if (this.node === EventManager.Instance.getAttackPoint())
        {
            EventManager.Instance.cancelAttackPoint();
        }
        else
        {
            EventManager.Instance.confirmAttackPoint(this.node);
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

    //扣血
    reduceHp(atk: number)
    {
        if (!this.node.children[0].active)
        {
            this.node.children[0].active = true;
        }
        this.curHp -= atk;
        if (this.curHp <= 0)
        {
            EventManager.Instance.createEffect(this.node.position, 'Money', true, null, this.reward);
            EventManager.Instance.changeCoin(this.reward);
            this.curMove.stop();
            this.recycleSelf(true);
            return;
        }
        let percent = this.curHp / this.maxHp;
        this.hpBar.progress = percent;
    }

    //减速
    speedDown(speedBuff: number, shoterName: string)
    {
        this.curSpeedBuff = speedBuff;
        this.curMove.stop();
        this.onMove();
        EventManager.Instance.setEffect(this.node, shoterName, 3);
        this.unschedule(this.speedDownOver.bind(this));
        this.scheduleOnce(this.speedDownOver.bind(this), 3);
    }

    //减速结束
    speedDownOver()
    {
        this.curSpeedBuff = 100;
        this.curMove.stop();
        this.onMove();
    }

    onMove()
    {
        if (this.curHp <= 0)
        {
            return;
        }
        let targetX = this.path[this.curPath + 1].x - 480;
        let targetY = this.path[this.curPath + 1].y - 320;
        let distance = Math.abs(targetX - this.node.position.x) + Math.abs(targetY - this.node.position.y);
        let time = distance / (this.moveSpeed * (this.curSpeedBuff / 100));
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

    recycleSelf(needMusic: boolean)
    {
        if (this.node.parent.children.length === 1)
        {
            this.node.parent.getComponent(EnemyLayer).createEnemy();
        }
        EventManager.Instance.createEffect(this.node.position, 'Air', true);
        let enemyPool = this.node.parent.getComponent(EnemyLayer).enemyPools.get(this.node.name);
        enemyPool.put(this.node);

        if (needMusic)
        {
            let index = Math.floor(Math.random() * 3 + 14);
            AudioManager.Instance.playAudioById(index);
        }
    }

    onDestroy()
    {
        this.node.off(Node.EventType.TOUCH_END);
    }
}
