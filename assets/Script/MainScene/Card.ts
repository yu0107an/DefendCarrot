import { _decorator, Component, Node, resources, Sprite, SpriteAtlas, SpriteFrame, v3} from 'cc';
import { ChoiceCard } from './ChoiceCard';
import { EventManager } from './EventManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {

    imgs: SpriteFrame[] = new Array<SpriteFrame>(2);
    id: number;
    createCoin: number;//建造所需花费
    canClick: Boolean;

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    init(data: any)
    {
        let name: string = data.icon.split('.', 1)[0];
        resources.load('Towers/' + name + '-hd', SpriteAtlas, (err, atlas) => {
            this.imgs[0] = atlas.getSpriteFrame(data.shopimg[0].split('.', 1)[0]);
            this.imgs[1] = atlas.getSpriteFrame(data.shopimg[1].split('.', 1)[0]);
            this.addComponent(Sprite).spriteFrame = this.imgs[1];
        })
        this.id = data.weaponID;
        this.createCoin = data.createprice[0];
    }

    show(coin: number)
    {
        let index;
        if (coin >= this.createCoin)
        {
            index = 1;
            this.canClick = true;
        }
        else
        {
            index = 0;
            this.canClick = false;
        }
        this.getComponent(Sprite).spriteFrame = this.imgs[index];
    }

    click(event)
    {
        if (!this.canClick)
        {
            return;
        }
        let pos = this.node.parent.getComponent(ChoiceCard).curPos;
        let x = Math.floor(pos.x / 80);
        let y = Math.floor(pos.y / 80);
        EventManager.Instance.createTower(this.id, pos);
        EventManager.Instance.disableSelect();
        event.propagationStopped = true;
        EventManager.Instance.createEffect(v3(pos.x - 480, pos.y - 320), 'Air');
        AudioManager.Instance.playAudioById(8);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END);
    }

}


