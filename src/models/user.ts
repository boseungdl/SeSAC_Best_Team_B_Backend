import { Model, Column, Table, AutoIncrement, PrimaryKey, DataType } from 'sequelize-typescript';

// User 테이블에 대한 모델 정의
@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model {
  // 사용자의 ID (자동 증가, 기본 키)
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  // 사용자 이름
  @Column(DataType.STRING)
  username!: string;

  // 사용자 이메일
  @Column(DataType.STRING)
  email!: string;
}