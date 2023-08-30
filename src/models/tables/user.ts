// src/models/user.ts

import { Model, Column, Table, DataType } from 'sequelize-typescript';

@Table
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
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  // 필요한 다른 컬럼들을 추가할 수 있습니다.
}
export default User;
