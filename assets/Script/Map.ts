import { _decorator, Color, Component, find, Graphics, instantiate, Node, Prefab, Sprite, SpriteAtlas, tween, UIOpacity, v2, v3, Vec2 } from 'cc';
import { ChoiceCard } from './ChoiceCard';
import { EffectLayer } from './EffectLayer';
const { ccclass, property } = _decorator;

@ccclass('Map')
export class Map extends Component {

    //0表示不可创建，1表示怪物移动路径，2表示有障碍物，3表示空位，4表示已有塔
    map: number[][] = new Array<Array<number>>(12);
    @property(SpriteAtlas)
    atlas: SpriteAtlas;
    @property(Node)
    choiceCard: Node;
    @property(Node)
    UINode1: Node;
    @property(Node)
    UINode2: Node;
    @property(Prefab)
    selectPrefab: Prefab;
    selectNode: Node;
    upgradeNode: Node;
    sellNode: Node;

    start() {
        let x0 = [0, 1, 2, 9, 10, 11, 0, 1, 10, 11];
        let y0 = [0, 0, 0, 0, 0,  0,  1, 1, 1,  1];
        let x1 = [1, 2, 3, 4, 7, 8, 9, 10, 1, 4, 5, 6, 7, 10, 1, 10, 1, 10];
        let y1 = [2, 2, 2, 2, 2, 2, 2, 2,  3, 3, 3, 3, 3, 3 , 4, 4 , 5, 5];
        for (let i = 0; i < this.map.length; i++)
        {
            this.map[i] = new Array<number>(9).fill(3);
        }
        for (let i = 0; i < x0.length; i++)
        {
            this.map[x0[i]][y0[i]] = 0;
        }
        for (let i = 0; i < x1.length; i++)
        {
            this.map[x1[i]][y1[i]] = 1;
        }
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    init(data: any)
    {
        this.choiceCard.getComponent(ChoiceCard).initAllCard(data);
    }

    drawTowerInfo(radius: number, pos: Vec2, upgradePrice: string, sellPrice: string, func: any)
    {
        this.choiceCard.active = false;
        if (this.selectNode)
        {
            this.selectNode.active = false;
        }

        let drawTool = this.UINode1.getComponent(Graphics);
        drawTool.fillColor = new Color(86, 142, 226, 123);
        drawTool.clear();
        drawTool.circle(pos.x, pos.y, radius);
        drawTool.fill();

        let upgradePic = this.atlas.getSpriteFrame('upgrade_' + upgradePrice);
        if (this.upgradeNode)
        {
            this.upgradeNode.active = true;
            this.upgradeNode.getComponent(Sprite).spriteFrame = upgradePic;
        }
        else
        {
            this.upgradeNode = new Node;
            this.upgradeNode.addComponent(Sprite).spriteFrame = upgradePic;
            this.UINode2.addChild(this.upgradeNode);
        }
        this.upgradeNode.name = upgradePic.name;
        if (upgradePrice !== '0_CN')
        {
            this.upgradeNode.on(Node.EventType.TOUCH_END, (event) => {
                event.propagationStopped = true;
                this.clearTowerInfo();
                func('upgrade');
                find('Canvas/EffectLayer').getComponent(EffectLayer).createEffect(pos);
            });
        }
        this.upgradeNode.setPosition(v3(pos.x, pos.y + radius));

        let sellPic = this.atlas.getSpriteFrame('sell_' + sellPrice);
        if (this.sellNode)
        {
            this.sellNode.active = true;
            this.sellNode.getComponent(Sprite).spriteFrame = sellPic;
        }
        else
        {
            this.sellNode = new Node;
            this.sellNode.addComponent(Sprite).spriteFrame = sellPic;
            this.UINode2.addChild(this.sellNode);
        }
        this.sellNode.name = sellPic.name;
        this.sellNode.on(Node.EventType.TOUCH_END, (event) => {
            event.propagationStopped = true;
            this.clearTowerInfo();
            func('sell');
            this.map[Math.floor((pos.x + 480) / 80)][Math.floor((pos.y + 320) / 80)] = 3;
            find('Canvas/EffectLayer').getComponent(EffectLayer).createEffect(pos);
        })
        this.sellNode.setPosition(v3(pos.x, pos.y - radius));
    }

    clearTowerInfo()
    {
        if (this.upgradeNode && this.sellNode)
        {
            this.upgradeNode.off(Node.EventType.TOUCH_END);
            this.sellNode.off(Node.EventType.TOUCH_END);
        }
        
        this.UINode1.getComponent(Graphics).clear();
        if (this.upgradeNode && this.sellNode)
        {
            this.upgradeNode.active = false;
            this.sellNode.active = false;
        }
    }

    click(event)
    {
        this.clearTowerInfo();
        let pos = event.getUILocation();
        let x = Math.floor(pos.x / 80);
        let y = Math.floor(pos.y / 80);
        
        switch (this.map[x][y])
        {
            case 0 || 1:
                let forbiddenPic = this.atlas.getSpriteFrame('forbidden');
                let forbidden = new Node('Forbidden');
                forbidden.addComponent(Sprite).spriteFrame = forbiddenPic;
                forbidden.addComponent(UIOpacity);
                this.UINode1.addChild(forbidden);
                forbidden.setPosition(v3(pos.x - 480, pos.y - 320));
                tween(forbidden.getComponent(UIOpacity))
                    .to(1, { opacity: 0 })
                    .call(() => { forbidden.destroy() })
                    .start();
                break;
            case 2:

                break;
            case 3:
                if (this.selectNode)
                {
                    if (this.selectNode.position.x === x * 80 + 40 -480 && this.selectNode.position.y === y * 80 + 40 -320)
                    {
                        this.selectNode.active = !this.selectNode.active;
                        this.choiceCard.active = !this.choiceCard.active;
                    }
                    else
                    {
                        this.selectNode.active = true;
                        this.choiceCard.active = true;
                    }
                }
                else
                {
                    let selectNode = instantiate(this.selectPrefab);
                    selectNode.name = 'Select';
                    this.UINode1.addChild(selectNode);
                    this.selectNode = selectNode;
                    this.choiceCard.active = true;
                }

                if (this.selectNode.active && this.choiceCard.active)
                {
                    this.selectNode.setPosition(v3(x * 80 + 40 - 480, y * 80 + 40 - 320));
                    this.choiceCard.getComponent(ChoiceCard).changePos(v2(x * 80 + 40, y * 80 + 40));
                }
                break;
            default:
                break;
        }
    }

}


