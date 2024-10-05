import { _decorator, Component, JsonAsset, Node, Size, SpriteAtlas, tween, UITransform, v3, Vec2, Vec3 } from 'cc';
import { Card } from './Card';
const { ccclass, property } = _decorator;

@ccclass('ChoiceCard')
export class ChoiceCard extends Component {

    @property(JsonAsset)
    weaponDt: JsonAsset;
    curPos: Vec2;

    start() {
        
    }

    initAllCard(data: any)
    {
        this.node.getComponent(UITransform).setContentSize(new Size(80 * data.length, 80));
        for (let i = 0; i < data.length; i++)
        {
            let card = new Node;
            card.addComponent(Card).init(this.weaponDt.json[data[i] - 1001]);
            this.node.addChild(card);
        }
        this.node.active = false;
    }

    changePos(pos:Vec2)
    {
        let width = this.node.getComponent(UITransform).width;
        let height = this.node.getComponent(UITransform).height;
        let x = pos.x;
        let y = pos.y;
        if (x - width / 2 < 0)
        {
            x = width / 2;
        }
        else if (x + width / 2 > 960)
        {
            x = 960 - width / 2;
        }
        if (y + height / 2 >= 640)
        {
            y = 640 - height / 2 - 160;
        }
        this.node.setPosition(v3(x - 480, y - 320 + 80));
        this.curPos = pos;
        this.node.children.forEach((value, index) => {
            value.scale = new Vec3(0, 0, 0);
            tween(value)
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .start();
        })
    }

    update(deltaTime: number) {
        
    }
}


