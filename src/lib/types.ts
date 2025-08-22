

export type TransportType = 'AUTO' | 'BUS' | 'METRO' | 'FERRY' | 'BLACK';
export type SpecialTicket = 'DOUBLE';

export interface Node {
  id: number;
  name: string;
  x: number;
  y: number;
}

export interface Edge {
  from: number;
  to: number;
  transport: Exclude<TransportType, 'BLACK'>;
}

export interface Board {
  nodes: Node[];
  edges: Edge[];
  players?: Player[]; // Optional, for client-side checks
}

export type Tickets = {
  [key in TransportType]: number;
} & {
  [key in SpecialTicket]: number;
};

export interface Player {
  uid: string;
  name: string;
  role: 'MRX' | 'DETECTIVE';
  seatIndex: number;
  color: string;
  tickets: Tickets;
  currentNodeId: number;
  isCreator?: boolean;
  isMakingDoubleMove?: boolean;
  isStuck?: boolean;
}

export interface MrXMove {
  round: number;
  transport: TransportType | 'DOUBLE';
  revealed: boolean;
  toNodeId: number;
}

export interface GameState {
  gameId: string;
  phase: 'lobby' | 'playing' | 'finished';
  mapId: string;
  round: number;
  turnSeatIndex: number;
  revealRounds: number[];
  roundLimit: number;
  players: Player[];
  mrXHistory: MrXMove[];
  mrXLastRevealedPosition: Node | null;
  board: Board;
  winner: 'MRX' | 'DETECTIVE' | null;
}
