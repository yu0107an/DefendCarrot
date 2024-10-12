import { _decorator, Component, instantiate, JsonAsset, Node, NodePool, Prefab, v2, v3 } from 'cc';
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

    init(monsterId: any, waveDt: any, path: struct[])
    {
        this.enemyPool = new NodePool('Enemy');
        this.path = path;
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
    }

    createEnemy()
    {
        let totalEnemies = this.waveDt[this.curWave - 1];
        this.enemyCount = 0;
        EventManager.Instance.addObserver(this, IObserverType.GameState);
        this.schedule(this.createEnemyTimer, 0.8, totalEnemies - this.enemyCount - 1, 2);
    }

    createEnemyTimer()
    {
        let newEnemy = this.enemyPool.get(this.path);
        if (newEnemy === null)
        {
            let monsterId = this.monsterId[Math.floor(Math.random() * this.monsterId.length)];
            newEnemy = instantiate(this.enemyPrefab[monsterId]);
        }
        this.node.addChild(newEnemy);
        EventManager.Instance.createEffect(v3(-360, 120), 'Appear', newEnemy);
        this.enemyCount += 1;
    }

    reduceHp_Enemy(enemy: Node, atk: number)
    {
        enemy.getComponent(Enemy).reduceHp(atk);
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
