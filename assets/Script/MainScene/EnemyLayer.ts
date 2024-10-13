import { _decorator, Component, instantiate, JsonAsset, Node, NodePool, Prefab, v2, v3 } from 'cc';
import { Enemy } from './Enemy';
import { struct } from './AStar';
import { EventManager, IObserverType } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyLayer')
export class EnemyLayer extends Component implements IObserver {

    enemyPools: Map<string, NodePool> = new Map<string, NodePool>();
    @property(JsonAsset)
    monsterDt: JsonAsset;
    @property([Prefab])
    enemyPrefab: Prefab[] = new Array<Prefab>();
    curWave: number = 0;
    monsterId: any;
    waveDt: any;
    path: Array<struct>;
    enemyCount: number = 0;
    eventIndex: number = 0;
    curWaveFinish: boolean = true;

    start() {
        
    }

    init(monsterId: any, waveDt: any, path: struct[])
    {
        this.path = path;
        this.enemyPrefab.forEach((prefab, index) => {
            let enemyPool = new NodePool('Enemy');
            for (let i = 0; i < 8; i++)
            {
                let newNode = instantiate(prefab);
                newNode.name = prefab.name;
                newNode.getComponent(Enemy).init(this.monsterDt.json[index]);
                enemyPool.put(newNode);
            }
            this.enemyPools.set(prefab.name, enemyPool);
        })
        this.monsterId = monsterId;
        this.waveDt = waveDt;
        EventManager.Instance.addObserver(this, IObserverType.GameState);
    }

    //创建一波敌人
    createEnemy()
    {
        if (!this.curWaveFinish)
        {
            return;
        }
        this.curWave += 1;
        this.curWaveFinish = false;
        let totalEnemies = this.waveDt[this.curWave - 1];
        this.enemyCount = 0;
        this.schedule(this.createEnemyTimer, 0.8, totalEnemies - this.enemyCount - 1, 2);
    }

    createEnemyTimer()
    {
        let availablePools = Array.from(this.enemyPools.values()).filter(pool => pool.size() > 0);
        let newEnemy;
        if (availablePools.length > 0)
        {
            let enemyPool = availablePools[Math.floor(Math.random() * availablePools.length)];
            newEnemy = enemyPool.get(this.path);
        }
        else
        {
            let monsterId = this.monsterId[Math.floor(Math.random() * this.monsterId.length)];
            newEnemy = instantiate(this.enemyPrefab[monsterId]);
        }
        this.node.addChild(newEnemy);
        EventManager.Instance.createEffect(v3(-360, 120), 'Appear', newEnemy);
        this.enemyCount += 1;
        //当前波次出怪完成
        if (this.enemyCount === this.waveDt[this.curWave - 1])
        {
            this.curWaveFinish = true;
        }
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
        if (!this.curWaveFinish)
        {
            this.unschedule(this.createEnemyTimer);
        }
    }

    resumeCreateEnemy()
    {
        if (!this.curWaveFinish)
        {
            let totalEnemies = this.waveDt[this.curWave - 1];
            this.schedule(this.createEnemyTimer, 0.8, totalEnemies - this.enemyCount - 1, 0);
        }
    }
}
