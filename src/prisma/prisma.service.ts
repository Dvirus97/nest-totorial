import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          //   url: 'mongodb+srv://totorialDb:totorialDb123@bookmart-totorial-db.qaonsjr.mongodb.net/prisma?retryWrites=true&w=majority',
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
