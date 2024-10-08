import { _decorator, Component, director, find, JsonAsset, Node } from 'cc';
import { EnemyLayer } from './EnemyLayer';
import { BulletLayer } from './BulletLayer';
import { Map } from './Map';
import { GameInfo } from '../GameInfo';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(JsonAsset)
    levelDt: JsonAsset;
    gameSpeed: number = 1;
    isPaused: boolean = false;
    coin: number;
    gameState_Observers: IObserver[];
    gameCoin_Observers: IObserver[];
    oldTick = director.tick;

    onLoad()
    {
        this.gameState_Observers = new Array<IObserver>();
        this.gameCoin_Observers = new Array<IObserver>();
    }

    start()
    {
        this.scheduleOnce(() => {
            director.tick = (dt: number) => {
                this.oldTick.call(director, dt * (this.gameSpeed));
            }
        }, 1);
        
        this.initLevel();
        this.coin = 0;
        this.gameCoinChanged(this.levelDt.json[GameInfo.theme - 1].initgold[GameInfo.level - 1]);
    }

    initLevel()
    {
        let weaponDt = this.levelDt.json[GameInfo.theme - 1].weapon[GameInfo.level - 1];
        find('Canvas/Map').getComponent(Map).init(weaponDt);

        let monsterDt = this.levelDt.json[GameInfo.theme - 1].monsterid[GameInfo.level - 1];
        let waveDt = this.levelDt.json[GameInfo.theme - 1].wavemonstercount[GameInfo.level - 1];
        this.node.getChildByName('EnemyLayer').getComponent(EnemyLayer).init(monsterDt, waveDt);

        this.node.getChildByName('BulletLayer').getComponent(BulletLayer).initBulletPool(weaponDt, weaponDt.length);
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

    restartGame()
    {
        director.tick = this.oldTick;
        EventManager.Instance.clearAllObserver();
        EventManager.resetInstance();
        director.loadScene('MainScene');
    }

    quitGame()
    {
        EventManager.Instance.clearAllObserver();
        EventManager.resetInstance();
        director.loadScene('MenuScene');
    }
    
    onDestroy() {
        //切换场景必须重置，不然报错
        if (this.oldTick) {
            director.tick = this.oldTick;
        }
    }
    
}


