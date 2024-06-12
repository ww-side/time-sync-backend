import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { AuthGuard } from '~common/guards';
import { getTokenFromAuthHeader } from '~common/utils/get-token-from-auth-header';

@Controller('events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(
    @Body() createEventDto: CreateEventDto,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.eventService.create(createEventDto, token);
  }

  @Get()
  findAll(@Headers('Authorization') authHeader: string) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.eventService.findAll(token);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.eventService.findOne(id, token);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.eventService.update(id, updateEventDto, token);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.eventService.remove(id, token);
  }
}
