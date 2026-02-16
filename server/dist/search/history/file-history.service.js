"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var FileHistoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHistoryService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const search_types_1 = require("../search.types");
let FileHistoryService = FileHistoryService_1 = class FileHistoryService {
    logger = new common_1.Logger(FileHistoryService_1.name);
    filePath = path.resolve(process.cwd(), 'data', 'history.json');
    entries = [];
    async onModuleInit() {
        await this.load();
    }
    async save(query) {
        this.entries.push({ query, timestamp: new Date().toISOString() });
        if (this.entries.length > search_types_1.MAX_HISTORY_ENTRIES) {
            this.entries = this.entries.slice(-search_types_1.MAX_HISTORY_ENTRIES);
        }
        await this.persist();
    }
    async findAll() {
        return [...this.entries];
    }
    async load() {
        try {
            await fs.mkdir(path.dirname(this.filePath), { recursive: true });
            const content = await fs.readFile(this.filePath, 'utf-8');
            const raw = JSON.parse(content);
            if (Array.isArray(raw)) {
                this.entries = raw.slice(-search_types_1.MAX_HISTORY_ENTRIES);
                this.logger.log(`Loaded ${this.entries.length} history entries`);
            }
        }
        catch {
            this.entries = [];
            this.logger.log('No existing history file — starting fresh');
        }
    }
    async persist() {
        await fs.writeFile(this.filePath, JSON.stringify(this.entries, null, 2));
    }
};
exports.FileHistoryService = FileHistoryService;
exports.FileHistoryService = FileHistoryService = FileHistoryService_1 = __decorate([
    (0, common_1.Injectable)()
], FileHistoryService);
//# sourceMappingURL=file-history.service.js.map