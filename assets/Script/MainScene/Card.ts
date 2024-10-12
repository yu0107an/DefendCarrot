import { _decorator, Component, Node, resources, Sprite, SpriteAtlas, SpriteFrame, v3} from 'cc';
import { ChoiceCard } from './ChoiceCard';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {

    imgs: SpriteFrame[] = new Array<SpriteFrame>(2);
    id: number;

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
    }

    click(event)
    {
        let pos = this.node.parent.getComponent(ChoiceCard).curPos;
        let x = Math.floor(pos.x / 80);
        let y = Math.floor(pos.y / 80);
        EventManager.Instance.createTower(this.id, pos);
        EventManager.Instance.disableSelect();
        event.propagationStopped = true;
        EventManager.Instance.createEffect(v3(pos.x - 480, pos.y - 320), 'Air');
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END);
    }

}


