import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsModule } from '@modules/payments/payments.module';
import { I18nModule } from '@modules/i18n/i18n.module';
import { PAYMENT_NEST_CONTROLLERS } from '@modules/payments/presentation/http/controllers';
import { PAYMENT_REPOSITORY } from '@modules/payments/domain/payment-repository.interface';
import { PAYMENT_GATEWAY } from '@modules/payments/domain/ports/payment-gateway.port';

describe('PaymentsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [I18nModule, PaymentsModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should register HTTP controllers', () => {
    for (const ctrl of PAYMENT_NEST_CONTROLLERS) {
      expect(module.get(ctrl)).toBeDefined();
    }
  });

  it('should export repository and gateway tokens', () => {
    expect(module.get(PAYMENT_REPOSITORY)).toBeDefined();
    expect(module.get(PAYMENT_GATEWAY)).toBeDefined();
  });

  it('should have correct module structure', () => {
    const moduleRef = module.get(PaymentsModule);
    expect(moduleRef).toBeDefined();
  });
});
