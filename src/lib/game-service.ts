
'use server';

import { doc, setDoc, updateDoc, arrayUnion, getDoc, runTransaction, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { initialGameState, DETECTIVE_START_LOCATIONS, MRX_START_LOCATIONS } from '@/lib/game-data';
import type { GameState, Player, TransportType } from './types';

/**
 * Creates a new game in Firestore and returns the game ID.
 */
export async function createGame(creatorPlayerId: string, creatorName: string): Promise<string> {
  const gameId = generateGameId();
  
  const creator: Player = {
    uid: creatorPlayerId,
    name: creatorName,
    role: 'DETECTIVE', // Placeholder, will be assigned on game start
    seatIndex: 0,
    color: '#CCCCCC', // Placeholder
    tickets: { AUTO: 0, BUS: 0, METRO: 0, FERRY: 0, BLACK: 0, DOUBLE: 0 },
    currentNodeId: 0,
    isCreator: true,
  };

  const newGame: GameState = {
    ...initialGameState,
    gameId: gameId,
    players: [creator],
  };

  try {
    await setDoc(doc(firestore, 'games', gameId), newGame);
    return gameId;
  } catch (error) {
    console.error('Error creating game in Firestore:', error);
    throw new Error('Failed to create game.');
  }
}

/**
 * Adds a player to an existing game.
 */
export async function joinGame(gameId: string, playerId: string, playerName: string) {
    const gameRef = doc(firestore, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
        throw new Error("Game not found");
    }

    const gameState = gameSnap.data() as GameState;

    if (gameState.players.length >= 6) {
        throw new Error("Game is full");
    }

    if (gameState.phase !== 'lobby') {
        throw new Error("Game has already started");
    }

    if (gameState.players.some(p => p.uid === playerId)) {
        // Player is already in the game, perhaps rejoining.
        return;
    }

    const newPlayer: Player = {
        uid: playerId,
        name: playerName,
        role: 'DETECTIVE', // Placeholder
        seatIndex: gameState.players.length,
        color: '#CCCCCC', // Placeholder
        tickets: { AUTO: 0, BUS: 0, METRO: 0, FERRY: 0, BLACK: 0, DOUBLE: 0 },
        currentNodeId: 0,
    };

    try {
        await updateDoc(gameRef, {
            players: arrayUnion(newPlayer)
        });
    } catch (error) {
        console.error("Error joining game:", error);
        throw new Error("Failed to join game.");
    }
}

/**
 * Removes a player from a game lobby.
 * If the creator leaves, assigns a new creator.
 * If the lobby becomes empty, deletes the game.
 */
export async function leaveGame(gameId: string, playerId: string) {
  const gameRef = doc(firestore, 'games', gameId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const gameSnap = await transaction.get(gameRef);
      if (!gameSnap.exists()) return; // Game already deleted or does not exist

      let gameState = gameSnap.data() as GameState;
      if (gameState.phase !== 'lobby') throw new Error('Cannot leave a game that has started');

      const playerLeaving = gameState.players.find((p) => p.uid === playerId);
      if (!playerLeaving) return; // Player not in game, do nothing

      const remainingPlayers = gameState.players.filter((p) => p.uid !== playerId);

      if (remainingPlayers.length === 0) {
        // Last player left, delete the game
        transaction.delete(gameRef);
      } else {
        // If the creator is leaving, assign a new one
        if (playerLeaving.isCreator) {
            const sortedPlayers = remainingPlayers.sort((a, b) => a.seatIndex - b.seatIndex);
            if (sortedPlayers.length > 0) {
                sortedPlayers[0].isCreator = true;
            }
        }
        
        // Re-index seats
        const finalPlayers = remainingPlayers.map((p, index) => ({...p, seatIndex: index}));
        
        transaction.update(gameRef, { players: finalPlayers });
      }
    });
  } catch (error) {
    console.error('Error leaving game:', error);
    if (error instanceof Error) throw error;
    throw new Error('Failed to leave the game.');
  }
}

/**
 * Resets a finished game back to the lobby state.
 */
export async function resetGame(gameId: string, initiatorPlayerId: string) {
    const gameRef = doc(firestore, 'games', gameId);

    try {
        await runTransaction(firestore, async (transaction) => {
            const gameSnap = await transaction.get(gameRef);
            if (!gameSnap.exists()) throw new Error("Game not found");
            
            const gameState = gameSnap.data() as GameState;
            
            // Only allow reset if the game is finished or in lobby
            if (gameState.phase === 'playing') {
                 throw new Error("Cannot reset a game that is currently being played.");
            }

            const playerExists = gameState.players.some(p => p.uid === initiatorPlayerId);
            if (!playerExists) {
                throw new Error("Player not found in game.");
            }

            // Reset all players, and set the initiator as the new creator
            const players = gameState.players.map(p => ({
                ...p,
                role: 'DETECTIVE',
                color: '#CCCCCC',
                tickets: { AUTO: 0, BUS: 0, METRO: 0, FERRY: 0, BLACK: 0, DOUBLE: 0 },
                currentNodeId: 0,
                isCreator: p.uid === initiatorPlayerId, // New creator
                isMakingDoubleMove: false,
                isStuck: false,
            }));

            // Re-index seats to be contiguous
            const sortedPlayers = players.sort((a, b) => (a.isCreator ? -1 : b.isCreator ? 1 : 0));
            const finalPlayers = sortedPlayers.map((p, index) => ({ ...p, seatIndex: index }));

            const resetState = {
                phase: 'lobby',
                round: 0,
                turnSeatIndex: 0,
                mrXHistory: [],
                mrXLastRevealedPosition: null,
                winner: null,
                players: finalPlayers,
            };

            transaction.update(gameRef, resetState);
        });
    } catch(error) {
        console.error("Error resetting game:", error);
        if (error instanceof Error) throw error;
        throw new Error("Failed to reset the game.");
    }
}


/**
 * Starts the game, assigning roles and initial positions.
 */
export async function startGame(gameId: string) {
    const gameRef = doc(firestore, 'games', gameId);
    
    try {
        await runTransaction(firestore, async (transaction) => {
            const gameSnap = await transaction.get(gameRef);
            if (!gameSnap.exists()) throw new Error("Game not found");

            const gameState = gameSnap.data() as GameState;

            if (gameState.phase !== 'lobby') throw new Error("Game has already started.");
            if (gameState.players.length < 2 || gameState.players.length > 6) {
                throw new Error("Invalid number of players. Must be between 2 and 6.");
            }

            // 1. Assign Mr. X randomly from the list of players.
            const players = [...gameState.players];
            const mrXIndex = Math.floor(Math.random() * players.length);
            
            // Temporarily remove Mr. X to reorder the array easily
            const mrXPlayer = players.splice(mrXIndex, 1)[0];
            
            // Shuffle the remaining players (detectives) to randomize turn order
            for (let i = players.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [players[i], players[j]] = [players[j], players[i]];
            }

            // Add Mr. X to the front, making his seatIndex 0
            players.unshift(mrXPlayer);

            const detectiveColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6'];
            let colorIndex = 0;

            // 2. Assign roles, tickets, and colors
            const updatedPlayers = players.map((player, index) => {
                if (index === 0) { // Mr. X
                    return {
                        ...player,
                        role: 'MRX',
                        seatIndex: 0,
                        color: '#000000',
                        tickets: { AUTO: 7, BUS: 5, METRO: 4, FERRY: 2, BLACK: 5, DOUBLE: 1 },
                        isMakingDoubleMove: false,
                        isStuck: false,
                    } as Player;
                } else { // Detectives
                    const detectiveColor = detectiveColors[colorIndex % detectiveColors.length];
                    colorIndex++;
                    return {
                        ...player,
                        role: 'DETECTIVE',
                        seatIndex: index,
                        color: detectiveColor,
                        tickets: { AUTO: 10, BUS: 6, METRO: 5, FERRY: 0, BLACK: 0, DOUBLE: 0 },
                        isStuck: false,
                    } as Player;
                }
            });

            // 3. Assign starting locations
            let availableDetectiveStarts = [...DETECTIVE_START_LOCATIONS];
            let availableMrXStarts = [...MRX_START_LOCATIONS];

            updatedPlayers.forEach(player => {
                let startNodeId;
                if (player.role === 'MRX') {
                    const startNodeIndex = Math.floor(Math.random() * availableMrXStarts.length);
                    startNodeId = availableMrXStarts.splice(startNodeIndex, 1)[0];
                } else {
                    const startNodeIndex = Math.floor(Math.random() * availableDetectiveStarts.length);
                    startNodeId = availableDetectiveStarts.splice(startNodeIndex, 1)[0];
                }
                player.currentNodeId = startNodeId;

                // Ensure Mr. X doesn't start on a detective's starting spot by removing it from the other pool
                if (player.role === 'MRX') {
                    availableDetectiveStarts = availableDetectiveStarts.filter(id => id !== startNodeId);
                } else {
                    availableMrXStarts = availableMrXStarts.filter(id => id !== startNodeId);
                }
            });
            
            // 4. Final state update
            const finalGameStateUpdate = {
                phase: 'playing',
                round: 1,
                turnSeatIndex: 0, // Mr. X always starts
                players: updatedPlayers,
            };
            
            transaction.update(gameRef, finalGameStateUpdate);
        });
    } catch (error) {
        console.error("Error starting game:", error);
        if (error instanceof Error) throw error;
        throw new Error("Failed to start game.");
    }
}

function hasValidMoves(player: Player, board: GameState['board'], allPlayers: Player[]): boolean {
    const possibleEdges = board.edges.filter(e => e.from === player.currentNodeId);
    if (possibleEdges.length === 0) return false;

    // A player can move if they have a ticket for any edge, and if the destination is valid.
    return possibleEdges.some(edge => {
        const hasDirectTicket = player.tickets[edge.transport] > 0;
        const hasBlackTicket = player.role === 'MRX' && player.tickets.BLACK > 0;
        
        if (!hasDirectTicket && !hasBlackTicket) {
            return false; // No ticket for this specific route
        }

        // For detectives, check if the destination is occupied by another ACTIVE detective.
        if (player.role === 'DETECTIVE') {
            const isOccupied = allPlayers.some(p => 
                p.uid !== player.uid && 
                p.role === 'DETECTIVE' && 
                !p.isStuck && // A player can move to a node with a STUCK detective
                p.currentNodeId === edge.to
            );
            return !isOccupied; // Valid move if destination is NOT occupied by an active detective.
        }

        // Mr. X can always move if he has a ticket.
        return true;
    });
}


export async function makeMove(
    gameId: string, 
    playerId: string, 
    toNodeId: number, 
    transport: TransportType | 'DOUBLE', 
    firstMoveTransport?: TransportType
) {
    const gameRef = doc(firestore, 'games', gameId);

    try {
        await runTransaction(firestore, async (transaction) => {
            const gameSnap = await transaction.get(gameRef);
            if (!gameSnap.exists()) {
                throw new Error("Game not found!");
            }

            let gameState = gameSnap.data() as GameState;
            
            let { players, turnSeatIndex, round, board, mrXHistory, revealRounds, roundLimit, winner } = gameState;
            const currentPlayerIndex = players.findIndex(p => p.seatIndex === turnSeatIndex);
            
            if (currentPlayerIndex === -1) throw new Error("Current player not found.");
            const activePlayer = players[currentPlayerIndex];

            if (activePlayer.uid !== playerId) throw new Error("It's not your turn.");
            if (activePlayer.isStuck) throw new Error("You are stuck and cannot make a move.");
            if (gameState.phase !== 'playing') throw new Error("The game is not currently active.");
            
            const fromNodeId = activePlayer.currentNodeId;

            // --- Double Move Logic ---
            if (transport === 'DOUBLE') {
                if (activePlayer.role !== 'MRX') throw new Error("Only Mr. X can use Double Move.");
                if (activePlayer.tickets.DOUBLE < 1) throw new Error("No DOUBLE tickets left.");

                 const isFirstLegValid = board.edges.some(edge => 
                    edge.from === fromNodeId && edge.to === toNodeId
                );
                if (!isFirstLegValid) throw new Error("Invalid first move for Double Move. No path exists.");

                players[currentPlayerIndex].currentNodeId = toNodeId;
                players[currentPlayerIndex].tickets.DOUBLE--;
                players[currentPlayerIndex].isMakingDoubleMove = true;
                
                mrXHistory.push({ round: round, transport: 'DOUBLE', toNodeId, revealed: revealRounds.includes(round) });

                transaction.update(gameRef, {
                    players: players,
                    mrXHistory: mrXHistory,
                });
                return; // End transaction here, player will take another turn
            }

            // --- Regular & Second-Part-of-Double Move ---
            const isBlackTicketMove = transport === 'BLACK';
            const isSecondDoubleMove = activePlayer.isMakingDoubleMove;

            if (isBlackTicketMove && activePlayer.role !== 'MRX') throw new Error("Only Mr. X can use Black tickets.");
            
            if (!isSecondDoubleMove) {
                const ticketToUse = isBlackTicketMove ? 'BLACK' : transport;
                if (activePlayer.tickets[ticketToUse] < 1) throw new Error(`You don't have any ${ticketToUse} tickets.`);
            }

            const isValidMove = board.edges.some(edge => {
                if (edge.from !== fromNodeId || edge.to !== toNodeId) return false;
                if (isSecondDoubleMove) return true;
                if (isBlackTicketMove) return true;
                return edge.transport === transport;
            });
            if (!isValidMove) throw new Error("Invalid move. No such route exists.");

            if (activePlayer.role === 'DETECTIVE') {
                 const isOccupied = players.some(p => p.role === 'DETECTIVE' && p.uid !== activePlayer.uid && !p.isStuck && p.currentNodeId === toNodeId);
                 if (isOccupied) {
                    throw new Error("Detectives cannot share the same location.");
                 }
            }
            
            // --- Update Player State ---
            players[currentPlayerIndex].currentNodeId = toNodeId;
            if (!isSecondDoubleMove) {
                const ticketToUse = isBlackTicketMove ? 'BLACK' : transport;
                players[currentPlayerIndex].tickets[ticketToUse]--;
            } else {
                players[currentPlayerIndex].isMakingDoubleMove = false; // End of double move
            }

            if (activePlayer.role === 'MRX') {
                const isRevealed = revealRounds.includes(round);
                mrXHistory.push({ round: round, transport, toNodeId, revealed: isRevealed });

                if (isRevealed) {
                    gameState.mrXLastRevealedPosition = board.nodes.find(n => n.id === toNodeId) || null;
                }
            } else {
                 // Give used ticket to Mr. X
                const mrxIndex = players.findIndex(p => p.role === 'MRX');
                if(mrxIndex > -1){
                    const ticketToUse = isBlackTicketMove ? 'BLACK' : transport;
                    players[mrxIndex].tickets[ticketToUse]++;
                }
            }

            // --- Check for Detective Win (Capture) ---
            const mrX = players.find(p => p.role === 'MRX')!;
            if (players.some(p => p.role === 'DETECTIVE' && p.currentNodeId === mrX.currentNodeId)) {
                gameState.phase = 'finished';
                gameState.winner = 'DETECTIVE';
                gameState.mrXLastRevealedPosition = board.nodes.find(n => n.id === mrX.currentNodeId) || null;
                transaction.update(gameRef, { 
                    players: players,
                    phase: 'finished', 
                    winner: 'DETECTIVE', 
                    mrXLastRevealedPosition: gameState.mrXLastRevealedPosition 
                });
                return;
            }

            // --- Advance Turn and check for stuck players ---
            let nextTurnSeatIndex = turnSeatIndex;
            let currentRound = round;

            // This loop ensures we find the next available player or end the game.
            for (let i = 0; i < players.length; i++) {
                nextTurnSeatIndex = (nextTurnSeatIndex + 1) % players.length;

                // Advance round if we've completed a full circle and it's Mr. X's turn again
                if (nextTurnSeatIndex === 0) {
                    currentRound++;
                }

                const nextPlayer = players.find(p => p.seatIndex === nextTurnSeatIndex)!;
                if (!hasValidMoves(nextPlayer, board, players)) {
                    // Mark player as stuck and continue to find the next valid player
                    const stuckPlayerIndex = players.findIndex(p => p.uid === nextPlayer.uid);
                    if (stuckPlayerIndex !== -1 && !players[stuckPlayerIndex].isStuck) {
                        players[stuckPlayerIndex].isStuck = true;
                    }
                } else {
                    // Found a valid player, their turn begins
                    break;
                }
            }
            
            gameState.turnSeatIndex = nextTurnSeatIndex;
            gameState.round = currentRound;
            gameState.players = players;

            // --- Check for Game Over Conditions ---
            // 1. Mr. X wins if all detectives are stuck
            const detectives = players.filter(p => p.role === 'DETECTIVE');
            if (detectives.every(d => d.isStuck)) {
                winner = 'MRX';
            }

            // 2. Mr. X wins by rounds
            if (gameState.round > roundLimit) {
                winner = 'MRX';
            }
            
            if (winner) {
                 gameState.phase = 'finished';
                 gameState.winner = winner;
            }

            // Final state update
            transaction.update(gameRef, gameState);
        });
    } catch (error) {
        console.error("Failed to make move:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred while making the move.");
    }
}

export async function makeRandomMove(gameId: string, playerId: string) {
    const gameRef = doc(firestore, 'games', gameId);
    
    try {
        await runTransaction(firestore, async (transaction) => {
            const gameSnap = await transaction.get(gameRef);
            if (!gameSnap.exists()) throw new Error("Game not found");
        
            const gameState = gameSnap.data() as GameState;
            const player = gameState.players.find(p => p.uid === playerId);
            if (!player) throw new Error("Player not found.");
            if (player.isStuck) return; // Should not happen if logic is correct
        
            const validMoves = gameState.board.edges
                .filter(edge => {
                    if (edge.from !== player.currentNodeId) return false;

                    const hasDirectTicket = player.tickets[edge.transport] > 0;
                    if (!hasDirectTicket) return false;

                    if (player.role === 'DETECTIVE') {
                        const isOccupied = gameState.players.some(p => 
                            p.uid !== player.uid && 
                            p.role === 'DETECTIVE' && 
                            !p.isStuck &&
                            p.currentNodeId === edge.to
                        );
                        return !isOccupied;
                    }
                    return true;
                })
                .map(edge => ({ to: edge.to, transport: edge.transport as TransportType }));
            
            if (player.role === 'MRX' && player.tickets.BLACK > 0) {
                gameState.board.edges
                    .filter(edge => edge.from === player.currentNodeId)
                    .forEach(edge => {
                        if (!validMoves.some(m => m.to === edge.to)) {
                            validMoves.push({ to: edge.to, transport: 'BLACK' });
                        }
                    });
            }
        
            if (validMoves.length === 0) {
                // This case should be handled by the stuck logic at the start of makeMove
                console.warn(`${player.name} is making a random move but has no valid moves.`);
                // Mark player as stuck as a fallback
                 const playerIndex = gameState.players.findIndex(p => p.uid === player.uid);
                 gameState.players[playerIndex].isStuck = true;
                 gameState.turnSeatIndex = (gameState.turnSeatIndex + 1) % gameState.players.length;
                 transaction.update(gameRef, { players: gameState.players, turnSeatIndex: gameState.turnSeatIndex });
                return; 
            }
        
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            
            // Release the transaction lock and call makeMove
            transaction.get(gameRef); // Ensure transaction is used
            
            // Use a promise to avoid holding the transaction open
            await makeMove(gameId, playerId, randomMove.to, randomMove.transport);
        });
    } catch (error) {
        console.error("Failed to make random move:", error);
        if (error instanceof Error) throw error;
        throw new Error("Failed to execute random move.");
    }
}


function generateGameId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

    