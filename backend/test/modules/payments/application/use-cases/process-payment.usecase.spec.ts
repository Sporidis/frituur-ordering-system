import { Test, TestingModule } from '@nestjs/testing';
import { ProcessPaymentUseCase } from '@modules/payments/application/use-cases/process-payment.usecase';
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

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
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
        ProcessPaymentUseCase,
        { provide: PAYMENT_REPOSITORY, useValue: mockRepository },
        { provide: PAYMENT_GATEWAY, useValue: mockGateway },
      ],
    }).compile();

    useCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
    paymentRepository = module.get(PAYMENT_REPOSITORY);
    paymentGateway = module.get(PAYMENT_GATEWAY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should process payment successfully', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    payment.markAsProcessing('pi_test_123');

    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.confirmPaymentIntent.mockResolvedValue({
      success: true,
      status: 'succeeded',
    });
    paymentRepository.save.mockResolvedValue(payment);

    const dto = {
      paymentId: 'pi_test_123',
      paymentMethodId: 'pm_test_123',
      customerName: 'John Doe',
    } as any;

    const result = await useCase.execute(dto);

    expect(result.paymentId).toBe(payment.id);
    expect(result.status).toBe(PaymentStatus.SUCCEEDED);
    expect(paymentGateway.confirmPaymentIntent).toHaveBeenCalledWith(
      'pi_test_123',
      'pm_test_123',
    );
    expect(paymentRepository.save).toHaveBeenCalled();
  });

  it('should handle payment requiring action', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    payment.markAsProcessing('pi_test_123');

    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.confirmPaymentIntent.mockResolvedValue({
      success: false,
      status: 'requires_action',
    });
    paymentRepository.save.mockResolvedValue(payment);

    const dto = {
      paymentId: 'pi_test_123',
      paymentMethodId: 'pm_test_123',
      customerName: 'John Doe',
    } as any;

    const result = await useCase.execute(dto);

    expect(result.paymentId).toBe(payment.id);
    expect(payment.status).toBe(PaymentStatus.PROCESSING);
  });

  it('should mark payment as failed when status is not succeeded', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );
    payment.markAsProcessing('pi_test_123');

    paymentRepository.findAll.mockResolvedValue([payment]);
    paymentGateway.confirmPaymentIntent.mockResolvedValue({
      success: false,
      status: 'failed',
    });
    paymentRepository.save.mockResolvedValue(payment);

    const dto = {
      paymentId: 'pi_test_123',
      paymentMethodId: 'pm_test_123',
      customerName: 'John Doe',
    } as any;

    const result = await useCase.execute(dto);

    expect(result.paymentId).toBe(payment.id);
    expect(result.status).toBe(PaymentStatus.FAILED);
  });

  it('should throw error when payment not found', async () => {
    paymentRepository.findAll.mockResolvedValue([]);

    const dto = {
      paymentId: 'pi_test_123',
      paymentMethodId: 'pm_test_123',
    };

    await expect(useCase.execute(dto as any)).rejects.toThrow(
      'Payment not found',
    );
  });
});
