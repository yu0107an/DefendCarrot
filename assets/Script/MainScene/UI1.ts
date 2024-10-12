import { _decorator, Color, Component, Graphics, SpriteAtlas, Node, tween, Vec2, Sprite, UIOpacity, v3, Prefab, Vec3, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI1')
export class UI1 extends Component {

    @property(SpriteAtlas)
    atlas: SpriteAtlas;
    @property(Prefab)
    selectPrefab: Prefab;
    selectNode: Node;
    drawTool: Graphics;

    start() {
        this.drawTool = this.node.getComponent(Graphics);
    }

    drawTowerRange(radius: number, pos: Vec3)
    {
        this.drawTool.fillColor = new Color(86, 142, 226, 123);
        this.drawTool.clear();
        this.drawTool.circle(pos.x, pos.y, radius);
        this.drawTool.fill();
    }

    clearTowerRange()
    {
        this.drawTool.getComponent(Graphics).clear();
    }

    showSelectNode(pos: Vec3)
    {
        let x = Math.floor(pos.x / 80) * 80 + 40;
        let y = Math.floor(pos.y / 80) * 80 + 40;
        if (this.selectNode)
        {
            this.selectNode.active = true;
        }
        else
        {
            let selectNode = instantiate(this.selectPrefab);
            selectNode.name = 'Select';
            this.node.addChild(selectNode);
            this.selectNode = selectNode;
        }
        this.selectNode.setPosition(v3(x - 480, y - 320));
    }

    createForbiddenNode(pos: Vec3)
    {
        let forbiddenPic = this.atlas.getSpriteFrame('forbidden');
        let forbidden = new Node('Forbidden');
        forbidden.addComponent(Sprite).spriteFrame = forbiddenPic;
        forbidden.addComponent(UIOpacity);
        this.node.addChild(forbidden);
        forbidden.setPosition(v3(pos.x - 480, pos.y - 320));
        tween(forbidden.getComponent(UIOpacity))
            .to(0.7, { opacity: 0 })
            .call(() => { forbidden.destroy() })
            .start();
    }

}


