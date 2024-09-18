import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, tween, Vec3 } from 'cc';
import { Tower } from './Tower';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    id: number;
    maxHp: number;
    curHp: number;
    moveSpeed: number = 0;
    reward: number;
    curPath: number = 1;

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
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        if (other.group === 2)
        {
            other.node.parent.getComponent(Tower).changeAttackTarget(true, self.node);
        }
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        if (other.group === 2)
        {
            other.node.parent.getComponent(Tower).changeAttackTarget(false, self.node);
        }
    }

    onMove(path: any)
    {
        let time = 80 / this.moveSpeed;
        tween(this.node)
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

    destroySelf()
    {
        
    }
}


