import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { NoteEntity } from '~note/entities/note.entity';
import { getUserIdFromToken } from '~common/utils/get-user-id-from-token';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createNoteDto: CreateNoteDto, token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const newNote = this.noteRepository.create({
      ...createNoteDto,
      user_id: userId,
    });
    return await this.noteRepository.save(newNote);
  }

  async findAll(token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    return await this.noteRepository.find({ where: { user_id: userId } });
  }

  async findOne(id: string, token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const result = await this.noteRepository.findOne({ where: { id } });

    if (userId !== result?.user_id) {
      throw new ForbiddenException('Access denied');
    }

    return result;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const note = await this.noteRepository.findOne({ where: { id } });

    if (!note) {
      throw new NotFoundException(`Note with id #${id} not found`);
    }

    if (userId !== note?.user_id) {
      throw new ForbiddenException('Access denied');
    }

    const updatedEvent = { ...note, ...updateNoteDto };
    return await this.noteRepository.save(updatedEvent);
  }

  async remove(id: string, token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const eventToRemove = await this.noteRepository.findOne({ where: { id } });

    if (!eventToRemove) {
      throw new Error(`Note with id #${id} not found`);
    }

    if (userId !== eventToRemove?.user_id) {
      throw new ForbiddenException('Access denied');
    }

    await this.noteRepository.remove(eventToRemove);
  }
}
