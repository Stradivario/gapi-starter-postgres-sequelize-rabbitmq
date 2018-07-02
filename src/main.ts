import { AppModule } from './app/app.module';
import { BootstrapFramework } from '@gapi/core';
import { FrameworkImports } from './framework-imports';

BootstrapFramework(AppModule, [FrameworkImports], {
    init: true,
    initOptions: {
        effects: true,
        plugins: true,
        services: true,
        controllers: true
    },
    logger: {
        logging: true,
        date: true,
        exitHandler: true,
        fileService: true,
        hashes: true
    }
})
.subscribe(
    () => console.log('Started!'),
    (e) => console.error(e)
);