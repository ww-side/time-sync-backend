import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventEntity } from './entities/event.entity';
import { JwtSharedModule } from '~jwt/jwt-shared.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([EventEntity]),
    JwtSharedModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
