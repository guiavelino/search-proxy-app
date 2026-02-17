"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const provider_interface_1 = require("./provider/provider.interface");
const history_interface_1 = require("./history/history.interface");
let SearchService = SearchService_1 = class SearchService {
    searchProvider;
    historyRepository;
    logger = new common_1.Logger(SearchService_1.name);
    constructor(searchProvider, historyRepository) {
        this.searchProvider = searchProvider;
        this.historyRepository = historyRepository;
    }
    async search(query) {
        const results = await this.searchProvider.search(query);
        this.historyRepository.save(query).catch((error) => {
            this.logger.error(`Failed to save history for "${query}"`, error instanceof Error ? error.message : String(error));
        });
        return results;
    }
    async getHistory() {
        return this.historyRepository.findAll();
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(provider_interface_1.SEARCH_PROVIDER)),
    __param(1, (0, common_1.Inject)(history_interface_1.HISTORY_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], SearchService);
//# sourceMappingURL=search.service.js.map