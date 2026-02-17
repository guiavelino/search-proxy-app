"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const app_config_1 = require("./app.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes((0, app_config_1.validationPipeConfig)());
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    common_1.Logger.log(`Server running on port ${port}`, 'Bootstrap');
}
bootstrap().catch((error) => {
    common_1.Logger.error('Failed to start application', error, 'Bootstrap');
    process.exit(1);
});
//# sourceMappingURL=main.js.map