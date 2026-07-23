import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../common';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');
  private readonly whereAvailable = { where: { available: true } }
  constructor(private prisma: PrismaService) {}
  
  async create(createProductDto: CreateProductDto) {
    // console.log({createProductDto});
    const product = await this.prisma.product.create({
      data: createProductDto
    })
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.prisma.product.count(this.whereAvailable);
    const lastPage = Math.ceil( totalPages / limit );


    return {
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit, 
        take: limit,
        ...this.whereAvailable
      }),
      meta: {
        total: totalPages,
        page,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id }
    });

    if(!product) {
      this.logger.log(`Product with id #${id} not found`);
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id, ...this.whereAvailable },
      data: updateProductDto
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product;
  }
}
