import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    pool!: mysql.Pool;

    async onModuleInit() {
        this.pool= mysql.createPool({
            host: process.env.DB_HOST || 'mysql-1377e154-gbox-d1bc.d.aivencloud.com',
            port: +(process.env.DB_PORT || 27114),
            user: process.env.DB_USER || 'avnadmin',
            password: process.env.DB_PASSWORD || 'AVNS_KzkyTirOGozRaDmQbe0',
            database: process.env.DB_NAME || 'defaultdb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        // Optional: Test connection
        const conn = await this.pool.getConnection();
        await conn.ping();
        conn.release();
        console.log('MYSQL pool created');
    }
        async onModuleDestroy() {
            await this.pool.end();
        }

        getPool() {
            return this.pool;
        }
}
