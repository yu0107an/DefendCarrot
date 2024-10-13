import { Component, Node } from "cc";
import { Enemy } from "./MainScene/Enemy";

export class PriorityQueue extends Component
{

    nodes: Node[];

    constructor()
    {
        super();
        this.nodes = new Array<Node>();
    }

    swap(curIndex: number, targetIndex: number)
    {
        let temp = this.nodes[curIndex];
        this.nodes[curIndex] = this.nodes[targetIndex];
        this.nodes[targetIndex] = temp;
    }

    get(index: number): Node | undefined
    {
        return this.nodes[index];
    }

    push(node: Node)
    {
        this.nodes.push(node);
        if (this.nodes.length <= 1)
        {
            return;
        }
        for (let i = this.nodes.length - 1; i > 0; i--)
        {
            if (this.compare(i, i - 1))
            {
                this.swap(i, i - 1);
            }
            else
            {
                break;    
            }
        }
    }

    shift()
    {
        this.nodes.shift();
    }

    splice(index: number, count: number)
    {
        this.nodes.splice(index, count);
    }

    findIndex(node: Node): number
    {
        return this.nodes.findIndex(value => value === node);
    }

    size(): number
    {
        return this.nodes.length;
    }

    private compare(curIndex: number, targetIndex: number): Boolean
    {
        let curNode = this.nodes[curIndex].getComponent(Enemy);
        let targetNode = this.nodes[targetIndex].getComponent(Enemy);
        if (curNode.curPath > targetNode.curPath)
        {
            return true;
        }
        else if (curNode.curPath === targetNode.curPath)
        {
            let x1 = Math.abs(curNode.node.position.x - curNode.path[curNode.curPath + 1].x);
            let y1 = Math.abs(curNode.node.position.y - curNode.path[curNode.curPath + 1].y);

            let x2 = Math.abs(targetNode.node.position.x - targetNode.path[targetNode.curPath + 1].x);
            let y2 = Math.abs(targetNode.node.position.y - targetNode.path[targetNode.curPath + 1].y);
            return x1 + y1 < x2 + y2;
        }
        else
        {
            return false;    
        }
        
    }
}


