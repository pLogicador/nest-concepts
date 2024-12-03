import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from 'src/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { PersonsModule } from 'src/persons/persons.module';
import globalConfig from 'src/global-config/global.config';
import { GlobalConfigModule } from 'src/global-config/global-config.module';

@Module({
  imports: [
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig)],
      inject: [globalConfig.KEY],
      useFactory: async (
        globalConfigurations: ConfigType<typeof globalConfig>,
      ) => {
        return {
          type: globalConfigurations.database.type,
          host: globalConfigurations.database.host,
          port: globalConfigurations.database.port,
          database: globalConfigurations.database.database,
          username: globalConfigurations.database.username,
          password: globalConfigurations.database.password,
          autoLoadEntities: globalConfigurations.database.autoLoadEntities,
          synchronize: globalConfigurations.database.synchronize,
        };
      },
    }),
    MessagesModule,
    PersonsModule,
    GlobalConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
