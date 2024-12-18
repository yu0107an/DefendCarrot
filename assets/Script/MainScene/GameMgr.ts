import { _decorator, Component, director, JsonAsset, Node, v3 } from 'cc';
import { GameInfo } from '../Frame/GameInfo';
import { EventManager } from '../Frame/EventManager';
import { StartNode } from './StartNode';
import { Carrot } from './Carrot';
const { ccclass, property } = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component {

    @property(JsonAsset)
    levelDt: JsonAsset;//关卡数据
    gameSpeed: number = 1;//游戏倍速
    isPaused: boolean = false;//是否暂停
    coin: number;//金币数
    gameState_Observers: IObserver[] = new Array<IObserver>();
    gameCoin_Observers: IObserver[] = new Array<IObserver>();
    oldTick = director.tick;

    onLoad()
    {
        EventManager.resetInstance();
    }

    start()
    {
        this.scheduleOnce(() => {
            director.tick = (dt: number) => {
                this.oldTick.call(director, dt * (this.gameSpeed));
            }
        }, 1);
        this.initLevel();
    }

    initLevel()
    {
        this.scheduleOnce(() => {
            this.coin = 0;
            GameInfo.Instance.maxWave = this.levelDt.json[GameInfo.Instance.curTheme - 1].wave[GameInfo.Instance.curLevel - 1];
            let weaponDt = this.levelDt.json[GameInfo.Instance.curTheme - 1].weapon[GameInfo.Instance.curLevel - 1];
            let monsterDt = this.levelDt.json[GameInfo.Instance.curTheme - 1].monsterid[GameInfo.Instance.curLevel - 1];
            let waveDt = this.levelDt.json[GameInfo.Instance.curTheme - 1].wavemonstercount[GameInfo.Instance.curLevel - 1];
            this.gameCoinChanged(this.levelDt.json[GameInfo.Instance.curTheme - 1].initgold[GameInfo.Instance.curLevel - 1]);
            const enemyPath = EventManager.Instance.initLevelData(weaponDt, monsterDt, waveDt);
            this.node.getChildByName('Start').getComponent(StartNode).init(v3(enemyPath[0].x, enemyPath[0].y), v3(enemyPath[1].x, enemyPath[1].y));
            this.node.getChildByName('Carrot').getComponent(Carrot).init(v3(enemyPath[enemyPath.length - 1].x, enemyPath[enemyPath.length - 1].y));
            EventManager.Instance.closeLoading();
        }, 0.5);
    }

    gameStateChanged(isPaused: boolean)
    {
        this.isPaused = isPaused;
        this.gameState_Observers.forEach((value) => {
            value.gameStateChanged(this.isPaused);
        })
    }

    gameCoinChanged(coinNumber: number)
    {
        this.coin += coinNumber;
        this.gameCoin_Observers.forEach((value) => {
            value.gameCoinChanged(this.coin);
        })
    }

    setGameSpeed(speed: number)
    {
        this.gameSpeed = speed;
    }

    reduceHp_Carrot(count: number)
    {
        this.node.getChildByName('Carrot').getComponent(Carrot).reduceHp(count);
    }

    restartGame()
    {
        EventManager.Instance.clearAllObserver();
        director.tick = this.oldTick;
        director.resume();
        director.loadScene('MainScene');
    }

    quitGame()
    {
        EventManager.Instance.clearAllObserver();
        director.tick = this.oldTick;
        director.resume();
        director.loadScene('MenuScene');
    }
    
    nextGame()
    {
        GameInfo.Instance.curLevel += 1;
        EventManager.Instance.clearAllObserver();
        director.tick = this.oldTick;
        director.resume();
        director.loadScene('MainScene');
    }

    onDestroy()
    {
        //切换场景必须重置，不然报错
        // if (this.oldTick) {
        //     director.tick = this.oldTick;
        // }
    }
    
}


