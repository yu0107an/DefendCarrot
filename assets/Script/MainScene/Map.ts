import { _decorator, Component, Node, resources, Sprite, SpriteFrame, TiledMap, TiledMapAsset, TiledObjectGroup} from 'cc';
import { EventManager } from './EventManager';
import { struct } from './AStar';
import { ObstacleInfo } from './ObstacleLayer';
import { GameInfo } from '../GameInfo';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Map')
export class Map extends Component {

    objects: TiledObjectGroup;

    start()
    {
        let path = 'Theme' + GameInfo.theme.toString() + '/BG' + GameInfo.level.toString() + '/';
        resources.load(path + 'BGPath', TiledMapAsset, (err, tiledMap) => {
            this.node.getComponent(TiledMap).tmxAsset = tiledMap;
            this.objects = this.node.getComponent(TiledMap).getObjectGroup('PATH');
        });
        resources.load(path + 'BG-hd/spriteFrame', SpriteFrame, (err, sp) => {
            this.node.getChildByName('Road').getComponent(Sprite).spriteFrame = sp;
        });
    }

    getEnemyPath(): struct[]
    {
        let enemyPath: struct[] = new Array<struct>();
        this.objects.getObjects().forEach((object) => {
            if (object.name.search(/PT/gi) !== -1)
            {
                let index: number = Number(object.name.split('T', 2)[1]) - 1;
                enemyPath[index] = { x: object.x + 40, y: object.y - 40 };
            }
        })
        return enemyPath;
    }

    getObstacleInfo(): Set<ObstacleInfo>
    {
        let obstacleInfo = new Set<ObstacleInfo>();
        this.objects.getObjects().forEach((object) => {
            if (object.name.search(/\d+Ob\d+/) !== -1)
            {
                let id = Number(object.name.split('O', 1)[0]);
                obstacleInfo.add({ id: id, x: object.x, y: object.y, width: object.width, height: object.height });
            }
        })
        return obstacleInfo;
    }

    enableClick()
    {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    disableClick()
    {
        this.node.off(Node.EventType.TOUCH_END, this.click, this);
    }

    click(event)
    {
        let pos = event.getUILocation();
        let index = this.objects.getObjects().findIndex((object) => pos.x >= object.x &&
                                                                    pos.x <= object.x + object.width &&
                                                                    pos.y <= object.y &&
                                                                    pos.y >= object.y - object.height);
        if (index === -1)
        {
            AudioManager.Instance.playAudioById(4);
            EventManager.Instance.createForbiddenNode(pos);
        }
        else
        {
            EventManager.Instance.clickScreen(pos);
        }
        
    }

    protected onDestroy(): void
    {
        this.disableClick();
    }

}


