import { _decorator, Component, find, Node, resources, Sprite, SpriteAtlas, SpriteFrame} from 'cc';
import { TowerLayer } from './TowerLayer';
import { ChoiceCard } from './ChoiceCard';
import { UIControl } from './UIControl';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {

    imgs: SpriteFrame[] = new Array<SpriteFrame>(2);
    data: any;

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
        this.data = data;
    }

    click(event)
    {
        let pos = this.node.parent.getComponent(ChoiceCard).curPos;
        let x = Math.floor(pos.x / 80);
        let y = Math.floor(pos.y / 80);
        this.node.parent.parent.getComponent(UIControl).mapTs.map[x][y] = 4;
        find('Canvas/Game/TowerLayer').getComponent(TowerLayer).createTower(this.data, pos);
        this.node.parent.active = false;
        this.node.parent.parent.getChildByName('Select').active = false;
        event.propagationStopped = true;
    }

    update(deltaTime: number) {
        
    }
}


