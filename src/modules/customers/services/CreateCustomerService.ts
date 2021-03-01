import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const emailExists = await this.customersRepository.findByEmail(email);

    if (!emailExists) {
      const customer = await this.customersRepository.create({ name, email });

      return customer;
    }

    throw new AppError('Email already exists', 400);
  }
}
export default CreateCustomerService;
