/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

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
