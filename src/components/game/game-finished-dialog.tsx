
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Player } from '@/lib/types';
import { Crown, Loader2 } from 'lucide-react';
import { resetGame } from '@/lib/game-service';
import { useToast } from '@/hooks/use-toast';

interface GameFinishedDialogProps {
  winner: 'MRX' | 'DETECTIVE';
  players: Player[];
  gameId: string;
}

export function GameFinishedDialog({ winner, players, gameId }: GameFinishedDialogProps) {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = React.useState(false);
  const mrXName = players.find(p => p.role === 'MRX')?.name || 'Mr. X';
  
  const handlePlayAgain = async () => {
    setIsResetting(true);
    const playerId = localStorage.getItem(`player_id_${gameId}`);
    if (!playerId) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: "Could not find your player ID to restart the game."
        });
        setIsResetting(false);
        return;
    }
    try {
        await resetGame(gameId, playerId);
        // The onSnapshot listener in GamePage will handle the UI update to the lobby
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Failed to restart game',
            description: error.message,
        });
        setIsResetting(false);
    }
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="w-8 h-8 text-yellow-500" />
            Game Over!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            {winner === 'MRX'
              ? `The shadows prevail! ${mrXName} has escaped.`
              : `The detectives have cornered their quarry! ${mrXName} has been caught.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handlePlayAgain} className="text-lg py-6" disabled={isResetting}>
            {isResetting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null}
            Play Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
