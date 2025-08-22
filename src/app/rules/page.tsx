
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, UserCog, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AutoIcon } from '@/components/icons/auto-icon';
import { BusIcon } from '@/components/icons/bus-icon';
import { MetroIcon } from '@/components/icons/metro-icon';
import { FerryIcon } from '@/components/icons/ferry-icon';
import { BlackTicketIcon } from '@/components/icons/black-ticket-icon';
import { DoubleMoveIcon } from '@/components/icons/double-move-icon';

const RuleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold text-primary mb-2 border-b-2 border-primary/20 pb-1">{title}</h3>
    <div className="space-y-2 text-foreground/90">{children}</div>
  </div>
);

const TicketRule: React.FC<{ icon: React.ReactNode; name: string; description: string; }> = ({ icon, name, description }) => (
    <div className="flex items-start gap-4 p-2 rounded-lg">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-secondary">{icon}</div>
        <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);


export default function RulesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">How to Play: Mumbai Misfit</CardTitle>
          <CardDescription className="text-center">The official rules for the game of pursuit and evasion.</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[65vh] p-4">
                <RuleSection title="Game Objective">
                    <p>
                        Mumbai Misfit is a game for 2-6 players. One player takes on the role of the fugitive, <strong className="text-primary">Mr. X</strong>, while the others are <strong className="text-accent">Detectives</strong>.
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li><strong className="text-accent">Detectives' Goal:</strong> To win, the Detectives must work together to catch Mr. X by moving to the same node he currently occupies.</li>
                        <li><strong className="text-primary">Mr. X's Goal:</strong> To win, Mr. X must evade capture for all 16 rounds of the game. Mr. X also wins if all Detectives become stuck (unable to move).</li>
                    </ul>
                </RuleSection>

                 <RuleSection title="Player Roles">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-card/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><UserCog className="text-primary" /> Mr. X (The Fugitive)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p>You move in secret. Your location is only revealed on specific rounds. Use your special tickets to outsmart the detectives.</p>
                                <p><strong>Initial Tickets:</strong> 7 <span className="text-yellow-500 font-bold">AUTO</span>, 5 <span className="text-green-500 font-bold">BUS</span>, 4 <span className="text-red-500 font-bold">METRO</span>, 2 <span className="text-cyan-500 font-bold">FERRY</span>, 5 <strong className="font-bold">BLACK</strong>, and 1 <span className="text-purple-500 font-bold">DOUBLE</span>.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50">
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="text-accent" /> The Detectives</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p>You work as a team. Your locations are always visible. Use logic and teamwork to corner Mr. X.</p>
                                 <p><strong>Initial Tickets:</strong> 10 <span className="text-yellow-500 font-bold">AUTO</span>, 6 <span className="text-green-500 font-bold">BUS</span>, and 5 <span className="text-red-500 font-bold">METRO</span>.</p>
                            </CardContent>
                        </Card>
                    </div>
                </RuleSection>

                 <RuleSection title="Gameplay Flow">
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                        <li><strong>Starting:</strong> One player is randomly chosen as Mr. X. All players are placed at random starting locations.</li>
                        <li><strong>Turns:</strong> Mr. X always takes the first turn of a round, followed by each Detective in order.</li>
                        <li><strong>Movement:</strong> On your turn, use a transport ticket to move to an adjacent node along a colored route. Detectives give their used tickets to Mr. X.</li>
                        <li><strong>Detective Rule:</strong> Two Detectives cannot be on the same node at the same time.</li>
                        <li><strong>Mr. X's Reveal:</strong> Mr. X's location is revealed to all players on rounds <strong>3, 8, 13, and 16</strong>. On all other turns, only the type of transport he used is shown in his move log.</li>
                        <li><strong>Getting Stuck:</strong> If a Detective cannot make a valid move (no tickets or all paths blocked), they are 'stuck' and can no longer move. Their pawn is greyed out.</li>
                         <li><strong>Turn Timer:</strong> Each player has 60 seconds to make a move. If the timer runs out, a random valid move will be made automatically.</li>
                    </ol>
                </RuleSection>

                 <RuleSection title="Transport & Special Tickets">
                    <TicketRule icon={<AutoIcon />} name="Auto" description="The most common transport, used for short-distance travel on yellow lines." />
                    <TicketRule icon={<BusIcon />} name="Bus" description="Used for medium-distance travel on green lines." />
                    <TicketRule icon={<MetroIcon />} name="Metro" description="Used for long-distance travel on red dashed lines, connecting major hubs." />
                    <TicketRule icon={<FerryIcon />} name="Ferry (Mr. X Only)" description="Used to cross the river on the solid black lines." />
                    <TicketRule icon={<BlackTicketIcon />} name="Black Ticket (Mr. X Only)" description="A secret ticket! Mr. X can use this to travel on ANY transport line without revealing the type of transport used." />
                    <TicketRule icon={<DoubleMoveIcon />} name="Double Move (Mr. X Only)" description="Allows Mr. X to take two moves in a single turn. The types of transport used in both moves are logged." />
                 </RuleSection>

            </ScrollArea>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button asChild variant="secondary" size="lg">
            <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5"/>
                Back to Lobby
            </Link>
        </Button>
      </div>
    </main>
  );
}
