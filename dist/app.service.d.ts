export type Boat = {
    id: number;
    length: number;
    positions: string[];
};
export type Attack = {
    AttackerId: number;
    DefenderId: number;
    Position: string;
    IsHit: boolean;
};
export type Player = {
    id: number;
    name: string;
    boats: Boat[];
    attacks: Attack[];
};
export declare class AppService {
    private playersCollection;
    private attacksCollection;
    getPlayers(): Promise<Player[]>;
    getPlayer(id: string): Promise<Player | null>;
    addAttack(attack: Attack): Promise<{
        AttackerId: number;
        DefenderId: number;
        Position: string;
        IsHit: boolean;
        id: string;
    }>;
    getAttacks(): Promise<Attack[]>;
}
