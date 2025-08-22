
'use client';

import { Clapperboard, User, UserCog, History, TimerIcon } from 'lucide-react';

interface GameHeaderProps {
  round: number;
  currentPlayerName: string;
  isMrXTurn: boolean;
  isDoubleMove?: boolean;
  timeLeft?: number;
}

const Timer = ({ timeLeft }: { timeLeft: number }) => (
    <div className="flex items-center gap-2 font-semibold bg-destructive/80 text-destructive-foreground px-3 py-1 rounded-full">
        <TimerIcon className="h-5 w-5" />
        <span>{timeLeft}s</span>
    </div>
);

export function GameHeader({ round, currentPlayerName, isMrXTurn, isDoubleMove = false, timeLeft }: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between p-3 bg-card/50 border-b border-border/50 shadow-sm">
      <div className="flex items-center gap-2">
        <Clapperboard className="h-8 w-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold text-foreground font-headline">Mumbai Misfit</h1>
      </div>
      <div className="flex items-center gap-4 text-sm md:text-base">
        {timeLeft !== undefined && <Timer timeLeft={timeLeft} />}
        <div className="font-semibold text-muted-foreground">
          Round: <span className="font-bold text-foreground">{round}</span>
        </div>
        <div className="flex items-center gap-2 font-semibold bg-secondary/50 px-3 py-1 rounded-full">
          {isMrXTurn ? (
            isDoubleMove ? <History className="h-5 w-5 text-primary" /> : <UserCog className="h-5 w-5 text-primary" />
          ) : (
            <User className="h-5 w-5 text-accent" />
          )}
          <span>{isDoubleMove ? `Double Move (2/2)` : `${currentPlayerName}'s Turn`}</span>
        </div>
      </div>
    </header>
  );
}

    