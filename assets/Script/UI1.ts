import { _decorator, Color, Component, Graphics, SpriteAtlas, Node, tween, Vec2, Sprite, UIOpacity, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI1')
export class UI1 extends Component {

    @property(SpriteAtlas)
    atlas: SpriteAtlas;
    drawTool: Graphics;

    start() {
        this.drawTool = this.node.getComponent(Graphics);
    }

    drawTowerRange(radius: number, pos: Vec2)
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

    createForbiddenNode(pos: Vec2)
    {
        let forbiddenPic = this.atlas.getSpriteFrame('forbidden');
        let forbidden = new Node('Forbidden');
        forbidden.addComponent(Sprite).spriteFrame = forbiddenPic;
        forbidden.addComponent(UIOpacity);
        this.node.addChild(forbidden);
        forbidden.setPosition(v3(pos.x - 480, pos.y - 320));
        tween(forbidden.getComponent(UIOpacity))
            .to(1, { opacity: 0 })
            .call(() => { forbidden.destroy() })
            .start();
    }

}


