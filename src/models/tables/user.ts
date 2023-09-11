import { Model, Column, Table, DataType, HasMany } from "sequelize-typescript";
import Record from "./record";
import Room from "./room";

@Table({ timestamps: true })
class User extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  kakaoId!: string;

  // Refresh Token 칼럼을 추가합니다.
  // 문자열 형태의 토큰 값이 저장됩니다.
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refreshToken?: string;

  @HasMany(() => Record)
  records!: Record[];

  @HasMany(() => Room)
  rooms!: Room[];
}

export default User;
