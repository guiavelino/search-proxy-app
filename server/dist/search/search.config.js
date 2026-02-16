"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationPipeConfig = validationPipeConfig;
const common_1 = require("@nestjs/common");
function validationPipeConfig() {
    return new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    });
}
//# sourceMappingURL=search.config.js.map