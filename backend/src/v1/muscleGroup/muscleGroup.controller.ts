import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MuscleGroupService } from './muscleGroup.service';
import { CreateMuscleGroupDto } from './dto/createMuscleGroup.dto';
import { UpdateMuscleGroupDto } from './dto/updateMuscleGroup.dto';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { MuscleGroupResponseDto } from './dto/muscleGroupResponse.dto';

@ApiTags('musclegroups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('muscleGroups')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Get()
  @ApiOperation({ summary: 'Get all muscle groups' })
  @ApiOkResponse({ type: [MuscleGroupResponseDto] })
  getAll() {
    return this.muscleGroupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one muscle group by ID' })
  @ApiOkResponse({ type: MuscleGroupResponseDto })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.muscleGroupService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new muscle group' })
  @ApiOkResponse({ type: MuscleGroupResponseDto })
  create(@Body() dto: CreateMuscleGroupDto) {
    return this.muscleGroupService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a muscle group' })
  @ApiOkResponse({ type: MuscleGroupResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMuscleGroupDto,
  ) {
    return this.muscleGroupService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a muscle group' })
  @ApiOkResponse({
    schema: { example: { message: 'Muscle group deleted' } },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.muscleGroupService.remove(id);
  }
}
