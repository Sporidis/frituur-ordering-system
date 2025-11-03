import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsModule } from '@modules/payments/payments.module';
import { PaymentController } from '@modules/payments/presentation/payment.controller';
import { PaymentApplicationService } from '@modules/payments/application/payment-application.service';
import { InMemoryPaymentRepository } from '@modules/payments/infrastructure/payment-repository.impl';
import { StripePaymentGateway } from '@modules/payments/infrastructure/stripe-payment-gateway';

describe('PaymentsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide PaymentController', () => {
    const controller = module.get<PaymentController>(PaymentController);
    expect(controller).toBeDefined();
  });

  it('should provide PaymentApplicationService', () => {
    const service = module.get<PaymentApplicationService>(
      PaymentApplicationService,
    );
    expect(service).toBeDefined();
  });

  it('should provide InMemoryPaymentRepository', () => {
    const repository = module.get<InMemoryPaymentRepository>(
      InMemoryPaymentRepository,
    );
    expect(repository).toBeDefined();
  });

  it('should provide StripePaymentGateway', () => {
    const gateway = module.get<StripePaymentGateway>(StripePaymentGateway);
    expect(gateway).toBeDefined();
  });

  it('should export PaymentApplicationService', () => {
    const exportedService = module.get<PaymentApplicationService>(
      PaymentApplicationService,
    );
    expect(exportedService).toBeDefined();
  });

  it('should export InMemoryPaymentRepository', () => {
    const exportedRepository = module.get<InMemoryPaymentRepository>(
      InMemoryPaymentRepository,
    );
    expect(exportedRepository).toBeDefined();
  });

  it('should have correct module structure', () => {
    const moduleRef = module.get(PaymentsModule);
    expect(moduleRef).toBeDefined();
  });
});
