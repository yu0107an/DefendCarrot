export interface struct
{
    x: number;
    y: number;
    g?: number;
    h?: number;
    father?: struct;
}

export class AStar
{
    static FindPath_4Dir(start: struct, end: struct, map: any, pathNumber: number)
    {
        let dx = [-1, 1, 0, 0];
        let dy = [0, 0, -1, 1];
        let open = new Array<struct>();
        let close = new Array<struct>();

        start.g = 0;
        open.push(start);
        while (open.length !== 0)
        {
            open.sort((a, b) => (a.g + a.h) - (b.g + b.h));
            let curNode = open[0];
            for (let i = 0; i < 4; i++)
            {
                let x = curNode.x + dx[i];
                let y = curNode.y + dy[i];
                if (x === end.x && y === end.y)
                {
                    end.father = curNode;
                    return this.reConstructPath(end);
                }
                if (map[x][y] !== pathNumber || x < 0 || x >= map.length || y < 0 || y >= map[x].length)
                {
                    continue;
                }
                if (close.find((value: struct) => { value.x === x && value.y === y }))
                {
                    continue;
                }
                let g = curNode.g + 1;
                let result = open.find((value: struct) => { value.x === x && value.y === y });
                if (result)
                {
                    if (result.g > g)
                    {
                        result.father = curNode;
                        result.g = g;
                    }
                    continue;
                }
                let newNode: struct = { x: x, y: y, g: g };
                newNode.father = curNode;
                newNode.h = Math.abs(newNode.x - end.x) + Math.abs(newNode.y - end.y);
                open.push(newNode);
            }
            open.shift();
            close.push(curNode);
        }
        return null;
    }

    static reConstructPath(endNode: struct)
    {
        let path = new Array<struct>();
        let curNode = endNode;
        while (curNode)
        {
            path.push(curNode);
            curNode = curNode.father;
        }
        return path.reverse();
    }

    

}