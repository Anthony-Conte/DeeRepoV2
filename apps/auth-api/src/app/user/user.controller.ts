import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';

import { User, UserRole } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered a new user'
  })
  @ApiBody({ type: CreateUserDto })
  public async register(@Body() body: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(
      body.username,
      body.password,
      body.role
    );
  }

  // TODO Fix this
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 201,
    description: 'Returns all users'
  })
  public async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }
}
