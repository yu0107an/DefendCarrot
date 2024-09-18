import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    id: number;
    maxHp: number;
    curHp: number;
    moveSpeed: number = 0;
    reward: number;
    curPath: number = 1;

    start() {

    }

    init(data: any)
    {
        this.id = data.monsterid;
        this.maxHp = data.hp;
        this.curHp = this.maxHp;
        this.moveSpeed = data.speed;
        this.reward = data.reward;
    }

    reuse(path: any)
    {
        this.onMove(path);
    }

    unuse()
    {
        
    }

    onMove(path: any)
    {
        let time = 80 / this.moveSpeed;
        tween(this.node)
            .to(time, { position: new Vec3(path[0][this.curPath].x * 80 + 40 - 480, path[0][this.curPath].y * 80 + 40 - 320) })
            .call(() => { 
                this.curPath += 1;
                if (this.curPath !== path[0].length - 1)
                {
                    this.onMove(path);
                }
            })
            .start();
    }

    update(deltaTime: number) {
        
    }
}


