import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.positionsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':position_id')
  async getOne(@Param('position_id') position_id: string) {
    return this.positionsService.findByPositionId(+position_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { position_code: string; positions_name: string }) {
    return this.positionsService.createPosition(body.position_code, body.positions_name);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':position_id')
  async update(
    @Param('position_id') position_id: string,
    @Body() body: Partial<{ position_code: string; positions_name: string; id: number }>,
  ) {
    return this.positionsService.updatePosition(+position_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':position_id')
  async remove(@Param('position_id') position_id: string) {
    return this.positionsService.deletePosition(+position_id);
  }
}
