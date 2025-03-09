import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { Response } from 'express';
import { cookieConfig } from 'src/utils/cookie';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
  async login(user: any, res: Response) {
    return this.generateTokenPair(user, res);
  }
  async register(user: RegisterDTO) {
    var newUserDTO = {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    };
    var newUser = await this.prisma.user.create({ data: newUserDTO });
    return newUser;
  }

  async generateRefreshToken(
    authUserId: string,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUserId },
      { secret: 'SECRET', expiresIn: '30d' },
    );

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      if (
        await this.isRefreshTokenBlackListed(currentRefreshToken, authUserId)
      ) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      await this.prisma.refreshToken.create({
        data: {
          id: await bcrypt.hash(currentRefreshToken, 10),
          expiresAt: currentRefreshTokenExpiresAt,
          userId: authUserId,
        },
      });
    }

    return newRefreshToken;
  }

  private async isRefreshTokenBlackListed(
    refreshToken: string,
    userId: string,
  ) {
    var tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });
    var token = tokens.find((t) => {
      bcrypt.compare(refreshToken, t.id);
    });
    return token;
  }

  async generateTokenPair(
    user: User,
    res: Response,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    res.cookie(
      cookieConfig.refreshToken.name,
      await this.generateRefreshToken(
        user.id,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
      {
        ...cookieConfig.refreshToken.options,
      },
    );

    return {
      access_token: this.jwtService.sign(payload), // JWT module is configured in auth.module.ts for access token.
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
