// src/models/record.ts

import { Model, Column, Table, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Image from './image';
import User from './user';

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

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  kakaoId!: string;
  
  @BelongsTo(() => User)
  user!: User;
}

export default Record;
