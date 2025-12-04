import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe // Added for better type safety, mirroring your positions file
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming the auth path is correct

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  // -----------------------------
  // GET ALL POSITIONS (protected)
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() { // Renamed from getall() in users.controller to getAll()
    return this.positionsService.getAll();
  }

  // -----------------------------
  // CREATE POSITION (protected in the file you sent, open in the users file)
  // I will make it protected as per your provided positions-controller.ts
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { position_code: string; position_name: string; id: number; }) {
    // Note: The service will handle insertion, ID comes from the foreign key to the user
    return this.positionsService.createPosition(body);
  }

  // -----------------------------
  // GET POSITION BY ID (protected)
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) { // Using ParseIntPipe for clarity
    return this.positionsService.findById(id);
  }

  // -----------------------------
  // UPDATE POSITION (protected)
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { position_code?: string; position_name?: string; id?: number } // Partial update body
  ) {
    // The service handles mapping the URL 'id' to the position_id
    return this.positionsService.updatePosition(id, body);
  }

  // -----------------------------
  // DELETE POSITION (protected)
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) { // Renamed from remove() in users.controller
    return this.positionsService.deletePosition(id);
  }
}
