// src/models/record.ts

import {
  Model,
  Column,
  Table,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Image from "./image";
import User from "./user";

@Table({ timestamps: true })
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
  @Column({
    type: DataType.STRING,
    allowNull: false,
    references: {
      model: User, // 참조하는 테이블
      key: "kakaoId", // 참조하는 테이블의 필드
    },
  })
  kakaoId!: string; // User 테이블의 kakaoId를 외래 키로 참조합니다.

  @BelongsTo(() => User)
  user!: User;
}

export default Record;
