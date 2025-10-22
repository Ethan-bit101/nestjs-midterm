import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2'; // ✅ fixed `import as` syntax
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PositionsService { // makes a class 'PositionsService'
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    // makes a function 'createPosition' with parameters position_code, position_name, and role with default value 'position'
    async createPosition(position_code: string, position_name: string, role = 'position') {
        const hashed = await bcrypt.hash(position_name, 10);
        const [result] = await this.pool().execute<OkPacket>(
            'INSERT INTO positions (position_code, position_name, role) VALUES (?, ?, ?)',
            [position_code, hashed, role],
        );
        return { position_id: result.insertId, position_code, position_name, role };
    }

    async findByPositionCode(position_code: string) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT position_id, position_code ,position_name ,role,refresh_token FROM positions WHERE position_code = ?',
            [position_code],
        );
        return rows[0];
    }
    async findByPositionId (position_id:number) { // finds position id by selecting the position_id, position_code, role, and create_at from positions where position_id equals the parameter position_id
        const[rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT position_id, position_code, role, create_at FROM positions WHERE position_id = ?', //
            [position_id]
        );
        return rows[0];
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT id, username, role, created_at FROM users',
        );
        return rows;
    }

    async updatePosition(position_id: number, partial: { position_code?: string; position_name?: string; role?: string }) {
        const fields: string[] = [];
        const values: any[] = [];

        if (partial.position_code) {
            fields.push('position_code = ?');
            values.push(partial.position_code);
        }

        if (partial.position_name) {
            const hashed = await bcrypt.hash(partial.position_name, 10);
            fields.push('position_name = ?');
            values.push(hashed);
        }

        if (partial.role) {
            fields.push('role = ?');
            values.push(partial.role);
        }

        if (fields.length === 0) return await this.findByPositionId(position_id);
        values.push(position_id);
        const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
        await this.pool().execute(sql, values);
        return this.findByPositionId(position_id);
    }

    async deletePosition(position_id: number) {
        const [res] = await this.pool().execute<OkPacket>('DELETE FROM positions WHERE position_id = ?', [position_id]);
        return res.affectedRows > 0;
    }

    async setRefreshToken(position_id: number, refreshToken: string | null) {
        await this.pool().execute('UPDATE positions SET refresh_token = ? WHERE position_id = ?', [refreshToken, position_id]);
    }

    async findByRefreshToken(position_id:number, refreshToken: string) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT position_id, position_code, role FROM positions WHERE refresh-token=?',
            [refreshToken],
        );
        return rows[0];
    }
}

