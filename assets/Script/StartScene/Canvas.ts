import { _decorator, Component, Event, Node } from 'cc';
import { Audio } from './Audio';
const { ccclass, property } = _decorator;

@ccclass('Canvas')
export class Canvas extends Component {
    
    loading: Node;
    setting: Node;
    help: Node;

    start()
    {
        this.loading = this.node.getChildByName('Loading');
        this.setting = this.node.getChildByName('Option');
        this.help = this.node.getChildByName('Help');
    }

    replaceScene(event: Event, data: string)
    {
        event.target.parent.active = false;
        this.node.getChildByName(data).active = true;
        Audio.Instance.playSelect();
    }

    showSetting(event: Event)
    {
        event.target.parent.active = false;
        this.setting.active = true;
        Audio.Instance.playSelect();
    }

    showHelp(event: Event)
    {
        event.target.parent.active = false;
        this.help.active = true;
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


