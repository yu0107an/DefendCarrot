import { _decorator, Component, Node, v2, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    target: Node;
    curLevel: number = 1;
    id: number;
    nAck: number;
    bRotate: number;
    speedBuff: number;

    start() {

    }

    unuse()
    {
        this.node.children[this.curLevel - 1].active = false;
    }

    reuse(data: any)
    {
        this.curLevel = data[0];
        this.target = data[1];
        this.node.children[this.curLevel - 1].active = true;
    }

    init(data: any)
    {
        this.id = data.bulletID;
        this.nAck = data.nAck;
        this.bRotate = data.bRotate;
        this.speedBuff = data.speedbuff;
    }

    update(deltaTime: number) {
        if (this.target)
        {
            let dx = this.target.position.x - this.node.position.x;
            let dy = this.target.position.y - this.node.position.y;
            let direction = v2(dx, dy).normalize();
            let x = this.node.position.x + direction.x * 400 * deltaTime;
            let y = this.node.position.y + direction.y * 400 * deltaTime;
            this.node.setPosition(v3(x, y));
        }
        
    }
}


