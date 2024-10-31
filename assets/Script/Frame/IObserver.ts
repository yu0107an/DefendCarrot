interface IObserver
{
    eventIndex?: number;
    gameStateChanged?(isPaused: boolean);
    gameCoinChanged?(coinNumber:number);
}

