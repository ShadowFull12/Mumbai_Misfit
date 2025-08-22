
'use client';

import type { Player } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketDisplay } from './ticket-display';
import { User, UserCog, UserX } from 'lucide-react';

interface PlayerInfoProps {
  player: Player;
  isMrX?: boolean;
  isSelf: boolean;
}

export function PlayerInfo({ player, isMrX = false, isSelf }: PlayerInfoProps) {
  const PlayerIcon = () => {
      if (player.isStuck) return <UserX className="w-5 h-5 text-gray-500" />;
      if (isMrX) return <UserCog className="w-5 h-5" />;
      return <User className="w-5 h-5" />;
  }
  
  return (
    <Card className={`bg-background/70 border-2 ${player.isStuck ? 'border-gray-600 opacity-70' : ''}`} style={{ borderColor: player.isStuck ? undefined : player.color }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
        <CardTitle className={`text-lg font-bold flex items-center gap-2 ${player.isStuck ? 'text-gray-400' : ''}`}>
            <PlayerIcon />
            {player.name}
        </CardTitle>
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: player.isStuck ? player.color : player.color }} />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={`text-sm mb-2 ${player.isStuck ? 'text-gray-500' : 'text-muted-foreground'}`}>Location: {player.role === 'MRX' && !isSelf ? '???' : player.currentNodeId}</div>
        <TicketDisplay tickets={player.tickets} hideCounts={isMrX && !isSelf} />
      </CardContent>
    </Card>
  );
}
