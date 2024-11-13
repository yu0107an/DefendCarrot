import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { EventManager } from '../Frame/EventManager';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('BulletChildren')
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
        let bulletTs = this.node.parent.getComponent(Bullet);
        switch (other.group)
        {
            case 4:
                EventManager.Instance.reduceHp_Enemy(other.node, bulletTs.atk);
                if (bulletTs.speedBuff !== 0)
                {
                    EventManager.Instance.speedDown_Enemy(other.node, bulletTs.speedBuff, bulletTs.shoterName);
                }
                break;
            case 32:
                if (bulletTs.target !== other.node && !bulletTs.isPenetrate)
                {
                    return;
                }
                EventManager.Instance.reduceHp_Obstacle(other.node, bulletTs.atk);
                break;
            default:
                break;
        }

        if (!bulletTs.isPenetrate)
        {
            bulletTs.recycleSelf();
        }
        EventManager.Instance.createEffect(other.node.position, bulletTs.shoterName, true);
    }

    protected onDestroy(): void {
        this.node.getComponent(Collider2D).off(Contact2DType.BEGIN_CONTACT);
    }
}


