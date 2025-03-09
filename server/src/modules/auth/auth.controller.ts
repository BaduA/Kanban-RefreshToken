import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { RegisterDTO } from './dto/register.dto';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { JwtRefreshAuthGuard } from 'src/guards/jwt.refresh.guard';
import { cookieConfig, extractRefreshTokenFromCookies } from 'src/utils/cookie';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(req.user, res);
  }
  @Post('register')
  @Public()
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 2, ttl: 60000 },
  })
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  @Public()
  refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return this.authService.generateTokenPair(
      (req.user as any).attributes,
      res,
      extractRefreshTokenFromCookies(req) as string,
      (req.user as any).refreshTokenExpiresAt,
    );
  }
  @Public()
  @Post('clear-auth-cookie')
  clearAuthCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(cookieConfig.refreshToken.name);
  }
}
