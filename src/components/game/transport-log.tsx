

'use client';

import type { MrXMove } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AutoIcon } from '../icons/auto-icon';
import { BusIcon } from '../icons/bus-icon';
import { MetroIcon } from '../icons/metro-icon';
import { FerryIcon } from '../icons/ferry-icon';
import { BlackTicketIcon } from '../icons/black-ticket-icon';
import { DoubleMoveIcon } from '../icons/double-move-icon';
import { Eye, EyeOff } from 'lucide-react';

interface TransportLogProps {
  history: MrXMove[];
}

const ticketIcons: Record<string, React.ReactNode> = {
  AUTO: <AutoIcon className="w-6 h-6 text-yellow-500" />,
  BUS: <BusIcon className="w-6 h-6 text-green-500" />,
  METRO: <MetroIcon className="w-6 h-6 text-red-500" />,
  FERRY: <FerryIcon className="w-6 h-6 text-black" />,
  BLACK: <BlackTicketIcon className="w-6 h-6 text-foreground" />,
  DOUBLE: <DoubleMoveIcon className="w-6 h-6 text-destructive" />,
};

export function TransportLog({ history }: TransportLogProps) {
  const reversedHistory = [...history].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mr. X's Moves</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-250px)] md:h-[calc(100vh-400px)]">
          <ul className="space-y-3 pr-4">
            {reversedHistory.map((move, index) => (
              <li
                key={`${move.round}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/60"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm bg-background rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {move.round}
                  </span>
                  <div className="w-8 h-8 flex items-center justify-center">
                    {ticketIcons[move.transport]}
                  </div>
                  <span className="font-semibold">{move.transport}</span>
                </div>
                {move.revealed ? (
                  <Eye className="w-5 h-5 text-primary" />
                ) : (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
