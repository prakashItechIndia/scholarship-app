import { Test } from '@nestjs/testing';

import { auditEvent } from '@icaptur/database-schema';
import { AuditService } from './audit.service';
import { DatabaseService } from '../../database/database.service';

describe('AuditService', () => {
  it('writes audit events with defaults', async () => {
    const insertMock = jest.fn().mockReturnThis();
    const valuesMock = jest.fn().mockResolvedValue(undefined);
    insertMock.mockReturnValue({ values: valuesMock });

    const module = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              insert: insertMock,
            },
          },
        },
      ],
    }).compile();

    const service = module.get(AuditService);

    await service.record('auth/login', {
      tenantId: 'tenant-1',
      actorUserId: 'user-1',
      payload: { foo: 'bar' },
    });

    expect(insertMock).toHaveBeenCalledWith(auditEvent);
    expect(valuesMock).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      actorUserId: 'user-1',
      eventType: 'auth/login',
      eventPayload: { foo: 'bar' },
      ip: null,
      userAgent: null,
    });
  });
});
