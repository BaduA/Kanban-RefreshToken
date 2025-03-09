import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { extractRefreshTokenFromCookies } from 'src/utils/cookie';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private userService: UsersService,
    // configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          var jwt = extractRefreshTokenFromCookies(req)
          console.log(jwt)
          return jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'SECRET',
    });
  }

  async validate(payload: any) {
    const authUser = await this.userService.findById(payload.sub);
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return {
      attributes: authUser,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    };
  }
}
