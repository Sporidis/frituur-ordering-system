import { Test, TestingModule } from '@nestjs/testing';
import { PaymentApplicationService } from '@modules/payments/application/payment-application.service';
import { InMemoryPaymentRepository } from '@modules/payments/infrastructure/payment-repository.impl';
import { StripePaymentGateway } from '@modules/payments/infrastructure/stripe-payment-gateway';
import { Money } from '@shared/domain/value-objects/money';
import { PaymentMethod } from '@modules/payments/domain/payment-method.enum';
import { PaymentStatus } from '@modules/payments/domain/payment-status.enum';

describe('PaymentApplicationService', () => {
  let service: PaymentApplicationService;
  let paymentRepository: InMemoryPaymentRepository;
  let stripeGateway: StripePaymentGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentApplicationService,
        InMemoryPaymentRepository,
        StripePaymentGateway,
      ],
    }).compile();

    service = module.get<PaymentApplicationService>(PaymentApplicationService);
    paymentRepository = module.get<InMemoryPaymentRepository>(
      InMemoryPaymentRepository,
    );
    stripeGateway = module.get<StripePaymentGateway>(StripePaymentGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent successfully', async () => {
      const mockStripeResult = {
        paymentIntentId: 'pi_test_123',
        clientSecret: 'pi_test_123_secret_456',
      };

      jest
        .spyOn(stripeGateway, 'createPaymentIntent')
        .mockResolvedValue(mockStripeResult);

      const createPaymentDto = {
        amount: 10.5,
        currency: 'EUR',
        customerId: 'customer_123',
        orderId: 'order_456',
        paymentMethod: PaymentMethod.CARD,
        metadata: { test: true },
      };

      const result = await service.createPaymentIntent(createPaymentDto);

      expect(result).toEqual(mockStripeResult);
      expect(stripeGateway.createPaymentIntent).toHaveBeenCalledWith(
        expect.any(Money),
        createPaymentDto.customerId,
        createPaymentDto.orderId,
        createPaymentDto.metadata,
      );
    });

    it('should handle errors when creating payment intent', async () => {
      const error = new Error('Stripe API error');
      jest.spyOn(stripeGateway, 'createPaymentIntent').mockRejectedValue(error);

      const createPaymentDto = {
        amount: 10.5,
        currency: 'EUR',
        customerId: 'customer_123',
        orderId: 'order_456',
        paymentMethod: PaymentMethod.CARD,
        metadata: {},
      };

      await expect(
        service.createPaymentIntent(createPaymentDto),
      ).rejects.toThrow('Stripe API error');
    });
  });

  describe('processPayment', () => {
    it('should process a payment successfully', async () => {
      const mockPayment = {
        id: 'payment_123',
        stripePaymentIntentId: 'pi_test_123',
        amount: new Money(10.5, 'EUR'),
        status: PaymentStatus.PROCESSING,
        markAsSucceeded: jest.fn().mockImplementation(() => {
          mockPayment.status = PaymentStatus.SUCCEEDED;
        }),
        markAsFailed: jest.fn(),
      } as any;

      const mockStripeResult = {
        status: 'succeeded',
        chargeId: 'ch_test_123',
      };

      jest.spyOn(paymentRepository, 'findById').mockResolvedValue(mockPayment);
      jest
        .spyOn(stripeGateway, 'confirmPaymentIntent')
        .mockResolvedValue(mockStripeResult);
      jest.spyOn(paymentRepository, 'save').mockResolvedValue(mockPayment);

      const processPaymentDto = {
        paymentId: 'payment_123',
        paymentMethodId: 'pm_test_123',
      };

      const result = await service.processPayment(processPaymentDto);

      expect(result.paymentId).toBe('payment_123');
      expect(result.status).toBe(PaymentStatus.SUCCEEDED);
      expect(mockPayment.markAsSucceeded).toHaveBeenCalledWith('ch_test_123');
      expect(paymentRepository.save).toHaveBeenCalledWith(mockPayment);
    });

    it('should handle payment not found', async () => {
      jest.spyOn(paymentRepository, 'findById').mockResolvedValue(null);

      const processPaymentDto = {
        paymentId: 'nonexistent',
        paymentMethodId: 'pm_test_123',
      };

      await expect(service.processPayment(processPaymentDto)).rejects.toThrow(
        'Payment not found',
      );
    });
  });

  describe('createRefund', () => {
    it('should create a refund successfully', async () => {
      const mockPayment = {
        id: 'payment_123',
        stripePaymentIntentId: 'pi_test_123',
        amount: new Money(10.5, 'EUR'),
        status: PaymentStatus.SUCCEEDED,
        canBeRefunded: jest.fn().mockReturnValue(true),
      } as any;

      const mockRefundResult = {
        refundId: 're_test_123',
        status: 'succeeded',
      };

      jest.spyOn(paymentRepository, 'findAll').mockResolvedValue([mockPayment]);
      jest
        .spyOn(stripeGateway, 'createRefund')
        .mockResolvedValue(mockRefundResult);

      const result = await service.createRefund(
        'pi_test_123',
        5.25,
        'Customer request',
      );

      expect(result).toEqual(mockRefundResult);
      expect(stripeGateway.createRefund).toHaveBeenCalledWith(
        'pi_test_123',
        expect.any(Money),
      );
    });

    it('should handle payment not found for refund', async () => {
      jest.spyOn(paymentRepository, 'findAll').mockResolvedValue([]);

      await expect(service.createRefund('pi_nonexistent')).rejects.toThrow(
        'Payment not found',
      );
    });

    it('should handle payment that cannot be refunded', async () => {
      const mockPayment = {
        id: 'payment_123',
        stripePaymentIntentId: 'pi_test_123',
        status: PaymentStatus.PENDING,
        canBeRefunded: jest.fn().mockReturnValue(false),
      } as any;

      jest.spyOn(paymentRepository, 'findAll').mockResolvedValue([mockPayment]);

      await expect(service.createRefund('pi_test_123')).rejects.toThrow(
        'Payment cannot be refunded',
      );
    });
  });
});
