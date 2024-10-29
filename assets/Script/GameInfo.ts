export class GameInfo
{
    public maxWave: number;
    public curTheme: number;
    public curLevel: number;
    private bossMode: boolean;
    private monsterNest: boolean;
    private theme: number;
    private level: number;
    private bgm: boolean;
    private se: boolean;

    private static instance: GameInfo;
    public static get Instance()
    {
        if (!GameInfo.instance)
        {
            GameInfo.instance = new GameInfo();
            GameInfo.instance.loadData();
        }
        return GameInfo.instance;
    }

    private loadData()
    {
        const savedTheme = Number(localStorage.getItem('Theme'));
        this.theme = savedTheme ? Number(savedTheme) : 1;

        const savedLevel = Number(localStorage.getItem('Level'));
        this.level = savedTheme ? Number(savedLevel) : 1;

        const savedBgm = Boolean(localStorage.getItem('Bgm'));
        this.bgm = savedTheme ? Boolean(savedBgm) : true;

        const savedSe = Boolean(localStorage.getItem('Se'));
        this.se = savedTheme ? Boolean(savedSe) : true;

        const savedBossMode = Boolean(localStorage.getItem('BossMode'));
        this.bossMode = savedBossMode ? Boolean(savedBossMode) : false;

        const savedNest = Boolean(localStorage.getItem('MonsterNest'));
        this.bossMode = savedNest ? Boolean(savedNest) : false;
    }

    public saveProgress(theme: number, level: number)
    {
        localStorage.setItem('Theme', theme.toString());
        localStorage.setItem('Level', level.toString());
    }

    public saveMode(bossMode: boolean, monsterNest: boolean)
    {
        localStorage.setItem('BossMode', bossMode.toString());
        localStorage.setItem('MonsterNest', monsterNest.toString());
    }

    public saveSetting(bgm: boolean, se: boolean)
    {
        localStorage.setItem('Bgm', bgm.toString());
        localStorage.setItem('Se', se.toString());
    }

    public get Bgm(): boolean
    {
        return this.bgm;
    }

    public set Bgm(value: boolean)
    {
        this.bgm = value;
        this.saveSetting(this.bgm, this.se);
    }

    public get Se(): boolean
    {
        return this.se;
    }

    public set Se(value: boolean)
    {
        this.se = value;
        this.saveSetting(this.bgm, this.se);
    }

    public get Theme(): number
    {
        return this.theme;
    }

    public set Theme(value: number)
    {
        this.theme = value;
    }

    public get Level(): number
    {
        return this.level;
    }

    public set Level(value: number)
    {
        this.level = value;
    }

    public get BossMode(): boolean
    {
        return this.bossMode;
    }

    public set BossMode(value: boolean)
    {
        this.bossMode = value;
        this.saveMode(this.bossMode, this.monsterNest);
    }

    public get MonsterNest(): boolean
    {
        return this.monsterNest;
    }

    public set MonsterNest(value: boolean)
    {
        this.monsterNest = value;
        this.saveMode(this.bossMode, this.monsterNest);
    }
}