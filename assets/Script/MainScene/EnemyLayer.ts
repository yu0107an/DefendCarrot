import { _decorator, Component, instantiate, JsonAsset, Node, NodePool, Prefab, v2 } from 'cc';
import { Enemy } from './Enemy';
import { struct } from './AStar';
import { EventManager, IObserverType } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyLayer')
export class EnemyLayer extends Component implements IObserver {

    enemyPool: NodePool;
    @property(JsonAsset)
    monsterDt: JsonAsset;
    @property([Prefab])
    enemyPrefab: Prefab[] = new Array<Prefab>();
    curWave: number = 1;
    monsterId: any;
    waveDt: any;
    path: Array<struct>;
    enemyCount: number = 0;
    eventIndex: number = 0;

    start() {
        
    }

    init(monsterId: any, waveDt: any)
    {
        this.enemyPool = new NodePool('Enemy');
        let start: struct = { x: 1, y: 6 };
        let end: struct = { x: 10, y: 6 };
        this.path = EventManager.Instance.findPath_AStar(start, end, 1);
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
        this.createEnemy();
    }

    createEnemy()
    {
        let totalEnemies = this.waveDt[this.curWave - 1];
        this.enemyCount = 0;
        EventManager.Instance.addObserver(this, IObserverType.GameState);
        this.schedule(this.createEnemyTimer, 0.8, totalEnemies - this.enemyCount - 1, 3.0);
    }

    createEnemyTimer()
    {
        let newEnemy = this.enemyPool.get(this.path, v2(-360, 120));
        if (newEnemy === null)
        {
            let monsterId = this.monsterId[Math.floor(Math.random() * this.monsterId.length)];
            newEnemy = instantiate(this.enemyPrefab[monsterId]);
        }
        this.node.addChild(newEnemy);
        EventManager.Instance.createEffect(v2(-360, 120), 'Appear', newEnemy);
        this.enemyCount += 1;
    }

    gameStateChanged(isPaused: boolean)
    {
        if (isPaused)
        {
            this.pauseCreateEnemy();
        }
        else
        {
            this.resumeCreateEnemy();    
        }
    }

    pauseCreateEnemy()
    {
        this.unschedule(this.createEnemyTimer);
    }

    resumeCreateEnemy()
    {
        let totalEnemies = this.waveDt[this.curWave - 1];
        this.schedule(this.createEnemyTimer, 0.8, totalEnemies - this.enemyCount - 1, 0);
    }
}
