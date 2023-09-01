// src/models/record.ts

import { Model, Column, Table, DataType, HasMany } from 'sequelize-typescript';
import Image from './image';

@Table({timestamps: true})
class Record extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  recordId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  recordValue!: string;

  @HasMany(() => Image)
  images!: Image[];
}

export default Record;
