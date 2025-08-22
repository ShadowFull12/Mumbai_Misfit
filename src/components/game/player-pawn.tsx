
'use client';

import type { Player } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { User, UserCog } from 'lucide-react';

interface PlayerPawnProps {
  player: Player;
}

export function PlayerPawn({ player }: PlayerPawnProps) {
  const isMrX = player.role === 'MRX';
  const iconColor = isMrX ? 'black' : 'white';
  let pawnColor = isMrX ? 'white' : player.color;

  if (player.isStuck) {
      pawnColor = '#6b7280'; // gray-500
  }

  return (
    <TooltipProvider>
        <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
                <g className="cursor-pointer">
                    <circle
                        r="15"
                        fill={pawnColor}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="2"
                    />
                    {isMrX ? (
                        <UserCog className="w-5 h-5" x="-10" y="-10" style={{ color: iconColor }} />
                    ) : (
                        <User className="w-5 h-5" x="-10" y="-10" style={{ color: iconColor }} />
                    )}
                </g>
            </TooltipTrigger>
            <TooltipContent>
                <p className="font-semibold" style={{ color: player.isStuck ? '#9ca3af' : player.color }}>
                    {player.name} ({player.role})
                    {player.isStuck && ' - STUCK'}
                </p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
