import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { EventManager } from './EventManager';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('BulletChild')
export class BulletChildren extends Component {
    
    setActive(active: boolean)
    {
        this.node.active = active;
        let collider = this.node.getComponent(Collider2D);
        if (active)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        else
        {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        switch (other.group)
        {
            case 4:
                EventManager.Instance.reduceHp_Enemy(other.node, this.node.parent.getComponent(Bullet).atk);
                break;
            case 32:
                EventManager.Instance.reduceHp_Obstacle(other.node, this.node.parent.getComponent(Bullet).atk);
                break;
            default:
                break;
        }
        this.node.parent.getComponent(Bullet).recycleSelf();
    }

    protected onDestroy(): void {
        this.node.getComponent(Collider2D).off(Contact2DType.BEGIN_CONTACT);
    }
}


