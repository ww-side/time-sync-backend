import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '~user/user.module';
import { EventModule } from '~event/event.module';
import { NoteModule } from '~note/note.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      database: process.env.DB_NAME,
      synchronize: true,
    }),
    UserModule,
    EventModule,
    NoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
