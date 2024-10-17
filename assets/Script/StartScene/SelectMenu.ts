import { _decorator, Component, director, Event, find, Node, PageView } from 'cc';
import { GameInfo } from '../GameInfo';
import { Canvas } from './Canvas';
const { ccclass, property } = _decorator;

@ccclass('SelectMenu')
export class SelectMenu extends Component {

    curPageView: PageView;
    curTheme: number;

    start() {
        this.curPageView = this.node.getChildByName('ThemePage').getComponent(PageView);
    }

    backButton()
    {
        this.node.parent.getComponent(Canvas).showLoading();
        let themePage = this.node.getChildByName('ThemePage');
        if (themePage.active)
        {
            this.node.active = false;
            find('Canvas/MainMenu').active = true;
        }
        else
        {
            this.curPageView = themePage.getComponent(PageView);
            themePage.active = true;
            this.node.getChildByName('LevelPage0' + this.curTheme).active = false;
            this.node.getChildByName('PlayButton').active = false;
        }
    }

    playButton()
    {
        GameInfo.theme = this.curTheme;
        GameInfo.level = this.curPageView.curPageIdx + 1;
        director.loadScene('MainScene');
    }

    replacePageView(event: Event, data: string)
    {
        this.curTheme = Number(data);
        event.target.parent.parent.parent.active = false;
        let newPage = this.node.getChildByName('LevelPage0' + data);
        this.curPageView = newPage.getComponent(PageView);
        newPage.active = true;
        this.node.getChildByName('PlayButton').active = true;
    }

    prePage()
    {
        let targetPage = this.curPageView.curPageIdx;
        if (targetPage !== 0)
        {
            this.curPageView.scrollToPage(targetPage - 1);
        }
    }

    nextPage()
    {
        let targetPage = this.curPageView.curPageIdx;
        if (targetPage !== this.curPageView.getPages().length - 1)
        {
            this.curPageView.scrollToPage(targetPage + 1);
        }
    }
}


