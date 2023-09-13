// src/models/tables/room.ts
import {
  Model,
  Column,
  Table,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./user";
import Record from "./record";

@Table({ timestamps: true })
class Room extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  roomId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string; // 방 이름 또는 그룹명

  @Column({
    type: DataType.ENUM(
      "친구",
      "가족",
      "여자친구",
      "남자친구",
      "애완동물",
      "기타"
    ),
    allowNull: false,
  })
  relationship!: string; // 관계 유형

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  genderOrGroup!: string; // 성별 그룹

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  slogan!: string; // 슬로건 (15자 이내)

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

  @HasMany(() => Record)
  records!: Record[];
}

export default Room;
