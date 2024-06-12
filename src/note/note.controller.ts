import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { getTokenFromAuthHeader } from '~common/utils/get-token-from-auth-header';
import { AuthGuard } from '~common/guards';

@Controller('notes')
@UseGuards(AuthGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.noteService.create(createNoteDto, token);
  }

  @Get()
  findAll(@Headers('Authorization') authHeader: string) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.noteService.findAll(token);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.noteService.findOne(id, token);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.noteService.update(id, updateNoteDto, token);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = getTokenFromAuthHeader(authHeader);
    return this.noteService.remove(id, token);
  }
}
