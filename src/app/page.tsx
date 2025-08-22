
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createGame } from '@/lib/game-service';
import { generatePlayerId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Gamepad2, User as UserIcon } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);
  const [gameId, setGameId] = React.useState('');
  const [playerName, setPlayerName] = React.useState('');

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter your name.' });
        return;
    }
    setIsCreating(true);
    try {
      const playerId = generatePlayerId();
      localStorage.setItem('mumbai_player_name', playerName); // Save name for future games
      const newGameId = await createGame(playerId, playerName);
      
      localStorage.setItem(`player_id_${newGameId}`, playerId);

      toast({
        title: 'Game Created!',
        description: `Your new game ID is ${newGameId}.`,
      });
      router.push(`/game/${newGameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create a new game. Please try again.',
      });
      setIsCreating(false);
    }
  };
  
  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter your name.' });
        return;
    }
    if (gameId.trim()) {
      localStorage.setItem('mumbai_player_name', playerName);
      router.push(`/game/${gameId.trim()}`);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please enter a valid game ID.',
        });
    }
  };

  React.useEffect(() => {
    const savedName = localStorage.getItem('mumbai_player_name');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
       <div className="absolute top-8 left-8 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-foreground font-headline">Mumbai Misfit</h1>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Game Lobby</CardTitle>
          <CardDescription className="text-center">Create a new game or join an existing one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="playerName" className="flex items-center gap-2"><UserIcon className="w-4 h-4" /> Your Name</Label>
                <Input
                    id="playerName"
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="text-lg h-12"
                />
            </div>

            <form onSubmit={handleCreateGame}>
                <Button type="submit" disabled={isCreating || !playerName} className="w-full text-lg py-6">
                    {isCreating ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Game...
                    </>
                    ) : (
                    <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Create New Game
                    </>
                    )}
                </Button>
            </form>

           <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or join a game</span>
            </div>
          </div>

           <form onSubmit={handleJoinGame} className="space-y-4">
              <div>
                <Label htmlFor="gameId" className="sr-only">Game ID</Label>
                <Input
                    id="gameId"
                    type="text"
                    placeholder="Enter Game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="text-center text-lg h-12"
                />
              </div>
               <Button type="submit" variant="secondary" className="w-full text-lg py-6" disabled={isJoining || !playerName || !gameId}>
                 <Gamepad2 className="mr-2 h-5 w-5" />
                 Join Game
               </Button>
           </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                Enter your name, then create a game or join one with an ID.
            </p>
        </CardFooter>
      </Card>
    </main>
  );
}
