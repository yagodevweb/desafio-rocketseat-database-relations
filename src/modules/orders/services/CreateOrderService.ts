import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustormersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Customer not exists', 400);
    }

    const productsRegistered = await this.productsRepository.findAllById(
      products,
    );

    if (!productsRegistered || productsRegistered.length !== products.length) {
      throw new AppError('There is invalid products', 400);
    }

    for (let i = 0; i < products.length; i += 1) {
      const product = productsRegistered.filter(
        value => value.id === products[i].id,
      );

      if (product[0].quantity < products[i].quantity) {
        throw new AppError('Invalid product quantity', 400);
      }
    }

    const updateQuantities = products.map(product => {
      const { price = 0, quantity = 0 } = productsRegistered.filter(
        value => value.id === product.id,
      )[0];

      return {
        id: product.id,
        price,
        quantity: quantity - product.quantity,
      };
    });

    await this.productsRepository.updateQuantity(updateQuantities);

    const formattedProducts = products.map(product => {
      const { price = 0 } = productsRegistered.filter(
        value => value.id === product.id,
      )[0];

      return {
        product_id: product.id,
        price,
        quantity: product.quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: formattedProducts,
    });

    return order;
  }
}

export default CreateOrderService;
