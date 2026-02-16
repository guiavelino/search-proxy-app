"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var DuckDuckGoProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuckDuckGoProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const REQUEST_TIMEOUT_MS = 10_000;
let DuckDuckGoProvider = DuckDuckGoProvider_1 = class DuckDuckGoProvider {
    logger = new common_1.Logger(DuckDuckGoProvider_1.name);
    baseUrl = 'https://api.duckduckgo.com/';
    async search(query) {
        try {
            const { data } = await axios_1.default.get(this.baseUrl, {
                params: { q: query, format: 'json', no_html: 1 },
                timeout: REQUEST_TIMEOUT_MS,
            });
            return this.parseResponse(data);
        }
        catch (error) {
            this.logger.error(`Failed to fetch results for "${query}"`, error instanceof Error ? error.message : String(error));
            throw new Error(`Search provider failed for query "${query}"`);
        }
    }
    parseResponse(data) {
        const topics = this.flattenTopics(data.RelatedTopics ?? []);
        const all = [...(data.Results ?? []), ...topics];
        return all
            .filter((item) => Boolean(item.FirstURL && item.Text))
            .map((item) => ({
            title: this.extractTitle(item.Text),
            url: item.FirstURL,
        }));
    }
    flattenTopics(topics) {
        return topics.flatMap((topic) => 'Topics' in topic ? topic.Topics : [topic]);
    }
    extractTitle(text) {
        const dashIndex = text.indexOf(' - ');
        return dashIndex > 0 ? text.substring(0, dashIndex) : text;
    }
};
exports.DuckDuckGoProvider = DuckDuckGoProvider;
exports.DuckDuckGoProvider = DuckDuckGoProvider = DuckDuckGoProvider_1 = __decorate([
    (0, common_1.Injectable)()
], DuckDuckGoProvider);
//# sourceMappingURL=duckduckgo.provider.js.map