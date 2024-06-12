import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtSharedModule } from '~jwt/jwt-shared.module';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { NoteEntity } from './entities/note.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([NoteEntity]),
    JwtSharedModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
