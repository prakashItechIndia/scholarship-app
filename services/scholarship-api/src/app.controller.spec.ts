import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthResponseDto } from './dto/health-response.dto';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })
      .useMocker((token) => {
        if (token === ConfigService) {
          const getValue = (property: string) => {
            if (property === 'NODE_ENV') {
              return 'test';
            }
            return undefined;
          };

          return {
            get: getValue,
            getOrThrow: getValue,
          };
        }
        return undefined;
      })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return health payload', () => {
      const response = appController.getHealth();
      expect(response).toEqual(
        expect.objectContaining<Partial<HealthResponseDto>>({
          status: 'ok',
          environment: 'test',
        }),
      );
    });
  });
});
