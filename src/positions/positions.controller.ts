import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.positionsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any) {
    return this.positionsService.createPosition(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any
  ) {
    return this.positionsService.updatePosition(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.deletePosition(id);
  }
}
positions.controller.ts
Displaying positions.controller.ts.
