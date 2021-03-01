import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';
import CustomersRepository from '../../typeorm/repositories/CustomersRepository';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const customerRepository = container.resolve(CustomersRepository);
    const createCustomerService = new CreateCustomerService(customerRepository);

    const customer = await createCustomerService.execute(request.body);

    return response.send(customer);
  }
}
