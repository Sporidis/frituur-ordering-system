import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentIntentUseCase } from '@modules/payments/application/use-cases/create-payment-intent.usecase';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';
import { PaymentMethod } from '@modules/payments/domain/payment-method.enum';

describe('CreatePaymentIntentUseCase', () => {
  let useCase: CreatePaymentIntentUseCase;
  let paymentRepository: jest.Mocked<IPaymentRepository>;
  let paymentGateway: jest.Mocked<PaymentGatewayPort>;

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      findByCustomerId: jest.fn(),
      findByOrderId: jest.fn(),
      findByStatus: jest.fn(),
      findByStripePaymentIntentId: jest.fn(),
      findByDateRange: jest.fn(),
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
        CreatePaymentIntentUseCase,
        { provide: PAYMENT_REPOSITORY, useValue: mockRepository },
        { provide: PAYMENT_GATEWAY, useValue: mockGateway },
      ],
    }).compile();

    useCase = module.get<CreatePaymentIntentUseCase>(
      CreatePaymentIntentUseCase,
    );
    paymentRepository = module.get(PAYMENT_REPOSITORY);
    paymentGateway = module.get(PAYMENT_GATEWAY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a payment intent successfully', async () => {
    const mockStripeResult = {
      paymentIntentId: 'pi_test_123',
      clientSecret: 'pi_test_123_secret_456',
    };

    paymentGateway.createPaymentIntent.mockResolvedValue(mockStripeResult);
    paymentRepository.save.mockResolvedValue({
      id: 'payment_123',
      markAsProcessing: jest.fn(),
    } as any);

    const dto = {
      amount: 10.5,
      currency: 'EUR',
      customerId: 'customer_123',
      orderId: 'order_456',
      paymentMethod: PaymentMethod.CARD,
      metadata: { test: true },
    };

    const result = await useCase.execute(dto);

    expect(result.paymentIntentId).toBe('pi_test_123');
    expect(result.clientSecret).toBe('pi_test_123_secret_456');
    expect(paymentGateway.createPaymentIntent).toHaveBeenCalled();
    expect(paymentRepository.save).toHaveBeenCalled();
  });
});
