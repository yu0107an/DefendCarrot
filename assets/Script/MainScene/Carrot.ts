import { _decorator, Component, Node, Animation, SpriteFrame, macro, Sprite } from 'cc';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('Carrot')
export class Carrot extends Component {

    @property(SpriteFrame)
    imgs: SpriteFrame[] = new Array<SpriteFrame>();
    @property(SpriteFrame)
    hps: SpriteFrame[] = new Array<SpriteFrame>();
    curHp: number = 10;
    animation: Animation;
    sch: any;

    start() {
        this.animation = this.getComponent(Animation);
        this.sch = this.schedule(() => {
            if (!this.animation.getState('CarrotClick').isPlaying && this.curHp === 10)
            {
                this.animation.play('CarrotIdle');
            }
        }, 5, macro.REPEAT_FOREVER, 7);
    }

    enableClick()
    {
        this.node.on(Node.EventType.TOUCH_START, this.click, this);
    }

    click()
    {
        if (this.curHp === 10)
        {
            this.animation.stop();
            this.animation.play('CarrotClick');
        }
    }

    reduceHp(count: number)
    {
        this.animation.stop();
        this.unschedule(this.sch);
        this.node.off(Node.EventType.TOUCH_START);
        this.curHp -= count;
        if (this.curHp <= 0)
        {
            EventManager.Instance.gameOver();
        }
        this.node.getComponent(Sprite).spriteFrame = this.imgs[this.curHp - 1];
        this.node.getChildByName('Hp').getComponent(Sprite).spriteFrame = this.hps[this.curHp - 1];
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START);
    }

}


