"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchModule = void 0;
const common_1 = require("@nestjs/common");
const search_controller_1 = require("./search.controller");
const search_service_1 = require("./search.service");
const search_provider_interface_1 = require("./provider/search-provider.interface");
const duckduckgo_provider_1 = require("./provider/duckduckgo/duckduckgo.provider");
const history_interface_1 = require("./history/history.interface");
const file_history_service_1 = require("./history/file-history.service");
let SearchModule = class SearchModule {
};
exports.SearchModule = SearchModule;
exports.SearchModule = SearchModule = __decorate([
    (0, common_1.Module)({
        controllers: [search_controller_1.SearchController],
        providers: [
            search_service_1.SearchService,
            {
                provide: search_provider_interface_1.SEARCH_PROVIDER,
                useClass: duckduckgo_provider_1.DuckDuckGoProvider,
            },
            {
                provide: history_interface_1.HISTORY_SERVICE,
                useClass: file_history_service_1.FileHistoryService,
            },
        ],
    })
], SearchModule);
//# sourceMappingURL=search.module.js.map