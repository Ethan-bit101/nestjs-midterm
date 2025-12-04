import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
// We do not need bcrypt as positions do not have passwords

@Injectable()
export class PositionsService {
    constructor(private readonly db: DatabaseService) {}

    private pool = () => this.db.getPool();

    // -----------------------------
    // CREATE POSITION (Replicated from createUser)
    // -----------------------------
    async createPosition(data: {
        position_code: string;
        position_name: string; // Using positions_name from your schema
        id: number; // Foreign key to users
    }) {
        const sqlQuery = `
            INSERT INTO positions (position_code, positions_name, id)
            VALUES (?, ?, ?)
        `;
        const values = [
            data.position_code,
            data.position_name,
            data.id,
        ];

        const [result] = await this.pool().execute<OkPacket>(sqlQuery, values);
        
        // Return created position data (simulating behavior in your positions-service.ts)
        return { 
            position_id: result.insertId, 
            ...data 
        };
    }

    // -----------------------------
    // GET ALL POSITIONS (Replicated from getAll)
    // -----------------------------
    async getAll() {
        // Select all relevant fields from the positions table
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT position_id, position_code, position_name, id AS user_id, created_at FROM positions ORDER BY position_id DESC',
        );
        return rows;
    }

    // -----------------------------
    // FIND POSITION BY ID (Replicated from findById)
    // -----------------------------
    async findById(id: number) {
        // The primary key for positions is position_id
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT position_id, position_code, position_name, id AS user_id, created_at FROM positions WHERE position_id = ?',
            [id]
        );
        if (!rows.length) {
            throw new NotFoundException(`Position with ID ${id} not found`);
        }
        return rows[0];
    }
    
    // -----------------------------
    // UPDATE POSITION (Replicated from updateUser)
    // -----------------------------
    async updatePosition(
        position_id: number,
        partial: { position_code?: string; positions_name?: string; id?: number }
    ) {
        const fields: string[] = [];
        const values: any[] = [];

        if (partial.position_code) {
            fields.push('position_code = ?');
            values.push(partial.position_code);
        }

        if (partial.position_name) {
            fields.push('position_name = ?'); // Using positions_name from schema
            values.push(partial.position_name);
        }
        
        if (partial.id !== undefined) {
            fields.push('id = ?'); // Foreign key update
            values.push(partial.id);
        }

        if (fields.length === 0) return await this.findById(position_id);
        
        values.push(position_id);
        const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
        
        const [res] = await this.pool().execute<OkPacket>(sql, values);

        if (res.affectedRows === 0) {
            throw new NotFoundException(`Position with ID ${position_id} not found`);
        }

        return this.findById(position_id);
    }

    // -----------------------------
    // DELETE POSITION (Replicated from deleteUser)
    // -----------------------------
    async deletePosition(position_id: number) {
        const [res] = await this.pool().execute<OkPacket>('DELETE FROM positions WHERE position_id = ?', [position_id]);
        
        if (res.affectedRows === 0) {
            throw new NotFoundException(`Position with ID ${position_id} not found`);
        }

        return { success: true, message: 'Position deleted successfully' };
    }

    // -----------------------------
    // REFRESH TOKEN FUNCTIONS (Kept for structural consistency, 
    // though the positions table does not have a refresh_token field in your schema)
    // NOTE: For this to work, you would need to add 'refresh_token VARCHAR(255)' to the 'positions' table
    // I am using the user ID column 'id' which is present in the table to link.
    // -----------------------------
    
    // This function is generally not applicable to a Positions resource but is replicated for structure.
    async setRefreshToken(position_id: number, refreshToken: string | null) {
        // Since positions table does not have refresh_token, I will omit the logic to prevent errors.
        // If you were to add it, the code would be:
        // await this.pool().execute('UPDATE positions SET refresh_token = ? WHERE position_id = ?', [refreshToken, position_id]);
        console.warn('setRefreshToken called on PositionsService. positions table does not support this field.');
    }

    // This function is generally not applicable to a Positions resource but is replicated for structure.
    async findByRefreshToken( refreshToken: string) {
        // Since positions table does not have refresh_token, I will omit the logic to prevent errors.
        return null;
    }
}

