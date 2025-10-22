

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions') // defines a controller with the route 'positions'
export class PositionsController {
    constructor(private positionsService: PositionsService) {} // injects PositionsService
    @Get()
    async getall() {
        return this.positionsService.getAll(); // returns positionsService.getAll()
    }


    @UseGuards(JwtAuthGuard) // protects routes
    @Get(':position_id') // gets position by ID
    async getOne(@Param('position_id') position_id: string) { // Gets the parameter of position_id that must be a string
        return this.positionsService.findByPositionId(+position_id); // returns positionsService
    }


    @Post() // defines routes
    async create(@Body() body: { position_code: string; position_name: string }) { // creates a property body with position_code and position_name that are strings
        return this.positionsService.createPosition(body.position_code, body.position_name); // returns positionsService.createPosition
    }


    @UseGuards(JwtAuthGuard)// protects routes using JwtAuthGuard
    @Put(':position_id') //
    async update(@Param('position_id') position_id: string,body:any)  {
        return this.positionsService.updatePosition(+position_id, body);
    }

    // Delete user (protected
    @UseGuards(JwtAuthGuard)
    @Delete(':position_id')
    async remove(@Param('position_id') position_id: string) {
        return this.positionsService.deletePosition(+position_id);
    }
}