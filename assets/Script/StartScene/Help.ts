import { _decorator, Component, Node, Event } from 'cc';
import { Audio } from './Audio';
const { ccclass, property } = _decorator;

@ccclass('Help')
export class Help extends Component {

    clickBackButton()
    {
        this.node.parent.children[1].active = true;
        this.node.active = false;
        Audio.Instance.playSelect();
    }
    
    clickToggle(event: Event)
    {
        for (let i = 1; i < 4; i++)
        {
            if (this.node.children[i].active)
            {
                this.node.children[i].active = false;
            }
        }
        let index = Number(event.target.name);
        this.node.children[index].active = true;
    }

}


