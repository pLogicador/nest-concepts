import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigType } from '@nestjs/config';
import globalConfig from 'src/global-config/global.config';

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(globalConfig.KEY)
    private readonly globalConfiguration: ConfigType<typeof globalConfig>,
  ) {}

  // @Get('second')
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('example')
  example() {
    return this.appService.methodExample();
  }
}
