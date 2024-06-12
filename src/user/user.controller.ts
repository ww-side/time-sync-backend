import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { AuthGuard } from '~common/guards';
import { getTokenFromAuthHeader } from '~common/utils/get-token-from-auth-header';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('/sign-in')
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.userService.signIn(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Headers('Authorization') authHeader: string) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.userService.me(token);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Headers('Authorization') authHeader: string) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.userService.logout(token);
  }

  @UseGuards(AuthGuard)
  @Post('/update-access-token')
  async updateAccessToken(@Headers('Authorization') authHeader: string) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.userService.updateAccessToken(token);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
