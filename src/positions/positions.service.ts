import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PositionsService {
  constructor(private readonly db: DatabaseService) {}

  // -----------------------------
  // CREATE POSITION
  // -----------------------------
  async createPosition(data: {
    position_id?: string;
    position_code: string;
    position_name: string;
    id: number;
  }) {
    const pool = this.db.getPool();

    try {
      const sqlQuery = `
        INSERT INTO positions (position_code, position_name, id)
        VALUES (?, ?, ?)
      `;

      const values = [
        data.position_code,
        data.position_name,
        data.id,
      ];

      const [result] = await pool.execute<OkPacket>(sqlQuery, values);

      return { message: 'Position created successfully', result };

    } catch (error) {
      console.error('Database insert failed:', error);
      throw new Error('Database insert failed: ' + error.message);
    }
  }

  // -----------------------------
  // GET ALL POSITIONS
  // -----------------------------
  async getAll() {
    const pool = this.db.getPool();

    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT position_id, position_code, position_name, id AS user_id, created_at, updated_at
         FROM positions ORDER BY position_id DESC`
      );
      return rows;

    } catch (error) {
      console.error('Error fetching positions:', error);
      throw new Error('Database query failed');
    }
  }

  // -----------------------------
  // FIND BY ID
  // -----------------------------
  async findById(id: number) {
    const pool = this.db.getPool();

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT position_id, position_code, position_name, id AS user_id, created_at, updated_at
       FROM positions WHERE position_id = ?`,
      [id]
    );

    if (!rows.length) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    return rows[0];
  }

  // -----------------------------
  // UPDATE POSITION
  // -----------------------------
  async updatePosition(
    position_id: number,
    data: { position_code?: string; position_name?: string; id?: number }
  ) {
    const pool = this.db.getPool();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.position_code) {
      fields.push('position_code = ?');
      values.push(data.position_code);
    }

    if (data.position_name) {
      fields.push('position_name = ?');
      values.push(data.position_name);
    }

    if (data.id !== undefined) {
      fields.push('id = ?');
      values.push(data.id);
    }

    // nothing to update
    if (fields.length === 0) {
      return this.findById(position_id);
    }

    values.push(position_id);

    const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;

    const [res] = await pool.execute<OkPacket>(sql, values);

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Position with ID ${position_id} not found`);
    }

    return this.findById(position_id);
  }

  // -----------------------------
  // DELETE POSITION
  // -----------------------------
  async deletePosition(position_id: number) {
    const pool = this.db.getPool();

    const [res] = await pool.execute<OkPacket>(
      'DELETE FROM positions WHERE position_id = ?',
      [position_id]
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Position with ID ${position_id} not found`);
    }

    return { success: true, message: 'Position deleted successfully' };
  }

  // -----------------------------
  // EXTRA LOOKUP FUNCTIONS
  // -----------------------------
  async findByPositionCode(position_code: string) {
    const pool = this.db.getPool();

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT position_id, position_code, position_name, id AS user_id, created_at, updated_at
       FROM positions WHERE position_code = ?`,
      [position_code]
    );

    return rows[0];
  }

  async findByPositionId(position_id: number) {
    return this.findById(position_id);
  }

  async findByRefreshToken(refreshToken: string) {
    const pool = this.db.getPool();

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT position_id, position_code, position_name, id AS user_id
       FROM positions WHERE refresh_token = ?`,
      [refreshToken]
    );

    return rows[0];
  }

  async setRefreshToken(position_id: number, refreshToken: string | null) {
    const pool = this.db.getPool();

    await pool.execute(
      `UPDATE positions SET refresh_token = ? WHERE position_id = ?`,
      [refreshToken, position_id]
    );
  }
}
