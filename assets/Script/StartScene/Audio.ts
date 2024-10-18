import { _decorator, AudioSource, Component, Node } from 'cc';
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
            Audio.instance = new Audio();
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

}


