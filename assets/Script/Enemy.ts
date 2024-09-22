import { _decorator, Collider2D, Component, Contact2DType, find, IPhysics2DContact, ProgressBar, tween, v2, Vec3 } from 'cc';
import { Tower } from './Tower';
import { BulletLayer } from './BulletLayer';
import { Bullet } from './Bullet';
import { EnemyLayer } from './EnemyLayer';
import { EffectLayer } from './EffectLayer';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    id: number;
    maxHp: number;
    curHp: number;
    moveSpeed: number = 0;
    reward: number;
    curPath: number = 1;
    hpBar: ProgressBar;
    curMove: any;

    start() {

    }

    reuse(path: any)
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
        this.onMove(path);
    }

    unuse()
    {
        let collider = this.getComponent(Collider2D);
        if (collider)
        {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
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

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        if (other.group === 2)
        {
            other.node.parent.getComponent(Tower).changeAttackTarget(true, self.node);
        }
        else if (other.group === 8)
        {
            let bulletTs = other.node.parent.getComponent(Bullet);
            let bulletLayerTs = find('Canvas/Game/BulletLayer').getComponent(BulletLayer);
            let bulletPool = bulletLayerTs.bulletPools.get(bulletTs.id);
            bulletPool.put(other.node.parent);
            this.reduceHp(bulletTs.atk);
        }
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        if (other.group === 2)
        {
            other.node.parent.getComponent(Tower).changeAttackTarget(false, self.node);
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
            find('Canvas/EffectLayer').getComponent(EffectLayer).createEffect(v2(this.node.position.x, this.node.position.y));
            this.curMove.stop();
            let enemyPool = this.node.parent.getComponent(EnemyLayer).enemyPool;
            enemyPool.put(this.node);
        }
        let percent = this.curHp / this.maxHp;
        this.hpBar.progress = percent;
    }

    onMove(path: any)
    {
        if (this.curHp <= 0)
        {
            return;
        }
        let time = 80 / this.moveSpeed;
        this.curMove = tween(this.node)
            .to(time, { position: new Vec3(path[0][this.curPath].x * 80 + 40 - 480, path[0][this.curPath].y * 80 + 40 - 320) })
            .call(() => { 
                this.curPath += 1;
                if (this.curPath !== path[0].length - 1)
                {
                    this.onMove(path);
                }
            })
            .start();
    }

    update(deltaTime: number) {
        
    }
}


