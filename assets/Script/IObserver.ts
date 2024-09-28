interface IObserver
{
    eventIndex?: number;
    gameStateChanged?(isPaused);
    gameCoinChanged?(coinNumber);
}

