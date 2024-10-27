import { _decorator, Component, Node, ProgressBar } from 'cc';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component {

    curHp: number;
    maxHp: number;
    reward: number;
    width: number;
    height: number;

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    init(width: number, height: number, hp: number, reward: number)
    {
        this.width = width;
        this.height = height;
        this.maxHp = hp;
        this.curHp = this.maxHp;
        this.reward = reward;
    }

    click()
    {
        if (this.node === EventManager.Instance.getAttackPoint())
        {
            EventManager.Instance.cancelAttackPoint();
        }
        else
        {
            EventManager.Instance.confirmAttackPoint(this.node);
        }
    }

    reduceHp(atk: number)
    {
        this.curHp -= atk;
        if (this.curHp <= 0)
        {
            EventManager.Instance.createEffect(this.node.position, 'Air', true);
            EventManager.Instance.createEffect(this.node.position, 'Money', true, null, this.reward);
            EventManager.Instance.cancelAttackPoint();
            this.node.destroy();
        }
        let percent = this.curHp / this.maxHp;
        this.node.children[0].active = true;
        this.node.children[0].children[0].getComponent(ProgressBar).progress = percent;
    }

    onDestroy()
    {
        if (this.node.parent.children.length === 0)
        {
            EventManager.Instance.showObstacleClear();
        }
        this.node.off(Node.EventType.TOUCH_END, this.click, this);
    }
}


