import { DynamicModule, Module } from '@nestjs/common';

export type MyDynamicModuleConfigs = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_CONFIG = 'MY_DYNAMIC_CONFIG';

@Module({})
export class MyDynamicModule {
  static register(myModuleConfigs: MyDynamicModuleConfigs): DynamicModule {
    // Here I will use my settings
    console.log('MyDynamicModule', myModuleConfigs);

    return {
      module: MyDynamicModule,
      imports: [],
      providers: [
        {
          provide: MY_DYNAMIC_CONFIG,
          useFactory: async () => {
            console.log('MyDynamicModule: Here you can have your logic');
            await new Promise(res => setTimeout(res, 3000));
            console.log('MyDynamicModule: Ends');

            return myModuleConfigs;
          },
        },
      ],
      controllers: [],
      exports: [MY_DYNAMIC_CONFIG],
    };
  }
}
