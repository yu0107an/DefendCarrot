import { _decorator, Component, Event, Node } from 'cc';
import { Audio } from './Audio';
const { ccclass, property } = _decorator;

@ccclass('Canvas')
export class Canvas extends Component {
    
    loading: Node;

    start()
    {
        this.loading = this.node.getChildByName('Loading');
    }

    replaceScene(event: Event, data: string)
    {
        event.target.parent.active = false;
        this.node.getChildByName(data).active = true;
        Audio.Instance.playSelect();
    }

    showLoading()
    {
        this.loading.active = true;
        this.scheduleOnce(() => {
            this.loading.active = false;
        }, 0.5);
    }

}


