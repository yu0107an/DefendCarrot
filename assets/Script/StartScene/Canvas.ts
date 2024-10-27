import { _decorator, Component, Event, Node } from 'cc';
import { Audio } from './Audio';
import { GameInfo } from '../GameInfo';
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

    advMode(event: Event)
    {
        event.target.parent.parent.active = false;
        this.node.getChildByName('SelectMenu').active = true;
        Audio.Instance.playSelect();
    }

    bossMode(event: Event)
    {
        if (GameInfo.bossMode)
        {
            
        }
        else
        {
            let popup_Bg = event.target.parent.parent.getChildByName('Popup_Bg');
            popup_Bg.active = true;
            popup_Bg.children[0].active = true;
        }
        Audio.Instance.playSelect();
    }

    monsterNest(event: Event)
    {
        if (GameInfo.monsterNest)
        {

        }
        else
        {
            let popup_Bg = event.target.parent.parent.getChildByName('Popup_Bg');
            popup_Bg.active = true;
            popup_Bg.children[1].active = true;
        }
        Audio.Instance.playSelect();
    }

    backButton(event: Event)
    {
        let popup_Bg = event.target.parent;
        for (let i = 0; i < 2; i++)
        {
            if (popup_Bg.children[i].active)
            {
                popup_Bg.children[i].active = false;
            }
        }
        popup_Bg.active = false;
        Audio.Instance.playSelect();
    }

    showSetting(event: Event)
    {
        event.target.parent.parent.active = false;
        this.setting.active = true;
        Audio.Instance.playSelect();
    }

    showHelp(event: Event)
    {
        event.target.parent.parent.active = false;
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


