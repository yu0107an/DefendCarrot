import { _decorator, Component, Node, Event, Label, SpriteAtlas, Sprite, v3, Prefab, instantiate, Button, Vec3 } from 'cc';
import { EventManager, IObserverType } from './EventManager';
import { ChoiceCard } from './ChoiceCard';
import { AttackPoint } from './AttackPoint';
import { GameInfo } from '../GameInfo';
import { CountDown } from './CountDown';
import { Carrot } from './Carrot';
const { ccclass, property } = _decorator;

@ccclass('UIControl')
export class UIControl extends Component implements IObserver {

    @property(SpriteAtlas)
    atlas: SpriteAtlas;
    
    @property(Prefab)
    attackPointPrefab: Prefab;
    attackPoint: Node;
    choiceCard: Node;
    isMenuOpen: boolean = false;
    eventIndex: number = 0;
    upgradeNode: Node;
    sellNode: Node;
    coin: Node;

    onLoad() {
        EventManager.Instance.addObserver(this, IObserverType.Coin);
        this.coin = this.node.getChildByPath('UP/Coin');
    }

    init(carrotPos: Vec3)
    {
        this.node.getChildByPath('UP/AllWave').getComponent(Label).string = GameInfo.maxWave.toString();
        this.choiceCard = this.node.getChildByName('ChoiceCard');
        this.disableAllButton();

        this.node.getChildByName('CountDown').getComponent(CountDown).init();
        this.node.getChildByName('Carrot').setPosition(carrotPos.x - 480, carrotPos.y - 320);
    }
    
    showLoading()
    {
        this.node.getChildByName('Loading').active = true;
        this.scheduleOnce(() => {
            this.node.getChildByName('Loading').active = false;
        }, 0.8);
    }

    disableAllButton()
    {
        this.node.getComponentsInChildren(Button).forEach((value) => {
            value.interactable = false;
        })
    }

    enableAllButton()
    {
        this.node.getComponentsInChildren(Button).forEach((value) => {
            value.interactable = true;
        })
    }

    showGameOver()
    {
        let gameOverNode = this.node.getChildByName('GameOver');
        gameOverNode.active = true;
        let curWave = this.node.getChildByPath('UP/CurWave').getComponent(Label).string;
        let allWave = this.node.getChildByPath('UP/AllWave').getComponent(Label).string;
        gameOverNode.getChildByName('CurWave').getComponent(Label).string = curWave;
        gameOverNode.getChildByName('AllWave').getComponent(Label).string = allWave;
        gameOverNode.getChildByName('CurLevel').getComponent(Label).string = GameInfo.level.toString();
    }

    changeMenuButton(event: Event)
    {
        let menuNode = this.node.getChildByPath('UP/Menu/MenuPage');
        menuNode.active = !menuNode.active;
        this.isMenuOpen = !this.isMenuOpen;
        let prePauseState = !this.node.getChildByPath('UP/PauseButton').children[0].active;
        if (event.target.name === 'MenuButton')
        {
            EventManager.Instance.pauseGame(this.isMenuOpen);
        }
        else if (event.target.name === 'ResumeButton')
        {
            EventManager.Instance.pauseGame(prePauseState);
        }
    }

    changeWaveLabel(wave: number)
    {
        let str;
        if (wave < 10)
        {
            str = '0' + '  ' + wave.toString();
        }
        else
        {
            str = (wave / 10).toString() + '  ' + (wave % 10).toString();
        }
        this.node.getChildByPath('UP/CurWave').getComponent(Label).string = str;
    }

    pauseGameButton()
    {
        if (this.isMenuOpen)
        {
            return;
        }
        let pauseButton = this.node.getChildByPath('UP/PauseButton');
        pauseButton.children.forEach((value, index) => {
            value.active = !value.active;
            if (index === 0)
            {
                EventManager.Instance.pauseGame(!value.active);
            }
        })
        
    }

    changeSpeed(event, data)
    {
        let string = data.split(',', 2);
        let curSpeed = Number(string[0]);
        let targetSpeed = Number(string[1]);
        let speed = this.node.getChildByPath('UP/Speed');
        speed.children[curSpeed - 1].active = false;
        speed.children[targetSpeed - 1].active = true;
        EventManager.Instance.setGameSpeed(targetSpeed);
    }

    drawTowerInfo(pos: Vec3, upgradePrice: string, sellPrice: string, func: any)
    {
        //升级塔
        if (Number(upgradePrice) > Number(this.coin.getComponent(Label).string))
        {
            upgradePrice = '-' + upgradePrice;
        }
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
            this.node.addChild(this.upgradeNode);
        }
        this.upgradeNode.name = upgradePic.name;
        if (upgradePrice !== '0_CN' && upgradePrice.indexOf('-') === -1)
        {
            this.upgradeNode.on(Node.EventType.TOUCH_END, () => {
                if (upgradePrice.indexOf('-') === -1)
                {
                    EventManager.Instance.clearTowerRangeAndInfo();
                    func('upgrade');
                    EventManager.Instance.createEffect(pos, 'Air');
                }
            });
        }
        this.upgradeNode.setPosition(v3(pos.x, pos.y + 80));
        //卖塔
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
            this.node.addChild(this.sellNode);
        }
        this.sellNode.name = sellPic.name;
        this.sellNode.on(Node.EventType.TOUCH_END, () => {
            EventManager.Instance.clearTowerRangeAndInfo();
            this.clearTowerInfo();
            func('sell');
            EventManager.Instance.createEffect(pos, 'Air');
        })
        this.sellNode.setPosition(v3(pos.x, pos.y - 80));
    }

    clearTowerInfo()
    {
        if (this.upgradeNode && this.sellNode)
        {
            this.upgradeNode.active = false;
            this.upgradeNode.off(Node.EventType.TOUCH_END);
            this.sellNode.active = false;
            this.sellNode.off(Node.EventType.TOUCH_END);
        }
    }

    isClickScreen(): Boolean
    {
        if (this.choiceCard.active)
        {
            return true;
        }
        return false;
    }

    isClickTower(): Boolean
    {
        if (!this.sellNode && !this.upgradeNode)
        {
            return false;
        }
        if (this.sellNode.active && this.upgradeNode.active)
        {
            return true;
        }
        return false;
    }

    createAttackPoint(target: Node)
    {
        if (!this.attackPoint)
        {
            this.attackPoint = instantiate(this.attackPointPrefab);
            this.node.addChild(this.attackPoint);
        }
        this.attackPoint.active = true;
        let attackPointTs = this.attackPoint.getComponent(AttackPoint);
        if (attackPointTs.target === target)
        {
            this.attackPoint.active = false;
            attackPointTs.target = null;
        }
        attackPointTs.target = target;
    }

    cancelAttackPoint()
    {
        if (this.attackPoint)
        {
            this.attackPoint.getComponent(AttackPoint).target = null;
            this.attackPoint.active = false;
        }
    }

    getAttackPoint(): Node
    {
        if (this.attackPoint)
        {
            return this.attackPoint.getComponent(AttackPoint).target;
        }
        return null;
    }

    //显示防御塔卡片
    showChoiceCard(pos: Vec3)
    {
        let x = Math.floor(pos.x / 80) * 80 + 40;
        let y = Math.floor(pos.y / 80) * 80 + 40;
        this.choiceCard.active = true;
        this.choiceCard.getComponent(ChoiceCard).changePos(v3(x, y), Number(this.coin.getComponent(Label).string));
    }

    gameCoinChanged(coinNumber: number)
    {
        this.coin.getComponent(Label).string = coinNumber.toString();
    }

    protected onDestroy(): void {
        if (this.upgradeNode && this.sellNode)
        {
            this.upgradeNode.off(Node.EventType.TOUCH_END);
            this.sellNode.off(Node.EventType.TOUCH_END);
        }
    }
    
}


