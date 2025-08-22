
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerInfo } from './player-info';
import { TransportLog } from './transport-log';
import type { Player, MrXMove, Board, TransportType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, BookUser } from 'lucide-react';

interface GameSidebarProps {
  players: Player[];
  mrXHistory: MrXMove[];
  selfPlayer: Player | undefined;
}

export function GameSidebar({ 
    players, 
    mrXHistory, 
    selfPlayer
}: GameSidebarProps) {
  const mrX = players.find(p => p.role === 'MRX');
  const detectives = players.filter(p => p.role === 'DETECTIVE');

  return (
    <div className="h-full flex flex-col">
       <Tabs defaultValue="players" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 mx-auto mt-2 sticky top-0 bg-muted/50">
            <TabsTrigger value="players"><Users className="w-4 h-4 mr-2"/>Players</TabsTrigger>
            <TabsTrigger value="log"><BookUser className="w-4 h-4 mr-2"/>Mr. X Log</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1 overflow-y-auto p-1 md:p-4">
            <TabsContent value="players" className="mt-0">
                <div className="space-y-4">
                    {mrX && <PlayerInfo player={mrX} isMrX={true} isSelf={selfPlayer?.uid === mrX.uid} />}
                    {detectives.map(player => (
                        <PlayerInfo key={player.uid} player={player} isSelf={selfPlayer?.uid === player.uid} />
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="log" className="mt-0">
                <TransportLog history={mrXHistory} />
            </TabsContent>
        </ScrollArea>
       </Tabs>
    </div>
  );
}
