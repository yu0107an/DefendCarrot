import { _decorator, Component, Node, Animation, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartNode')
export class StartNode extends Component {

    init(startPos: Vec3, nextPos: Vec3)
    {
        this.node.setPosition(startPos.x - 480, startPos.y - 320);
        let arrow = this.node.getChildByName('Arrow');
        let dx = Math.floor(nextPos.x - startPos.x);
        let dy = Math.floor(nextPos.y - startPos.y);
        arrow.angle = Math.atan2(dy, dx) * (180 / Math.PI);
        this.scheduleOnce(() => {
            arrow.getComponent(Animation).stop();
            arrow.active = false;
        }, 5);
    }

}