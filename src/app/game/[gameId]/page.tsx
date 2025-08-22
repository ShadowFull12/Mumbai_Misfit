
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { GameBoard } from '@/components/game/game-board';
import { GameHeader } from '@/components/game/game-header';
import { GameSidebar } from '@/components/game/game-sidebar';
import type { GameState, Node, Player, TransportType } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelRightOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lobby } from '@/components/game/lobby';
import { GameFinishedDialog } from '@/components/game/game-finished-dialog';
import { makeMove, makeRandomMove } from '@/lib/game-service';
import { MoveConfirm } from '@/components/game/move-confirm';

interface GamePageProps {}

export default function GamePage({}: GamePageProps) {
  const params = useParams();
  const gameId = params.gameId as string;
  const { toast } = useToast();
  const [gameState, setGameState] = React.useState<GameState | null>(null);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [playerId, setPlayerId] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  const [isSubmittingMove, setIsSubmittingMove] = React.useState(false);
  const [isDoubleMove, setIsDoubleMove] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);

  const selfPlayer = gameState?.players.find(p => p.uid === playerId);
  const currentPlayer = gameState?.players.find(p => p.seatIndex === gameState.turnSeatIndex);
  const isMyTurn = selfPlayer?.uid === currentPlayer?.uid && !selfPlayer?.isStuck;


  React.useEffect(() => {
    const storedPlayerId = localStorage.getItem(`player_id_${gameId}`);
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    }
  }, [gameId]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isMyTurn && gameState?.phase === 'playing') {
      setTimeLeft(60); // Reset timer
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            // This check ensures we only call makeRandomMove once
            if (isMyTurn && playerId && gameId) {
                toast({ title: "Time's up!", description: "Making a random move for you." });
                makeRandomMove(gameId, playerId).catch(err => {
                    toast({ variant: 'destructive', title: "Auto-move Failed", description: err.message });
                });
            }
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
        if(timer) clearInterval(timer)
    };
  // Note: isMyTurn already depends on gameState and playerId, so they are implicitly included.
  }, [isMyTurn, gameId, playerId, toast]);
  

  React.useEffect(() => {
    if (!gameId) return;

    setLoading(true);
    const gameRef = doc(firestore, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as GameState;
        // Add players to board for client-side move validation checks
        data.board.players = data.players;

        setGameState(prevState => {
            if (prevState && playerId) {
                 const selfPlayerNow = data.players.find(p => p.uid === playerId);
                 const selfPlayerBefore = prevState.players.find(p => p.uid === playerId);
                 
                 if (selfPlayerNow?.isStuck && !selfPlayerBefore?.isStuck) {
                     toast({
                         variant: 'destructive',
                         title: 'You are out of moves!',
                         description: 'You are stuck and cannot make any more moves. You can continue to spectate.',
                         duration: 10000
                     });
                 }
            }
            return data;
        });
        
        const selfPlayer = data.players.find(p => p.uid === playerId);
        setIsDoubleMove(selfPlayer?.isMakingDoubleMove ?? false);

      } else {
        toast({
            variant: 'destructive',
            title: 'Game not found',
            description: `The game with ID ${gameId} does not exist.`
        });
        setGameState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId, toast, playerId]);

  const handleNodeClick = (node: Node | null) => {
    setSelectedNode(node);
  };
  
  const handleMove = async (toNodeId: number, transport: TransportType | 'DOUBLE', firstMoveTransport?: TransportType) => {
      if (!playerId || !gameId) return;
      setIsSubmittingMove(true);
      try {
          await makeMove(gameId, playerId, toNodeId, transport, firstMoveTransport);
          setSelectedNode(null); // Deselect node after move
      } catch (error: any) {
          console.error("Error making move:", error);
          toast({
              variant: 'destructive',
              title: "Invalid Move",
              description: error.message,
          })
      } finally {
        setIsSubmittingMove(false);
      }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading Game...</p>
      </div>
    );
  }
  
  if (!gameState) {
      return (
        <div className="flex flex-col h-screen bg-background text-foreground items-center justify-center">
             <p className="mt-4 text-lg">Game not found.</p>
        </div>
      )
  }

  // If game is in lobby phase, show the lobby
  if (gameState.phase === 'lobby') {
    return <Lobby gameId={gameId} gameState={gameState} playerId={playerId} setPlayerId={setPlayerId} />;
  }
  
  const sidebarContent = (
    <GameSidebar
      players={gameState.players}
      mrXHistory={gameState.mrXHistory}
      selfPlayer={selfPlayer}
    />
  );
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      {gameState.winner && <GameFinishedDialog winner={gameState.winner} players={gameState.players} gameId={gameId} />}
      <GameHeader
        round={gameState.round}
        currentPlayerName={currentPlayer?.name ?? 'Unknown'}
        isMrXTurn={currentPlayer?.role === 'MRX'}
        isDoubleMove={isDoubleMove}
        timeLeft={isMyTurn ? timeLeft : undefined}
      />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 relative p-2 md:p-4">
          <GameBoard
            board={gameState.board}
            players={gameState.players}
            mrXLastRevealedPosition={gameState.mrXLastRevealedPosition}
            onNodeClick={handleNodeClick}
            selectedNode={selectedNode}
            revealRounds={gameState.revealRounds}
            currentRound={gameState.round}
            selfPlayer={selfPlayer}
            isMyTurn={isMyTurn}
          />
           {isMyTurn && selectedNode && (
              <div className="fixed bottom-4 right-4 md:bottom-6 md:left-[calc(var(--sidebar-width,380px)+1rem)] z-50">
                 <MoveConfirm
                  player={selfPlayer}
                  board={gameState.board}
                  selectedNode={selectedNode}
                  onMove={handleMove}
                  isSubmittingMove={isSubmittingMove}
                  onNodeClick={handleNodeClick}
                  isDoubleMove={isDoubleMove}
                />
              </div>
           )}
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="default"
                className="fixed top-[70px] right-4 z-50 rounded-full h-14 w-14 shadow-lg"
              >
                <PanelRightOpen className="h-6 w-6" />
                <span className="sr-only">Open Game Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] p-0 bg-background border-l-2 border-primary/20">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        ) : (
          <aside className="w-full md:w-[380px] lg:w-[420px] h-full flex-shrink-0 bg-card/50 border-l border-border/50 overflow-y-auto" style={{'--sidebar-width': '380px'} as React.CSSProperties}>
            {sidebarContent}
          </aside>
        )}
      </main>
    </div>
  );
}
