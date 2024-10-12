import { _decorator, Component, Node, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AttackPoint')
export class AttackPoint extends Component {

    target: Node;

    update(deltaTime: number) {
        if (this.target)
        {
            if (this.target.parent)
            {
                this.node.setPosition(v3(this.target.position.x, this.target.position.y + 50));
            }
            else
            {
                this.target = null;
            }
        }
        else
        {
            this.target = null;
        }
    }
}
