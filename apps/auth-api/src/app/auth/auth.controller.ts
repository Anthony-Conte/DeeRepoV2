import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Res
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto } from './entities/login.entity';
import { AuthenticatedRequest, JwtAuthGuard } from '@org/auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log a user in' })
  @ApiBody({ type: LoginDto })
  public async login(
    @Body() body: LoginDto,
    @Res() response: Response
  ): Promise<void> {
    const accessToken = await this.authService.login(
      body.username,
      body.password
    );
    response
      .cookie('access_token', accessToken.access_token, {
        // This sets the token in browser cookie
        secure: false,
        httpOnly: true,
        maxAge: 60 * 60 * 1000
      })
      .sendStatus(204);
    // .send(accessToken); // this is returned in response
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user data'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(
    @Req()
    req: AuthenticatedRequest
  ): { id: string; username: string; role: string } {
    // TODO make this an actual type
    return {
      id: req.user?.sub,
      username: req.user?.username,
      role: req.user?.role
    };
  }
}
