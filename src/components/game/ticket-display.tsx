
'use client';

import type { Tickets } from '@/lib/types';
import { AutoIcon } from '../icons/auto-icon';
import { BusIcon } from '../icons/bus-icon';
import { MetroIcon } from '../icons/metro-icon';
import { FerryIcon } from '../icons/ferry-icon';
import { BlackTicketIcon } from '../icons/black-ticket-icon';
import { DoubleMoveIcon } from '../icons/double-move-icon';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface TicketDisplayProps {
  tickets: Tickets;
  hideCounts?: boolean;
}

const ticketIcons: Record<string, React.ReactNode> = {
  AUTO: <AutoIcon />,
  BUS: <BusIcon />,
  METRO: <MetroIcon />,
  FERRY: <FerryIcon />,
  BLACK: <BlackTicketIcon />,
  DOUBLE: <DoubleMoveIcon />,
};

const ticketColors: Record<string, string> = {
    AUTO: 'bg-yellow-400/90 text-black',
    BUS: 'bg-green-500/90 text-white',
    METRO: 'bg-red-500/90 text-white',
    FERRY: 'bg-cyan-400/90 text-black',
    BLACK: 'bg-gray-800/90 text-white',
    DOUBLE: 'bg-purple-600/90 text-white',
}


export function TicketDisplay({ tickets, hideCounts = false }: TicketDisplayProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(tickets).map(([type, count]) => {
          if (count === 0 && !hideCounts) return null;
          const hasTickets = count > 0;
          return (
            <Tooltip key={type} delayDuration={200}>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-center gap-2 p-2 rounded-md transition-opacity ${
                    hasTickets || hideCounts ? ticketColors[type] : 'bg-muted/30 opacity-50'
                  }`}
                >
                  <div className="w-6 h-6">{ticketIcons[type]}</div>
                  {!hideCounts ? <span className="font-bold text-sm">{count}</span>
                    : <span className="font-bold text-sm">?</span>}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

    