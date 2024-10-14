import { _decorator, director, find, Node, Vec3 } from 'cc';
import { Game } from './Game';
import { EffectLayer } from './EffectLayer';
import { UI1 } from './UI1';
import { Map } from './Map';
import { UIControl } from './UIControl';
import { ChoiceCard } from './ChoiceCard';
import { TowerLayer } from './TowerLayer';
import { BulletLayer } from './BulletLayer';
import { EnemyLayer } from './EnemyLayer';
import { Carrot } from './Carrot';
import { ObstacleLayer } from './ObstacleLayer';
const { ccclass, property } = _decorator;

export enum IObserverType
{
    GameState,
    Coin
}

@ccclass('EventManager')
export class EventManager {
    
    private static instance: EventManager;
    private gameTs: Game;
    private mapTs: Map;
    private UI1Ts: UI1;
    private UI2Ts: UIControl;
    private enemyLayerTs: EnemyLayer;
    private effectLayerTs: EffectLayer;
    private towerLayerTs: TowerLayer;
    private bulletLayerTs: BulletLayer;
    private obstacleLayerTs: ObstacleLayer;
    private carrotTs: Carrot;
    eventIndex: number = 1;

    private constructor() { };

    static get Instance()
    {
        if (!this.instance)
        {
            this.instance = new EventManager;
            this.instance.init();
        }
        return this.instance;
    }

    static resetInstance()
    {
        this.instance = null;
    }

    init()
    {
        this.gameTs = find('Canvas/Game').getComponent(Game);
        this.mapTs = find('Canvas/Map').getComponent(Map);
        this.UI1Ts = find('Canvas/UI1').getComponent(UI1);
        this.UI2Ts = find('Canvas/UI2').getComponent(UIControl);
        this.enemyLayerTs = find('Canvas/Game/EnemyLayer').getComponent(EnemyLayer);
        this.effectLayerTs = find('Canvas/EffectLayer').getComponent(EffectLayer);
        this.towerLayerTs = find('Canvas/Game/TowerLayer').getComponent(TowerLayer);
        this.bulletLayerTs = find('Canvas/Game/BulletLayer').getComponent(BulletLayer);
        this.obstacleLayerTs = find('Canvas/Game/ObstacleLayer').getComponent(ObstacleLayer);
        this.carrotTs = find('Canvas/Game/Carrot').getComponent(Carrot);
    }

    //添加观察关系
    addObserver(demander: any, ObserverType: IObserverType)
    {
        
        switch (ObserverType)
        {
            case IObserverType.GameState:
                this.gameTs.gameState_Observers.push(demander);
                break;
            case IObserverType.Coin:
                this.gameTs.gameCoin_Observers.push(demander);
                break;
            default:
                break;
        }
        demander.eventIndex = this.eventIndex;
        this.eventIndex += 1;
    }

    //删除指定观察关系
    delObserver(demander: any, ObserverType: IObserverType)
    {
        if (demander.eventIndex === 0)
        {
            return;
        }
        let index = this.gameTs.gameState_Observers.findIndex(value => value.eventIndex === demander.eventIndex);
        switch (ObserverType)
        {
            case IObserverType.GameState:
                this.gameTs.gameState_Observers.splice(index, 1);
                break;
            case IObserverType.Coin:
                this.gameTs.gameCoin_Observers.splice(index, 1);
                break;
            default:
                break;
        }
        demander.eventIndex = 0;
    }

    //清除所有观察关系
    clearAllObserver()
    {
        this.gameTs.gameState_Observers.forEach((value) => {
            value.eventIndex = 0;
        });
        this.gameTs.gameCoin_Observers.forEach((value) => {
            value.eventIndex = 0;
        })
        this.gameTs.gameState_Observers.length = 0;
        this.gameTs.gameCoin_Observers.length = 0;
        this.eventIndex = 1;
    }

    //初始化关卡数据(关卡开始时使用)
    initLevelData(weaponDt: any, monsterDt: any, waveDt: any)
    {
        find('Canvas/UI2/ChoiceCard').getComponent(ChoiceCard).initAllCard(weaponDt);
        this.enemyLayerTs.init(monsterDt, waveDt, this.mapTs.getEnemyPath());
        this.bulletLayerTs.initBulletPool(weaponDt, weaponDt.length);
        this.obstacleLayerTs.init(this.mapTs.getObstacleInfo());
    }

    //创建效果
    createEffect(pos: Vec3, name: string, followTarget?: Node, coinNumber?: number)
    {
        this.effectLayerTs.createEffect(pos, name, followTarget, coinNumber);
    }

    //画出防御塔范围及升级和销毁按钮
    drawTowerRangeAndInfo(radius: number, pos: Vec3, upgradePrice: string, sellPrice: string, func: any)
    {
        if (this.UI2Ts.isClickScreen() || this.UI2Ts.isClickTower())
        {
            this.clearTowerRangeAndInfo();
            return;
        }
        this.UI1Ts.drawTowerRange(radius, pos);
        this.UI2Ts.drawTowerInfo(pos, upgradePrice, sellPrice, func);
    }

    //清除防御塔范围及升级和销毁按钮
    clearTowerRangeAndInfo()
    {
        this.UI1Ts.clearTowerRange();
        this.UI2Ts.clearTowerInfo();
    }

    //点击屏幕空位时调用，创建选择节点和防御塔卡
    clickScreen(pos: Vec3)
    {
        if (this.UI2Ts.isClickScreen())
        {
            this.disableSelect();
        }
        else if (this.UI2Ts.isClickTower())
        {
            this.clearTowerRangeAndInfo();
        }
        else
        {
            if (this.obstacleLayerTs.isExistObstacle(pos))
            {
                return;
            }
            this.UI1Ts.showSelectNode(pos)
            this.UI2Ts.showChoiceCard(pos);
        }   
    }

    //创建无法点击效果
    createForbiddenNode(pos: Vec3)
    {
        this.UI1Ts.createForbiddenNode(pos);
    }

    //开启UI和Carrot点击按钮
    enableClick()
    {
        this.mapTs.enableClick();
        this.carrotTs.enableClick();
    }

    //关闭UI和Carrot点击按钮
    enableUIButton()
    {
        this.UI2Ts.enableAllButton();
    }

    //开始创建敌人(一关只调用一次)
    createEnemy()
    {
        this.enemyLayerTs.createEnemy();
    }

    //创建防御塔
    createTower(id: number, pos: Vec3)
    {
        this.towerLayerTs.createTower(id, pos);
    }

    //创建子弹
    createBullet(name: string, towerId: number, towerLevel: number, pos: Vec3, target: Node, angle: number)
    {
        this.bulletLayerTs.addBullet(name, towerId, towerLevel, pos, target, angle);
    }

    //隐藏选择节点和防御塔卡片
    disableSelect()
    {
        find('Canvas/UI2/ChoiceCard').active = false;
        find('Canvas/UI1/Select').active = false;
    }

    //敌人扣血
    reduceHp_Enemy(enemy: Node, atk: number)
    {
        this.enemyLayerTs.reduceHp_Enemy(enemy, atk);
    }

    //Carrot扣血
    reduceHp_Carrot(count: number)
    {
        //this.carrotTs.reduceHp(count);
    }

    //障碍物扣血
    reduceHp_Obstacle(obstacle: Node, atk: number)
    {
        this.obstacleLayerTs.reduceHp_Obstacle(obstacle, atk);
    }

    //确认攻击目标
    confirmAttackPoint(target: Node)
    {
        this.UI2Ts.createAttackPoint(target);
        this.towerLayerTs.confirmAttackPoint(target);
    }

    //取消攻击目标
    cancelAttackPoint()
    {
        this.UI2Ts.cancelAttackPoint();
        this.towerLayerTs.cancelAttackPoint();
    }

    //获取攻击目标节点
    getAttackPoint(): Node
    {
        return this.UI2Ts.getAttackPoint();
    }

    //游戏失败调用
    gameOver()
    {
        this.UI2Ts.showGameOver();
        director.pause();
    }

    //暂停游戏
    pauseGame(state: boolean)
    {
        this.gameTs.gameStateChanged(state);
    }

    //金币增加或减少
    changeCoin(count: number)
    {
        this.gameTs.gameCoinChanged(count);
    }

    //改变UI层波数显示
    changeWaveLabel(wave: number)
    {
        this.UI2Ts.changeWaveLabel(wave);
    }

    //设置游戏倍速
    setGameSpeed(speed: number)
    {
        this.gameTs.setGameSpeed(speed);
    }

}