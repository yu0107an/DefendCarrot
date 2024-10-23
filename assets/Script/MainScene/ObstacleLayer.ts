import { _decorator, BoxCollider2D, Component, instantiate, JsonAsset, Node, Prefab, Sprite, SpriteAtlas, v3, Vec3 } from 'cc';
import { Obstacle } from './Obstacle';
const { ccclass, property } = _decorator;

export interface ObstacleInfo
{
    id: number;
    x: number,
    y: number,
    width: number,
    height: number
}

@ccclass('ObstacleLayer')
export class ObstacleLayer extends Component {

    @property(SpriteAtlas)
    atlas: SpriteAtlas;
    @property(JsonAsset)
    ObstacleDt: JsonAsset;
    @property(Prefab)
    hpBarPrefab: Prefab;

    init(obstacleInfo: Set<ObstacleInfo>)
    {
        obstacleInfo.forEach((obstacle) => {
            let id = obstacle.id.toString();
            if (obstacle.id < 10)
            {
                id = '0' + id;
            }
            let spriteFrame = this.atlas.getSpriteFrame('cloud' + id);
            let newObstacle = new Node('cloud' + id);
            this.node.addChild(newObstacle);
            this.initObstacleById(obstacle.id, newObstacle, obstacle);
            let sprite = newObstacle.addComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
            newObstacle.setPosition(v3(obstacle.x + obstacle.width / 2 - 480, obstacle.y - obstacle.height / 2 - 320));

            let collider = newObstacle.addComponent(BoxCollider2D);
            collider.sensor = true;
            collider.group = 32;
            collider.size = spriteFrame.originalSize;
        })
    }

    initObstacleById(id: number, newObstacle: Node, info: ObstacleInfo)
    {
        let realId = 0;
        if (id <= 4)
        {
            realId = 1;
        }
        else if (id <= 7)
        {
            realId = 2;
        }
        else
        {
            realId = 3;
        }
        let dt = this.ObstacleDt.json[realId - 1];
        newObstacle.addComponent(Obstacle).init(info.width, info.height, dt.hp, dt.reward);

        let hpBar = instantiate(this.hpBarPrefab);
        newObstacle.addChild(hpBar);
        hpBar.setPosition(v3(0, 20));
        hpBar.active = false;
    }

    isExistObstacle(pos: Vec3): Boolean
    {
        let clickX = pos.x - 480;
        let clickY = pos.y - 320;

        let found = this.node.getComponentsInChildren(Obstacle).some((obstacleTs) => {
            let x = obstacleTs.node.position.x - obstacleTs.width / 2;
            let y = obstacleTs.node.position.y - obstacleTs.height / 2;
        
            if (clickX >= x && clickX <= x + obstacleTs.width &&
                clickY >= y && clickY <= y + obstacleTs.height)
            {
                return true;
            }
            return false;
        });
        return found;
    }

    reduceHp_Obstacle(obstacle: Node, atk: number)
    {
        obstacle.getComponent(Obstacle).reduceHp(atk);
    }

}