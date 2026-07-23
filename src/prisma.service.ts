import { Injectable, Logger } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import * as path from 'node:path';

@Injectable()
export class PrismaService extends PrismaClient {
  private logger = new Logger('PrismaService');

  constructor() {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

    const adapter = new PrismaBetterSqlite3({
      url: `file:${dbPath}`,
    });
    // const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL});
    super({ adapter });

    this.logger.log(`Database connected at ${dbPath}`);
  }
}