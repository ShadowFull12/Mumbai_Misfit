
'use client';

import * as React from 'react';
import { joinGame, startGame, leaveGame } from '@/lib/game-service';
import { generatePlayerId } from '@/lib/utils';
import type { GameState, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Crown, Users, LogIn, Play, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LobbyProps {
  gameId: string;
  gameState: GameState;
  playerId: string | null;
  setPlayerId: (id: string) => void;
}

export function Lobby({ gameId, gameState, playerId, setPlayerId }: LobbyProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [playerName, setPlayerName] = React.useState('');
  const [isJoining, setIsJoining] = React.useState(false);
  const [isStarting, setIsStarting] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);

  const hasJoined = React.useMemo(() => {
    return gameState.players.some(p => p.uid === playerId);
  }, [gameState.players, playerId]);

  const currentPlayerIsCreator = React.useMemo(() => {
    const player = gameState.players.find(p => p.uid === playerId);
    return player?.isCreator === true;
  }, [gameState.players, playerId]);

  React.useEffect(() => {
    const savedName = localStorage.getItem('mumbai_player_name');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast({ variant: 'destructive', title: 'Please enter your name' });
      return;
    }
    setIsJoining(true);

    try {
      const newPlayerId = playerId || generatePlayerId();
      if (!playerId) {
        setPlayerId(newPlayerId);
        localStorage.setItem(`player_id_${gameId}`, newPlayerId);
      }
      localStorage.setItem('mumbai_player_name', playerName);
      await joinGame(gameId, newPlayerId, playerName);
      toast({ title: 'Joined Game!', description: 'Waiting for the game to start.' });
    } catch (error: any) {
      console.error('Error joining game:', error);
      toast({ variant: 'destructive', title: 'Error joining game', description: error.message });
      // If joining fails, clear the potentially bad player id
      setPlayerId('');
      localStorage.removeItem(`player_id_${gameId}`);
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartGame = async () => {
      setIsStarting(true);
      try {
          await startGame(gameId);
      } catch (error: any) {
          console.error("Error starting game", error);
          toast({ variant: 'destructive', title: 'Error starting game', description: error.message});
          setIsStarting(false);
      }
  }

  const handleLeaveGame = async () => {
    if (!playerId) return;
    setIsLeaving(true);
    try {
      await leaveGame(gameId, playerId);
      toast({ title: 'Left the lobby.' });
      localStorage.removeItem(`player_id_${gameId}`);
      router.push('/');
    } catch (error: any) {
      console.error("Error leaving game:", error);
      toast({ variant: 'destructive', title: 'Error leaving game', description: error.message });
    } finally {
      setIsLeaving(false);
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Lobby: Mumbai Misfit</CardTitle>
          <CardDescription className="text-center">
            Game ID: <span className="font-mono bg-muted p-1 rounded">{gameId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <h3 className="font-bold text-xl flex items-center gap-2"><Users /> Players ({gameState.players.length}/6)</h3>
             <ul className="space-y-2">
                {gameState.players.map(player => (
                    <li key={player.uid} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                        <span className="font-medium">{player.name}</span>
                        {player.isCreator && <Crown className="w-5 h-5 text-yellow-500" />}
                    </li>
                ))}
             </ul>
             {hasJoined && (
                <Button onClick={handleLeaveGame} variant="destructive" className="w-full" disabled={isLeaving}>
                    {isLeaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOut className="mr-2 h-4 w-4" />}
                    Leave Lobby
                </Button>
             )}
          </div>
          <div className="space-y-4">
            {!hasJoined ? (
              <form onSubmit={handleJoin} className="space-y-4 p-4 border rounded-lg">
                 <h3 className="font-bold text-xl">Join the Game</h3>
                <div>
                  <Label htmlFor="playerName">Your Name</Label>
                  <Input
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isJoining || !playerName}>
                  {isJoining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  Join Game
                </Button>
              </form>
            ) : (
                <div className="p-4 border rounded-lg bg-green-900/20 text-center">
                    <h3 className="font-bold text-xl">You're in!</h3>
                    <p className="text-muted-foreground">Waiting for the creator to start the game.</p>
                </div>
            )}
            
            {currentPlayerIsCreator && hasJoined && (
                <div className="p-4 border-primary/50 border-2 rounded-lg space-y-3 text-center">
                    <h3 className="font-bold text-xl">You are the creator!</h3>
                    <p className="text-sm text-muted-foreground">You can start the game once there are between 2 and 6 players.</p>
                     <Button
                        onClick={handleStartGame}
                        disabled={isStarting || gameState.players.length < 2 || gameState.players.length > 6}
                        className="w-full text-lg py-6"
                    >
                        {isStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                        Start Game
                    </Button>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

    