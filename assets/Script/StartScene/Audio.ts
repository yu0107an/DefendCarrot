import { _decorator, AudioSource, Component, Node } from 'cc';
import { GameInfo } from '../Frame/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('Audio')
export class Audio extends Component {

    bgm: AudioSource;
    select: AudioSource;

    private static instance: Audio;
    private constructor()
    {
        super();
    };

    public static get Instance()
    {
        if (Audio.instance === null)
        {
            Audio.instance = new Audio;
        }
        return Audio.instance;
    }

    start()
    {
        let audio = this.node.getComponents(AudioSource);
        this.bgm = audio[0];
        this.select = audio[1];
        Audio.instance = this;
    }

    playBgm()
    {
        this.bgm.play();
    }

    playSelect()
    {
        this.select.play();
    }

    setVolume(type: string)
    {
        if (type === 'Bgm')
        {
            this.bgm.volume = Number(GameInfo.Instance.Bgm);
        }
        else if(type === 'Se')
        {
            this.select.volume = Number(GameInfo.Instance.Se);
        }
    }

}


