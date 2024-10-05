import { _decorator, Component, Event, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Canvas')
export class Canvas extends Component {
    start() {

    }

    replaceScene(event: Event, data: string)
    {
        event.target.parent.active = false;
        this.node.getChildByName(data).active = true;
    }

    update(deltaTime: number) {
        
    }
}


