import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { JWTStrategy } from 'src/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/strategies/jwt.refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '10s' },
    }),
    PrismaModule,
  ],
  providers: [AuthService, LocalStrategy, JWTStrategy,JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
