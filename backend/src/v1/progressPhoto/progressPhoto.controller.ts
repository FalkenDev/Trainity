import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { RequestWithUser } from '../types/requestWithUser.type';
import { ProgressPhotoService } from './progressPhoto.service';
import { CreateProgressPhotoDto } from './dto/createProgressPhoto.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('progress-photos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress-photos')
export class ProgressPhotoController {
  constructor(
    private readonly progressPhotoService: ProgressPhotoService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all progress photos for the authenticated user',
  })
  getAll(@Req() req: RequestWithUser) {
    if (!req.user?.id)
      throw new UnauthorizedException('User not authenticated');
    return this.progressPhotoService.findAll(+req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Upload a new progress photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Progress photo with optional metadata' })
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  async uploadPhoto(
    @UploadedFile() file: any,
    @Body() body: CreateProgressPhotoDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user?.id)
      throw new UnauthorizedException('User not authenticated');
    if (!file) throw new BadRequestException('No file provided');

    const validation = this.uploadService.validateImageFile(file);
    if (!validation.valid) throw new BadRequestException(validation.error);

    return this.progressPhotoService.create(+req.user.id, file, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a progress photo' })
  async deletePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user?.id)
      throw new UnauthorizedException('User not authenticated');
    await this.progressPhotoService.delete(+req.user.id, id);
    return { message: 'Photo deleted' };
  }
}
