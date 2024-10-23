import { _decorator, Component, Event, Node } from 'cc';
import { GameInfo } from '../GameInfo';
import { Audio } from './Audio';
const { ccclass, property } = _decorator;

@ccclass('OPtion')
export class Option extends Component {

    bgmButton: Node;
    seButton: Node;

    start()
    {
        this.bgmButton = this.node.getChildByPath('setting_bg/BgmButton');
        this.seButton = this.node.getChildByPath('setting_bg/SeButton');
    }

    clickBackButton()
    {
        this.node.parent.children[1].active = true;
        this.node.active = false;
        Audio.Instance.playSelect();
    }

    clickBgmButton()
    {
        this.bgmButton.children.forEach((button) => {
            button.active = !button.active;
        })
        GameInfo.bgm = !GameInfo.bgm;
        Audio.Instance.setVolume('Bgm');
    }

    clickSeButton()
    {
        this.seButton.children.forEach((button) => {
            button.active = !button.active;
        })
        GameInfo.se = !GameInfo.se;
        Audio.Instance.setVolume('Se');
    }

    clickToggle(event: Event)
    {
        for (let i = 0; i < 3; i++)
        {
            if (this.node.children[i].active)
            {
                this.node.children[i].active = false;
            }
        }
        let index = Number(event.target.name);
        this.node.children[index - 1].active = true;
    }

}


