import { _decorator, Component, instantiate, JsonAsset, Node, NodePool, Prefab, v3, Vec3 } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('BulletLayer')
export class BulletLayer extends Component {

    bulletPools: Map<number, NodePool> = new Map<number, NodePool>();
    @property(JsonAsset)
    bulletDt: JsonAsset;
    @property([Prefab])
    bulletPrefab: Prefab[] = new Array<Prefab>();

    start() {

    }

    initBulletPool(weaponDt: any, bulletTypeCount: number)
    {
        for (let i = 0; i < 1; i++)
        {
            this.bulletPools.set(weaponDt[i], new NodePool('Bullet'));
            let nodePool = this.bulletPools.get(i + 1001);
            for (let j = 0; j < 30; j++)
            {
                let bullet = instantiate(this.bulletPrefab[i]);
                bullet.getComponent(Bullet).init(this.bulletDt.json[i]);
                nodePool.put(bullet);
            }
        }
    }

    addBullet(towerId: number, towerLevel: number, pos: Vec3, target: Node, angle: number)
    {
        let bulletPool = this.bulletPools.get(towerId);
        let bullet = bulletPool.get(towerLevel, target);
        if (bullet === null)
        {
            bullet = instantiate(this.bulletPrefab[towerId - 1001]);
        }
        this.node.addChild(bullet);
        bullet.angle = angle;
        bullet.setPosition(v3(pos.x, pos.y + 10));
    }

    update(deltaTime: number) {
        
    }
}


