import { Test, TestingModule } from '@nestjs/testing';
import { GetPaymentUseCase } from '@modules/payments/application/use-cases/get-payment.usecase';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import { Payment } from '@modules/payments/domain/payment.entity';
import { Money } from '@shared/domain/value-objects/money';

describe('GetPaymentUseCase', () => {
  let useCase: GetPaymentUseCase;
  let paymentRepository: jest.Mocked<IPaymentRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      findByCustomerId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPaymentUseCase,
        { provide: PAYMENT_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<GetPaymentUseCase>(GetPaymentUseCase);
    paymentRepository = module.get(PAYMENT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should get payment by id', async () => {
    const payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer-1',
      'order-1',
    );

    paymentRepository.findById.mockResolvedValue(payment);

    const result = await useCase.execute(payment.id);

    expect(result).toBe(payment);
    expect(paymentRepository.findById).toHaveBeenCalledWith(payment.id);
  });

  it('should return null when payment not found', async () => {
    paymentRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('invalid-id');

    expect(result).toBeNull();
  });
});
