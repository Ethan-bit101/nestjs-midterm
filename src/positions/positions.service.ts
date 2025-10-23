import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createPosition(position_code: string, position_name: string, id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO positions (position_code, position_name, id) VALUES (?, ?, ?)',
      [position_code, position_name, id],
    );
    return {
      position_id: result.insertId,
      position_code,
      position_name,
      id
    };
  }

  async findByPositionCode(position_code: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT position_id, position_code, position_name, id AS user_id, created_at, updated_at FROM positions WHERE position_code = ?',
      [position_code],
    );
    return rows[0];
  }

  async findByPositionId(position_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT position_id, position_code, position_name, id AS user_id, created_at, updated_at FROM positions WHERE position_id = ?',
      [position_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT position_id, position_code, position_name, id AS user_id, created_at, updated_at FROM positions',
    );
    return rows;
  }

  async updatePosition(
    position_id: number,
    partial: { position_code?: string; position_name?: string; user_id?: number },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.position_code) {
      fields.push('position_code = ?');
      values.push(partial.position_code);
    }

    // DB column is `positions_name` per your migration; keep that here
    if (partial.position_name) {
      fields.push('positions_name = ?');
      values.push(partial.position_name);
    }

    if (partial.user_id !== undefined) {
      // 'id' is the FK column in your positions table
      fields.push('id = ?');
      values.push(partial.user_id);
    }

    // nothing to update -> return current record
    if (fields.length === 0) {
      return await this.findByPositionId(position_id);
    }

    values.push(position_id);
    const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
    const [res] = await this.pool().execute<OkPacket>(sql, values);

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Position with ID ${position_id} not found`);
    }

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
      'SELECT position_id, position_code, position_name, id AS user_id FROM positions WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];

  }
}

