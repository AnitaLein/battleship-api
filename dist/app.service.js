"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const firebase_1 = require("./firebase");
let AppService = class AppService {
    playersCollection = firebase_1.db.collection('players');
    attacksCollection = firebase_1.db.collection('attacks');
    async getPlayers() {
        const snapshot = await this.playersCollection.get();
        return snapshot.docs.map((doc) => doc.data());
    }
    async getPlayer(id) {
        const doc = await this.playersCollection.doc(id).get();
        return doc.exists ? doc.data() : null;
    }
    async addAttack(attack) {
        const newDoc = await this.attacksCollection.add(attack);
        return { id: newDoc.id, ...attack };
    }
    async getAttacks() {
        const snapshot = await this.attacksCollection.get();
        return snapshot.docs.map((doc) => doc.data());
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map