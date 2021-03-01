import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import OrdersRepository from '../../typeorm/repositories/OrdersRepository';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const orderRepository = container.resolve(OrdersRepository);

    const findOrderService = new FindOrderService(orderRepository);

    const { id } = request.params;

    const order = await findOrderService.execute({ id });

    return response.send(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const orderRepository = container.resolve(OrdersRepository);
    const productsRepository = container.resolve(ProductsRepository);
    const customersRepository = container.resolve(CustomersRepository);

    const createOrderService = new CreateOrderService(
      orderRepository,
      productsRepository,
      customersRepository,
    );

    const order = await createOrderService.execute(request.body);

    return response.send(order);
  }
}
