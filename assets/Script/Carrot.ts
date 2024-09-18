import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Carrot')
export class Carrot extends Component {

    curHp: number = 10;
    start() {
        this.node.on(Node.EventType.TOUCH_START, this.click, this);
    }

    click()
    {
        if (this.curHp === 10)
        {
            let animation = this.getComponent(Animation);
            animation.stop();
            animation.play();
        }
    }

}


