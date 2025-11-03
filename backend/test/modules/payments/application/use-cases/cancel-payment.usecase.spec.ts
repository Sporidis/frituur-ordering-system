import { Test, TestingModule } from '@nestjs/testing';
import { CancelPaymentUseCase } from '@modules/payments/application/use-cases/cancel-payment.usecase';
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

describe('CancelPaymentUseCase', () => {
  let useCase: CancelPaymentUseCase;
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
        CancelPaymentUseCase,
        { provide: PAYMENT_REPOSITORY, useValue: mockRepository },
        { provide: PAYMENT_GATEWAY, useValue: mockGateway },
      ],
    }).compile();

    useCase = module.get<CancelPaymentUseCase>(CancelPaymentUseCase);
    paymentRepository = module.get(PAYMENT_REPOSITORY);
    paymentGateway = module.get(PAYMENT_GATEWAY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should cancel payment successfully', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';

    paymentRepository.findById.mockResolvedValue(payment);
    paymentGateway.cancelPaymentIntent.mockResolvedValue(true);
    paymentRepository.save.mockResolvedValue(payment);

    await useCase.execute(payment.id);

    expect(paymentGateway.cancelPaymentIntent).toHaveBeenCalledWith(
      'pi_test_123',
    );
    expect(payment.status).toBe(PaymentStatus.CANCELLED);
    expect(paymentRepository.save).toHaveBeenCalledWith(payment);
  });

  it('should cancel payment without stripe intent id', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    // No stripePaymentIntentId

    paymentRepository.findById.mockResolvedValue(payment);
    paymentRepository.save.mockResolvedValue(payment);

    await useCase.execute(payment.id);

    expect(paymentGateway.cancelPaymentIntent).not.toHaveBeenCalled();
    expect(payment.status).toBe(PaymentStatus.CANCELLED);
    expect(paymentRepository.save).toHaveBeenCalledWith(payment);
  });

  it('should throw error when payment not found', async () => {
    paymentRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(
      'Payment not found',
    );
  });
});
