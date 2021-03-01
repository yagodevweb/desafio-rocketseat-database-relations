import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import ProductsRepository from '../../typeorm/repositories/ProductsRepository';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const productsRepository = container.resolve(ProductsRepository);
    const createProductService = new CreateProductService(productsRepository);

    const product = await createProductService.execute(request.body);

    return response.send(product);
  }
}
