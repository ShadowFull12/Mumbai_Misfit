
'use client';

import * as React from 'react';
import type { Player, Board, TransportType, Node } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { AutoIcon } from '../icons/auto-icon';
import { BusIcon } from '../icons/bus-icon';
import { MetroIcon } from '../icons/metro-icon';
import { FerryIcon } from '../icons/ferry-icon';
import { BlackTicketIcon } from '../icons/black-ticket-icon';
import { DoubleMoveIcon } from '../icons/double-move-icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface MoveConfirmProps {
    player: Player | undefined;
    board: Board;
    selectedNode: Node | null;
    onMove: (toNodeId: number, transport: TransportType | 'DOUBLE', firstMoveTransport?: TransportType) => Promise<void>;
    isSubmittingMove: boolean;
    onNodeClick: (node: Node | null) => void;
    isDoubleMove: boolean;
}

const transportIcons: Record<string, React.ReactNode> = {
    AUTO: <AutoIcon className="w-5 h-5"/>,
    BUS: <BusIcon className="w-5 h-5"/>,
    METRO: <MetroIcon className="w-5 h-5"/>,
    FERRY: <FerryIcon className="w-5 h-5"/>,
    BLACK: <BlackTicketIcon className="w-5 h-5"/>,
    DOUBLE: <DoubleMoveIcon className="w-5 h-5" />,
}

export function MoveConfirm({ player, board, selectedNode, onMove, isSubmittingMove, onNodeClick, isDoubleMove }: MoveConfirmProps) {

    const [isDoubleMoveDialogOpen, setIsDoubleMoveDialogOpen] = React.useState(false);

    const possibleMoves = React.useMemo(() => {
        if (!player || !selectedNode || !player.currentNodeId) return [];

        const uniqueTransports = new Set<TransportType>();

        board.edges
            .filter(edge => (edge.from === player.currentNodeId && edge.to === selectedNode.id))
            .forEach(edge => {
                if(isDoubleMove) {
                    // 2nd leg of double move is free for any transport type
                    uniqueTransports.add(edge.transport);
                } else if (player.tickets[edge.transport] > 0) {
                    uniqueTransports.add(edge.transport);
                }
            });
        
        if (player.role === 'DETECTIVE') {
            const isOccupiedByDetective = board.players?.some(p =>
                p.uid !== player.uid && p.role === 'DETECTIVE' && p.currentNodeId === selectedNode.id
            );
            if (isOccupiedByDetective) return [];
        } else if (player.role === 'MRX' && !isDoubleMove) {
            // Check if a black ticket can be used for any connection for Mr. X
            if (player.tickets.BLACK > 0) {
                const hasAnyConnection = board.edges.some(edge => (edge.from === player.currentNodeId && edge.to === selectedNode.id));
                if (hasAnyConnection) {
                    uniqueTransports.add('BLACK');
                }
            }
        }
        
        return Array.from(uniqueTransports).map(transport => ({ transport, to: selectedNode.id }));

    }, [player, selectedNode, board, isDoubleMove]);

    const handleDoubleMoveConfirm = () => {
        if (selectedNode) {
            // In double move, the first leg just uses the 'DOUBLE' type to signify intent
            onMove(selectedNode.id, 'DOUBLE');
            setIsDoubleMoveDialogOpen(false);
        }
    };
    
    if (!selectedNode || !player || possibleMoves.length === 0) return null;

    const canDoubleMove = player.role === 'MRX' && player.tickets.DOUBLE > 0 && !isDoubleMove;
    
    return (
        <Card className="w-64 shadow-2xl animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
            <CardHeader className="p-3 relative">
                <CardTitle className="text-lg text-center">Move to {selectedNode.id}?</CardTitle>
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => onNodeClick(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
                {possibleMoves.map(({ transport, to }) => (
                    <Button 
                        key={transport} 
                        onClick={() => onMove(to, transport)}
                        disabled={isSubmittingMove}
                        className="w-full justify-start gap-3"
                        variant="outline"
                    >
                        {isSubmittingMove ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            transportIcons[transport]
                        )}
                        
                        {transport} {!isDoubleMove && `(${player.tickets[transport]})`}
                    </Button>
                ))}
                {canDoubleMove && (
                    <>
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Special</span>
                            </div>
                        </div>
                         <Dialog open={isDoubleMoveDialogOpen} onOpenChange={setIsDoubleMoveDialogOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    className="w-full justify-start gap-3"
                                    variant="destructive"
                                    >
                                    {transportIcons['DOUBLE']}
                                    Double Move ({player.tickets.DOUBLE})
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm Double Move</DialogTitle>
                                    <DialogDescription>
                                       Using a Double Move ticket allows you two moves this turn. The first move to Node {selectedNode.id} will consume the Double Move ticket. Your second move from there will be free. Are you sure?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                     <Button variant="ghost" onClick={() => setIsDoubleMoveDialogOpen(false)}>Cancel</Button>
                                     <Button
                                        onClick={handleDoubleMoveConfirm}
                                        disabled={isSubmittingMove}
                                        variant="destructive"
                                    >
                                        {isSubmittingMove && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        Yes, Use Double Move
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
