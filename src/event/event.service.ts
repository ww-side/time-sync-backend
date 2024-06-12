import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventEntity } from './entities/event.entity';
import { getUserIdFromToken } from '~common/utils/get-user-id-from-token';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // private getUserIdFromToken(token: string) {
  //   try {
  //     const decodedToken = this.jwtService.decode(token);
  //     console.log('@decoded token', decodedToken);
  //     return { userId: decodedToken.userId };
  //   } catch (e) {
  //     console.log('catch error: ', e);
  //     throw new Error('Invalid token');
  //   }
  // }

  async create(createEventDto: CreateEventDto, token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const newEvent = this.eventRepository.create({
      ...createEventDto,
      user_id: userId,
    });
    return await this.eventRepository.save(newEvent);
  }

  async findAll(token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const events = await this.eventRepository.find({
      where: { user_id: userId },
    });

    return events.map(({ user_id, ...rest }) => rest);
  }

  async findOne(id: string, token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const result = await this.eventRepository.findOne({ where: { id } });

    if (userId !== result?.user_id) {
      throw new ForbiddenException('Access denied');
    }

    return result;
  }

  async update(id: string, updateEventDto: UpdateEventDto, token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (userId !== event?.user_id) {
      throw new ForbiddenException('Access denied');
    }

    const updatedEvent = { ...event, ...updateEventDto };
    return await this.eventRepository.save(updatedEvent);
  }

  async remove(id: string, token: string) {
    const userId = getUserIdFromToken(token, this.jwtService).userId;
    const eventToRemove = await this.eventRepository.findOne({ where: { id } });

    if (!eventToRemove) {
      throw new Error(`Event with id ${id} not found`);
    }

    if (userId !== eventToRemove?.user_id) {
      throw new ForbiddenException('Access denied');
    }

    return await this.eventRepository.remove(eventToRemove);
  }
}
