
'use client';

import * as React from 'react';
import * as d3 from 'd3';
import type { Board, Node, Player, TransportType } from '@/lib/types';
import { PlayerPawn } from './player-pawn';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface GameBoardProps {
  board: Board;
  players: Player[];
  mrXLastRevealedPosition: Node | null;
  onNodeClick: (node: Node) => void;
  selectedNode: Node | null;
  revealRounds: number[];
  currentRound: number;
  selfPlayer?: Player;
  isMyTurn: boolean;
}

const transportColors: Record<string, string> = {
  AUTO: 'stroke-yellow-400',
  BUS: 'stroke-green-500',
  METRO: 'stroke-red-500',
  FERRY: 'stroke-black',
};

const nodeTransportColors: Record<string, string> = {
    AUTO: 'fill-yellow-400',
    BUS: 'fill-green-500',
    METRO: 'fill-red-500',
    FERRY: 'fill-cyan-400',
}

// Function to generate a slightly curved path with an offset
const generatePath = (x1: number, y1: number, x2: number, y2: number, offsetMagnitude: number, curveFactor: number = 15) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    // Normalized perpendicular vector
    const normPerpX = len === 0 ? 0 : dy / len;
    const normPerpY = len === 0 ? 0 : -dx / len;

    const offsetX = normPerpX * offsetMagnitude * curveFactor;
    const offsetY = normPerpY * offsetMagnitude * curveFactor;

    // Control points for a quadratic Bezier curve
    const ctrlPoint1X = midX + offsetX;
    const ctrlPoint1Y = midY + offsetY;
    
    return `M${x1},${y1} S${ctrlPoint1X},${ctrlPoint1Y} ${x2},${y2}`;
};

const transportOffsets: Record<string, number> = {
    AUTO: 0.3,
    BUS: -0.3,
    METRO: 0.1,
    FERRY: 0,
};


const RiverPath1 = "M 320,0 C 350,250 280,500 320,700 S 400,900 350,1050";
const RiverPath2 = "M 550,0 C 520,300 600,600 550,800 S 500,950 580,1050";


export function GameBoard({ 
    board, 
    players, 
    mrXLastRevealedPosition, 
    onNodeClick, 
    selectedNode, 
    revealRounds, 
    currentRound,
    selfPlayer,
    isMyTurn
}: GameBoardProps) {
  const { nodes, edges } = board;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const gRef = React.useRef<SVGGElement>(null);

  const nodeTransports = React.useMemo(() => {
    const map = new Map<number, Set<string>>();
    edges.forEach(edge => {
        if (!map.has(edge.from)) map.set(edge.from, new Set());
        map.get(edge.from)!.add(edge.transport);
        if (!map.has(edge.to)) map.set(edge.to, new Set());
        map.get(edge.to)!.add(edge.transport);
    });
    return map;
  }, [edges]);


  React.useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });
      
    svg.call(zoom as any); // Use 'as any' to bypass type issues with d3 and react refs

    // Cleanup on unmount
    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  const getNodeById = (id: number) => nodes.find(n => n.id === id);

  const isMrXRevealRound = revealRounds.includes(currentRound);

  const selfNodeId = selfPlayer?.currentNodeId;
  const availableMoves = React.useMemo(() => {
    if (!isMyTurn || !selfPlayer || !selfNodeId) return new Set();
    
    const validEdges = edges.filter(edge => edge.from === selfNodeId);
    
    const possibleDestinations = new Set<number>();
    validEdges.forEach(edge => {
        if (selfPlayer.tickets[edge.transport] > 0) {
            possibleDestinations.add(edge.to);
        };
        if (selfPlayer.tickets.BLACK > 0) {
            possibleDestinations.add(edge.to);
        };
    });

    return possibleDestinations;
  }, [isMyTurn, selfPlayer, selfNodeId, edges]);
  
  return (
    <div className="w-full h-full bg-muted/30 rounded-lg shadow-inner overflow-hidden cursor-grab active:cursor-grabbing" data-ai-hint="city map">
      <TooltipProvider>
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 1050 1050" preserveAspectRatio="xMidYMid meet">
          <g ref={gRef}>
             {/* Visual representation of city */}
             <rect x="0" y="0" width="1050" height="1050" fill="#a7bf9b" />
             {/* Parks */}
             <rect x="50" y="50" width="250" height="200" fill="#8db38b" rx="20" />
             <rect x="750" y="100" width="250" height="200" fill="#8db38b" rx="20" />
             <rect x="50" y="600" width="250" height="180" fill="#8db38b" rx="20" />
             <rect x="450" y="750" width="400" height="200" fill="#8db38b" rx="20" />
             <rect x="350" y="450" width="200" height="150" fill="#8db38b" rx="20" />
             <rect x="600" y="250" width="150" height="100" fill="#9bd39b" rx="15" />
             <rect x="50" y="400" width="100" height="150" fill="#96cd96" rx="15" />


             {/* Building Blocks */}
             <rect x="0" y="880" width="400" height="170" fill="#cccccc" />
             <rect x="150" y="300" width="250" height="200" fill="#d9d9d9" />
             <rect x="550" y="0" width="300" height="250" fill="#e0e0e0" />
             <rect x="0" y="280" width="100" height="300" fill="#d1d1d1" />
             <rect x="400" y="50" width="100" height="150" fill="#c2c2c2" />
             <rect x="800" y="400" width="250" height="300" fill="#bbbbbb" />
             <rect x="900" y="0" width="150" height="100" fill="#cccccc" />
             <rect x="650" y="550" width="250" height="180" fill="#d3d3d3" />
             <rect x="50" y="800" width="200" height="150" fill="#c8c8c8" />
            
             {/* Rivers */}
            <path d={RiverPath1} fill="none" stroke="#468C98" strokeWidth="40" opacity="0.6" />
            <path d={RiverPath2} fill="none" stroke="#468C98" strokeWidth="35" opacity="0.6" />

            {/* Base Road Network Layer */}
            {edges.map((edge, index) => {
                if (edge.transport !== 'AUTO' && edge.transport !== 'BUS') return null;
                const fromNode = getNodeById(edge.from);
                const toNode = getNodeById(edge.to);
                if (!fromNode || !toNode || fromNode.id > toNode.id) return null;
                const pathData = generatePath(fromNode.x * 1000 + 25, fromNode.y * 1000 + 25, toNode.x * 1000 + 25, toNode.y * 1000 + 25, 0);
                return (
                    <path
                        key={`road-${index}`}
                        d={pathData}
                        fill="none"
                        className="stroke-gray-600/50"
                        strokeWidth="12"
                    />
                )
            })}
            
            {/* Edges */}
            {edges.map((edge, index) => {
              const fromNode = getNodeById(edge.from);
              const toNode = getNodeById(edge.to);
              if (!fromNode || !toNode || fromNode.id > toNode.id) return null; // Draw each edge once
              
              const isMetro = edge.transport === 'METRO';
              const isFerry = edge.transport === 'FERRY';

              const offset = transportOffsets[edge.transport];
              const pathData = generatePath(
                  fromNode.x * 1000 + 25, fromNode.y * 1000 + 25, 
                  toNode.x * 1000 + 25, toNode.y * 1000 + 25, 
                  offset,
                  isMetro ? 50 : 15 // Metro has wider, sweeping curves
              );
              
              return (
                <path
                  key={`edge-${index}`}
                  d={pathData}
                  fill="none"
                  className={`${transportColors[edge.transport]} ${
                      isFerry ? 'stroke-[4]' : 'stroke-[3]'
                    } ${
                      isFerry || isMetro ? 'opacity-90' : 'opacity-60'
                    } hover:opacity-100 transition-opacity`}
                  strokeDasharray={isMetro ? '8 4' : 'none'}
                />
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isAvailableMove = availableMoves.has(node.id);
              const transports = Array.from(nodeTransports.get(node.id) || []);
              const angleStep = (2 * Math.PI) / transports.length;
              const hasMetro = transports.includes('METRO');

              return (
                 <Tooltip key={`tooltip-node-${node.id}`} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <g
                      transform={`translate(${node.x * 1000 + 25}, ${node.y * 1000 + 25})`}
                      onClick={() => onNodeClick(node)}
                      className="cursor-pointer group"
                    >
                      <circle
                        r={hasMetro ? "20" : "16"}
                        className={`fill-background/80 group-hover:fill-primary/20 transition-colors ${
                            isSelected ? 'stroke-primary stroke-[6]' 
                            : isAvailableMove ? 'stroke-accent stroke-[4] animate-pulse'
                            : 'stroke-foreground/50 stroke-2'
                        } ${hasMetro ? 'stroke-red-500/50 stroke-[4]' : ''}`}
                      />
                       {/* Transport indicators */}
                       {transports.map((transport, i) => {
                           const angle = angleStep * i - Math.PI / 2;
                           const radius = hasMetro ? 15 : 12;
                           const x = radius * Math.cos(angle);
                           const y = radius * Math.sin(angle);
                           return <circle key={transport} cx={x} cy={y} r="4" className={nodeTransportColors[transport]} />
                       })}

                      <text
                        textAnchor="middle"
                        dy=".3em"
                        className="fill-foreground font-bold text-base select-none pointer-events-none"
                      >
                        {node.id}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{node.name} ({node.id})</p>
                    <div className="flex gap-2 mt-1">
                        {transports.map(t => <span key={t} className="text-xs font-semibold">{t}</span>)}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Player Pawns */}
            {mrXLastRevealedPosition && selfPlayer?.role !== 'MRX' && (
              <g transform={`translate(${mrXLastRevealedPosition.x * 1000 + 25}, ${mrXLastRevealedPosition.y * 1000 + 25})`} className="pointer-events-none">
                <PlayerPawn player={{
                  uid: 'mrx-ghost', name: 'Mr. X Last Seen', role: 'MRX', color: 'rgba(255,255,255,0.5)', seatIndex: -1, tickets: {} as any, currentNodeId: mrXLastRevealedPosition.id
                }} />
              </g>
            )}
            {players.map(player => {
              const node = getNodeById(player.currentNodeId);
              if (!node) return null;
              
              const isSelf = selfPlayer?.uid === player.uid;
              if (player.role === 'MRX' && !isSelf && !isMrXRevealRound) {
                  return null;
              }
              const isCurrentTurnPlayer = isMyTurn && isSelf;
              const pulseColor = player.role === 'MRX' ? 'black' : player.color;
              
              return (
                <g key={`player-${player.uid}`} transform={`translate(${node.x * 1000 + 25}, ${node.y * 1000 + 25})`} className="transition-transform duration-500">
                  {isCurrentTurnPlayer && !(player.role === 'MRX' && isMrXRevealRound) && (
                    <circle r="25" fill="transparent" stroke={pulseColor} strokeWidth="4" strokeDasharray="8 8" className="animate-turn-pulse" />
                  )}
                  <g>
                    <PlayerPawn player={player} />
                  </g>
                  {player.role === 'MRX' && isMrXRevealRound && (
                     <circle r="25" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray="8 8" className="animate-reveal-pulse" />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </TooltipProvider>
    </div>
  );
}
