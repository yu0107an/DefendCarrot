import { _decorator, Component, instantiate, JsonAsset, Node, NodePool, Prefab, v3 } from 'cc';
import { Enemy } from './Enemy';
import { AStar, struct } from './AStar';
import { Map } from './Map';
const { ccclass, property } = _decorator;

@ccclass('EnemyLayer')
export class EnemyLayer extends Component {

    enemyPool: NodePool;
    @property(Map)
    mapTs: Map;
    @property(JsonAsset)
    monsterDt: JsonAsset;
    @property([Prefab])
    enemyPrefab: Prefab[] = new Array<Prefab>();
    curWave: number = 1;
    monsterId: any;
    waveDt: any;
    path: Array<struct>;

    onLoad() {
        this.enemyPool = new NodePool('Enemy');
    }

    start() {
        
    }

    init(monsterId: any, waveDt: any)
    {
        let start: struct = { x: 1, y: 6 };
        let end: struct = { x: 10, y: 6 };
        this.path = AStar.FindPath_4Dir(start, end, this.mapTs.map, 1);
        
        this.enemyPrefab.forEach((value,index) => {
            for (let i = 0; i < 8; i++)
            {
                let newNode = instantiate(value);
                newNode.name = value.name;
                newNode.getComponent(Enemy).init(this.monsterDt.json[index]);
                this.enemyPool.put(newNode);
            }
        })
        this.monsterId = monsterId;
        this.waveDt = waveDt;
        this.scheduleOnce(this.createEnemy, 3.0);
    }

    createEnemy()
    {
        let enemyCount = this.waveDt[this.curWave - 1];
        this.schedule(this.createEnemyTimer, 1, 0, 0);
    }

    createEnemyTimer()
    {
        let newEnemy: Node;
        if (this.enemyPool.size() !== 0)
        {
            newEnemy = this.enemyPool.get(this.path);
        }
        else
        {

        }
        this.node.addChild(newEnemy);
        newEnemy.setPosition(v3(-360, 120));
    }

    update(deltaTime: number) {
        
    }
}


