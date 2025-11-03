import { Test, TestingModule } from '@nestjs/testing';
import { HandleWebhookUseCase } from '@modules/payments/application/use-cases/handle-webhook.usecase';
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

describe('HandleWebhookUseCase', () => {
  let useCase: HandleWebhookUseCase;
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
        HandleWebhookUseCase,
        { provide: PAYMENT_REPOSITORY, useValue: mockRepository },
        { provide: PAYMENT_GATEWAY, useValue: mockGateway },
      ],
    }).compile();

    useCase = module.get<HandleWebhookUseCase>(HandleWebhookUseCase);
    paymentRepository = module.get(PAYMENT_REPOSITORY);
    paymentGateway = module.get(PAYMENT_GATEWAY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should handle payment_intent.succeeded event', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';

    payment.markAsProcessing('pi_test_123');
    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.constructWebhookEvent.mockResolvedValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_123',
        },
      },
    } as any);
    paymentRepository.save.mockResolvedValue(payment);

    const result = await useCase.execute({
      rawBody: Buffer.from('test'),
      signature: 'test_sig',
    });

    expect(result.eventType).toBe('payment_intent.succeeded');
    expect(result.processed).toBe(true);
    expect(payment.status).toBe(PaymentStatus.SUCCEEDED);
    expect(paymentRepository.save).toHaveBeenCalledWith(payment);
  });

  it('should handle payment_intent.payment_failed event', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';

    payment.markAsProcessing('pi_test_123');
    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.constructWebhookEvent.mockResolvedValue({
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          id: 'pi_test_123',
          last_payment_error: {
            message: 'Card declined',
          },
        },
      },
    } as any);
    paymentRepository.save.mockResolvedValue(payment);

    const result = await useCase.execute({
      rawBody: Buffer.from('test'),
      signature: 'test_sig',
    });

    expect(result.eventType).toBe('payment_intent.payment_failed');
    expect(result.processed).toBe(true);
    expect(payment.status).toBe(PaymentStatus.FAILED);
  });

  it('should handle payment_intent.canceled event', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    (payment as any)._stripePaymentIntentId = 'pi_test_123';

    payment.markAsProcessing('pi_test_123');
    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.constructWebhookEvent.mockResolvedValue({
      type: 'payment_intent.canceled',
      data: {
        object: {
          id: 'pi_test_123',
        },
      },
    } as any);
    paymentRepository.save.mockResolvedValue(payment);

    const result = await useCase.execute({
      rawBody: Buffer.from('test'),
      signature: 'test_sig',
    });

    expect(result.eventType).toBe('payment_intent.canceled');
    expect(result.processed).toBe(true);
    expect(payment.status).toBe(PaymentStatus.CANCELLED);
  });

  it('should handle unhandled event types', async () => {
    paymentRepository.findAll.mockResolvedValue([]);
    paymentGateway.constructWebhookEvent.mockResolvedValue({
      type: 'charge.succeeded',
      data: {
        object: {},
      },
    } as any);

    const result = await useCase.execute({
      rawBody: Buffer.from('test'),
      signature: 'test_sig',
    });

    expect(result.eventType).toBe('charge.succeeded');
    expect(result.processed).toBe(true);
    expect(paymentRepository.save).not.toHaveBeenCalled();
  });

  it('should handle payment not found in repository', async () => {
    paymentRepository.findAll.mockResolvedValue([]);
    paymentGateway.constructWebhookEvent.mockResolvedValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_123',
        },
      },
    } as any);

    const result = await useCase.execute({
      rawBody: Buffer.from('test'),
      signature: 'test_sig',
    });

    expect(result.processed).toBe(true);
    expect(paymentRepository.save).not.toHaveBeenCalled();
  });
});
