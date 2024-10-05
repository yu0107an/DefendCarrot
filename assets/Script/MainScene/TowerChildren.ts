import { _decorator, Component, Node } from 'cc';
import { Tower } from './Tower';
const { ccclass, property } = _decorator;

@ccclass('TowerChildren')
export class TowerChildren extends Component {
    start() {

    }

    shot()
    {
        this.node.parent.getComponent(Tower).shot();
    }
}


