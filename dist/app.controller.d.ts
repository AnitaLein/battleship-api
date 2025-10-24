import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getPlayers(): Promise<import("./app.service").Player[]>;
    getPlayer(id: string): Promise<import("./app.service").Player | null>;
    getAttacks(): Promise<import("./app.service").Attack[]>;
    postAttack(body: {
        AttackerId: number;
        DefenderId: number;
        Position: string;
        IsHit: boolean;
    }): Promise<{
        AttackerId: number;
        DefenderId: number;
        Position: string;
        IsHit: boolean;
        id: string;
    }>;
}
