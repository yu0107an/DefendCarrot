import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartNode')
export class StartNode extends Component {

    start() {
        let arrow = this.node.getChildByName('Arrow');
        arrow.angle = this.node.angle - 90;
        this.scheduleOnce(() => {
            arrow.getComponent(Animation).stop();
            arrow.active = false;
        }, 5);
    }

}