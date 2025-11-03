import { Test, TestingModule } from '@nestjs/testing';
import { SyncStatusUseCase } from '@modules/payments/application/use-cases/sync-status.usecase';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';
import { Payment } from '@modules/payments/domain/payment.entity';
import { PaymentStatus } from '@modules/payments/domain/payment-status.enum';
import { Money } from '@shared/domain/value-objects/money';

describe('SyncStatusUseCase', () => {
  let useCase: SyncStatusUseCase;
  let paymentRepository: jest.Mocked<IPaymentRepository>;
  let paymentGateway: jest.Mocked<PaymentGatewayPort>;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      findByCustomerId: jest.fn(),
    };

    const mockGateway = {
      createPaymentIntent: jest.fn(),
      confirmPaymentIntent: jest.fn(),
      cancelPaymentIntent: jest.fn(),
      createRefund: jest.fn(),
      getPaymentIntent: jest.fn(),
      constructWebhookEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncStatusUseCase,
        { provide: PAYMENT_REPOSITORY, useValue: mockRepository },
        { provide: PAYMENT_GATEWAY, useValue: mockGateway },
      ],
    }).compile();

    useCase = module.get<SyncStatusUseCase>(SyncStatusUseCase);
    paymentRepository = module.get(PAYMENT_REPOSITORY);
    paymentGateway = module.get(PAYMENT_GATEWAY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should sync status to succeeded', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';

    // Set payment to processing to allow markAsSucceeded inside use case
    payment.markAsProcessing('pi_test_123');
    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.getPaymentIntent.mockResolvedValue({
      id: 'pi_test_123',
      status: 'succeeded',
      amount: 1050,
      currency: 'eur',
    });
    paymentRepository.save.mockResolvedValue(payment);

    const result = await useCase.execute('pi_test_123');

    expect(result.paymentId).toBe(payment.id);
    expect(result.status).toBe(PaymentStatus.SUCCEEDED);
    expect(paymentGateway.getPaymentIntent).toHaveBeenCalledWith('pi_test_123');
    expect(paymentRepository.save).toHaveBeenCalledWith(payment);
  });

  it('should sync status to cancelled', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';

    payment.markAsProcessing('pi_test_123');
    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.getPaymentIntent.mockResolvedValue({
      id: 'pi_test_123',
      status: 'canceled',
      amount: 1050,
      currency: 'eur',
    });
    paymentRepository.save.mockResolvedValue(payment);

    const result = await useCase.execute('pi_test_123');

    expect(result.paymentId).toBe(payment.id);
    expect(result.status).toBe(PaymentStatus.CANCELLED);
  });

  it('should sync status to failed when requires_payment_method', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';

    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.getPaymentIntent.mockResolvedValue({
      id: 'pi_test_123',
      status: 'requires_payment_method',
      amount: 1050,
      currency: 'eur',
    });
    paymentRepository.save.mockResolvedValue(payment);

    const result = await useCase.execute('pi_test_123');

    expect(result.paymentId).toBe(payment.id);
    expect(result.status).toBe(PaymentStatus.FAILED);
  });

  it('should throw error when payment not found', async () => {
    paymentRepository.findAll.mockResolvedValue([]);

    await expect(useCase.execute('pi_test_123')).rejects.toThrow(
      'Payment not found',
    );
  });
});
