import { ForbiddenException, Injectable } from '@nestjs/common';

import {
  User,
  Bookmark,
  PrismaClient,
  Prisma,
  PrismaPromise,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        //   select: {
        //     id:true,
        //     email:true,
        //     createdAt:true
        //   }
      });
      //   delete user.hash;
      //   return user;
      return this.singToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `Credentials taken, ${error.meta.target}`,
          );
        }
      }
      throw error;
    }
  }

  async signIn(dto: AuthDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (!user)
      throw new ForbiddenException('credentials incorrect - (email not found)');

    const pwMatch = await argon.verify(user.hash, dto.password);
    if (!pwMatch)
      throw new ForbiddenException(
        'credentials incorrect - (password incorrect)',
      );

    // delete user.hash;
    // return user;
    return this.singToken(user.id, user.email);
  }

  async singToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT'),
    });

    return {
      access_token: token,
    };
  }
}
