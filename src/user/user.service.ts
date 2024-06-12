import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as process from 'process';
import { validate } from 'class-validator';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { getUserIdFromToken } from '~common/utils/get-user-id-from-token';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);

    await this.userRepository.update(userId, {
      refresh_token: hash,
    });
  }

  async updateAccessToken(refreshToken: string) {
    const userId = getUserIdFromToken(refreshToken, this.jwtService).userId;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        userId,
        username: user.username,
      },
      { secret: process.env.ACCESS_JWT_SECRET, expiresIn: '30m' },
    );

    return { accessToken: accessToken };
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          username,
        },
        { secret: process.env.ACCESS_JWT_SECRET, expiresIn: '30m' },
      ),
      this.jwtService.signAsync(
        {
          userId,
          username,
        },
        { secret: process.env.REFRESH_JWT_SECRET, expiresIn: '30d' },
      ),
    ]);

    await this.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = bcrypt.hashSync(createUserDto.password, 7);

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new BadRequestException('User with this username already exists.');
    }

    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    await this.userRepository.save(user);

    return { message: 'User successfully registered' };
  }

  async logout(token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    await this.userRepository.update(userId, { refresh_token: null });

    return { message: 'User successfully logout' };
  }

  async signIn(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException(`This user doesn't exist.`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.getTokens(user.id, user.username);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async me(token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return { user_id: user.id, username: user.username };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (updateUserDto.username) {
      const existingUserByUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUserByUsername && existingUserByUsername.id !== id) {
        throw new BadRequestException(
          'Username already in use by another user',
        );
      }

      user.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      user.password = bcrypt.hashSync(updateUserDto.password, 7);
    }

    await this.userRepository.save(user);

    return { message: 'User successfully updated' };
  }
}
