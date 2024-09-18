import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Map')
export class Map extends Component {

    //0表示不可创建，1表示怪物移动路径，2表示有障碍物，3表示空位，4表示已有塔
    map: number[][] = new Array<Array<number>>(12);

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
        
    }

    update(deltaTime: number) {
        
    }
}


