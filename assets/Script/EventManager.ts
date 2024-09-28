import { _decorator, find, Node, Vec2 } from 'cc';
import { Game } from './Game';
import { EffectLayer } from './EffectLayer';
import { UI1 } from './UI1';
import { Map } from './Map';
import { UIControl } from './UIControl';
import { ChoiceCard } from './ChoiceCard';
import { TowerLayer } from './TowerLayer';
import { AStar, struct } from './AStar';
import { BulletLayer } from './BulletLayer';
const { ccclass, property } = _decorator;

export enum IObserverType
{
    GameState,
    Coin
}

@ccclass('EventManager')
export class EventManager {
    
    eventIndex: number = 1;
    private gameTs: Game;
    private UI1Ts: UI1;
    private UI2Ts: UIControl;
    private effectLayerTs: EffectLayer;
    private towerLayerTs: TowerLayer;
    private bulletLayerTs: BulletLayer;
    private static instance: EventManager;

    private constructor() { };

    init()
    {
        this.gameTs = find('Canvas/Game').getComponent(Game);
        this.UI1Ts = find('Canvas/UI1').getComponent(UI1);
        this.UI2Ts = find('Canvas/UI2').getComponent(UIControl);
        this.effectLayerTs = find('Canvas/EffectLayer').getComponent(EffectLayer);
        this.towerLayerTs = find('Canvas/Game/TowerLayer').getComponent(TowerLayer);
        this.bulletLayerTs = find('Canvas/Game/BulletLayer').getComponent(BulletLayer);
    }

    static get Instance()
    {
        if (!this.instance)
        {
            this.instance = new EventManager;
            this.instance.init();
        }
        return this.instance;
    }

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

    initLevelCard(data: any)
    {
        find('Canvas/UI2/ChoiceCard').getComponent(ChoiceCard).initAllCard(data);
    }

    createEffect(pos: Vec2, name: string, followTarget?: Node)
    {
        this.effectLayerTs.createEffect(pos, name, followTarget);
    }

    drawTowerRangeAndInfo(radius: number, pos: Vec2, upgradePrice: string, sellPrice: string, func: any)
    {
        this.UI1Ts.drawTowerRange(radius, pos);
        this.UI2Ts.drawTowerInfo(pos, upgradePrice, sellPrice, func);
    }

    clearTowerRangeAndInfo()
    {
        this.UI1Ts.clearTowerRange();
        this.UI2Ts.clearTowerInfo();
    }

    clickScreen(x: number, y: number)
    {
        this.UI2Ts.getComponent(UIControl).clickScreen(x, y);
    }

    createForbiddenNode(pos: Vec2)
    {
        this.UI1Ts.getComponent(UI1).createForbiddenNode(pos);
    }

    changeMapValue(x: number, y: number, value: number)
    {
        find('Canvas/Map').getComponent(Map).map[x][y] = value;
    }

    createTower(data: any, pos: Vec2)
    {
        this.towerLayerTs.createTower(data, pos);
    }

    disableSelect()
    {
        find('Canvas/UI2/ChoiceCard').active = false;
        find('Canvas/UI2/Select').active = false;
    }

    recycleBullet(bullet: Node)
    {
        this.bulletLayerTs.recycleBullet(bullet);
    }

    confirmAttackPoint(target: Node)
    {
        this.UI2Ts.createAttackPoint(target);
        this.towerLayerTs.confirmAttackPoint(target);
    }

    cancelAttackPoint()
    {
        this.UI2Ts.cancelAttackPoint();
    }

    getAttackPoint(): Node
    {
        return this.UI2Ts.getAttackPoint();
    }

    findPath_AStar(start: struct, end: struct, pathNumber: number): struct[]
    {
        return AStar.FindPath_4Dir(start, end, find('Canvas/Map').getComponent(Map).map, pathNumber);
    }

    pauseGame(state: boolean)
    {
        this.gameTs.gameStateChanged(state);
    }

    changeCoin(count: number)
    {
        this.gameTs.gameCoinChanged(count);
    }

}


