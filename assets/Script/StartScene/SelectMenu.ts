import { _decorator, Component, director, Event, find, Node, PageView } from 'cc';
import { GameInfo } from '../GameInfo';
import { Canvas } from './Canvas';
import { Audio } from './Audio';
const { ccclass, property } = _decorator;

@ccclass('SelectMenu')
export class SelectMenu extends Component {

    curPageView: PageView;
    curTheme: number;

    start()
    {
        this.curPageView = this.node.getChildByName('ThemePage').getComponent(PageView);
        this.init();
    }

    init()
    {
        let themePageContent = this.node.getChildByPath('ThemePage/view/content');
        for (let i = 1; i < GameInfo.Instance.Theme; i++)
        {
            themePageContent.children[i].children[0].active = false;
        }
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
        Audio.Instance.playSelect();
    }

    playButton()
    {
        Audio.Instance.playSelect();
        GameInfo.Instance.curTheme = this.curTheme;
        GameInfo.Instance.curLevel = this.curPageView.curPageIdx + 1;
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

        let count = 0;
        if (this.curTheme < GameInfo.Instance.Theme)
        {
            count = newPage.getChildByPath("view/content").children.length;
        }
        else
        {
            count = GameInfo.Instance.Level;    
        }
        for (let i = 1; i < count; i++)
        {
            newPage.getChildByPath("view/content").children[i].children[0].active = false;
        }
    }

    prePage()
    {
        let targetPage = this.curPageView.curPageIdx;
        if (targetPage !== 0)
        {
            this.curPageView.scrollToPage(targetPage - 1);
        }
        Audio.Instance.playSelect();

        if (this.curTheme === GameInfo.Instance.Theme)
        {
            if (this.curPageView.curPageIdx + 1 <= GameInfo.Instance.Level)
            {
                this.node.getChildByName('PlayButton').active = true;
                this.node.getChildByName('Locked').active = false;
            }
            else
            {
                this.node.getChildByName('PlayButton').active = false;
                this.node.getChildByName('Locked').active = true;
            }
        }
    }

    nextPage()
    {
        let targetPage = this.curPageView.curPageIdx;
        if (targetPage !== this.curPageView.getPages().length - 1)
        {
            this.curPageView.scrollToPage(targetPage + 1);
        }
        Audio.Instance.playSelect();

        if (this.curTheme === GameInfo.Instance.Theme)
        {
            if (this.curPageView.curPageIdx + 1 <= GameInfo.Instance.Level)
            {
                this.node.getChildByName('PlayButton').active = true;
                this.node.getChildByName('Locked').active = false;
            }
            else
            {
                this.node.getChildByName('PlayButton').active = false;
                this.node.getChildByName('Locked').active = true;
            }
        }
    }
}


