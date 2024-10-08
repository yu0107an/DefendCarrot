import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('CountDown')
export class CountDown extends Component {

    countNumber: Node;
    count: number = 0;
    bar: Node;
    
    start() {
        this.countNumber = this.node.getChildByName('Count');
        this.bar = this.node.getChildByName('Bar');
        this.beginSchedule();
    }

    beginSchedule()
    {
        this.schedule(() => {
            this.countNumber.children[this.count].active = false;
            this.count += 1;
            this.countNumber.children[this.count].active = true;
            if (this.count === 3)
            {
                tween(this.countNumber.children[this.count])
                    .to(0.35, { scale: v3(1.5, 1.5) })
                    .call(() => {
                        this.node.active = false;
                        EventManager.Instance.enableClick();
                        EventManager.Instance.enableUIButton();
                        EventManager.Instance.createEnemy();
                    })
                    .start();
            }
        }, 1, 2, 0);
    }

    update(deltaTime: number) {
        this.bar.angle += Math.PI / 1.5;
    }
}


