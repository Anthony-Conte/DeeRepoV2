/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const token = request.cookies && request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret: string =
        this.configService.getOrThrow<string>('JWT_SECRET');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const payload = this.jwtService.verify(token, { secret });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (request as any).user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    // This Guard responds with true if no problems occurred to allow the request to hit the controller endpoint.
    return true;
  }
}
