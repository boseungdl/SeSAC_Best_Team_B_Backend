// Sequelize의 TypeScript 버전 라이브러리에서 필요한 요소들을 가져옵니다.
import { Model, Column, Table, DataType } from 'sequelize-typescript';

// @Table 데코레이터는 이 클래스가 데이터베이스의 테이블과 매핑됨을 나타냅니다.
// timestamps: true 옵션은 createdAt 및 updatedAt 필드가 테이블에 자동으로 추가되도록 합니다.
@Table({timestamps: true})
class User extends Model {  // User 클래스는 Sequelize의 Model 클래스를 확장하여 정의됩니다.

  // @Column 데코레이터는 이 속성이 데이터베이스 테이블의 칼럼과 매핑됨을 나타냅니다.
  // 이 칼럼은 부호 없는 정수, 자동 증가, 그리고 기본 키로 설정됩니다.
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  // 이 칼럼은 문자열 타입이며, null 값을 허용하지 않습니다.
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  // 이 칼럼도 문자열 타입이며, null 값을 허용하지 않습니다.
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  // 추가적인 칼럼들은 비슷한 방식으로 정의될 수 있습니다.

  // 예: 
  // @Column(DataType.DATE)
  // birthdate!: Date;
}

// User 모델을 다른 모듈에서 임포트할 수 있도록 내보냅니다.
export default User;
