import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { Tower } from './Tower';
const { ccclass, property } = _decorator;

@ccclass('TowerChildren')
export class TowerChildren extends Component {

    setActive(active: boolean)
    {
        this.node.active = active;
        let collider = this.getComponent(Collider2D);
        if (active)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        else
        {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    shot()
    {
        this.node.parent.getComponent(Tower).shot();
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        switch (other.group)
        {
            case 4:
                this.node.parent.getComponent(Tower).changeAttackNumber(true, other.node);
                break;
            case 32:
                this.node.parent.getComponent(Tower).addObstacle(other.node);
                break;
            default:
                break;
        }
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact)
    {
        switch (other.group)
        {
            case 4:
                this.node.parent.getComponent(Tower).changeAttackNumber(false, other.node);
                break;
            default:
                break;
        }
    }
}


