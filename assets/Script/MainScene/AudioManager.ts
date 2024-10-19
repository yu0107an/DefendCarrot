import { _decorator, AudioSource, Component, Node } from 'cc';
import { GameInfo } from '../GameInfo';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    /*
        0:bgm          1:countDown  2:go           3:towerSelect  4:selectFault
        5:shootSelect  6:towerSell  7:towerUpdate  8:towerBuild   9:towerDesSelect
       10:carrot1     11:carrot2   12:carrot3     13:crash       14:Fly151
       15:Fly161      16:Fly251    17:MenuSelect  18:Bottle      19:Shit
    */
    private static instance: AudioManager;
    private constructor() { super(); };
    public static get Instance()
    {
        if (AudioManager.instance === null)
        {
            AudioManager.instance = new AudioManager;
        }
        return AudioManager.instance;
    }

    audios: AudioSource[];

    start()
    {
        this.audios = this.node.getComponents(AudioSource);
        AudioManager.instance = this;
        this.audios[0].volume = Number(GameInfo.bgm);
        for (let i = 1; i < this.audios.length; i++)
        {
            this.audios[i].volume = Number(GameInfo.se);
        }
    }

    playAudioById(id: number)
    {
        this.audios[id].play();
    }

    stopAudioById(id: number)
    {
        this.audios[id].stop();
    }
}


