import { Test, TestingModule } from '@nestjs/testing';
import { CreateRefundUseCase } from '@modules/payments/application/use-cases/create-refund.usecase';
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

describe('CreateRefundUseCase', () => {
  let useCase: CreateRefundUseCase;
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
        CreateRefundUseCase,
        { provide: PAYMENT_REPOSITORY, useValue: mockRepository },
        { provide: PAYMENT_GATEWAY, useValue: mockGateway },
      ],
    }).compile();

    useCase = module.get<CreateRefundUseCase>(CreateRefundUseCase);
    paymentRepository = module.get(PAYMENT_REPOSITORY);
    paymentGateway = module.get(PAYMENT_GATEWAY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a refund successfully', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';
    payment.markAsProcessing('pi_test_123');
    payment.markAsSucceeded('ch_test_123');

    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.createRefund.mockResolvedValue({
      refundId: 're_test_123',
      status: 'succeeded',
    });

    const result = await useCase.execute(
      'pi_test_123',
      500,
      'customer_request',
    );

    expect(result.refundId).toBe('re_test_123');
    expect(result.status).toBe('succeeded');
    expect(paymentGateway.createRefund).toHaveBeenCalledWith(
      'pi_test_123',
      500,
      'customer_request',
    );
  });

  it('should create partial refund when amount specified', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';
    payment.markAsProcessing('pi_test_123');
    payment.markAsSucceeded('ch_test_123');

    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.createRefund.mockResolvedValue({
      refundId: 're_test_123',
      status: 'succeeded',
    });

    const result = await useCase.execute('pi_test_123', 300);

    expect(result.refundId).toBe('re_test_123');
    expect(paymentGateway.createRefund).toHaveBeenCalledWith(
      'pi_test_123',
      300,
      undefined,
    );
  });

  it('should throw error when payment not found', async () => {
    paymentRepository.findAll.mockResolvedValue([]);

    await expect(useCase.execute('pi_test_123')).rejects.toThrow(
      'Payment not found',
    );
  });

  it('should throw error when payment cannot be refunded', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';
    // Payment is still processing, not succeeded

    paymentRepository.findAll.mockResolvedValue([payment]);

    await expect(useCase.execute('pi_test_123')).rejects.toThrow(
      'Payment cannot be refunded',
    );
  });
});
