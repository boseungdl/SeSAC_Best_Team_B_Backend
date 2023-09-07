// Sequelize의 TypeScript 버전 라이브러리에서 필요한 요소들을 가져옵니다.
import { Model, Column, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Record from './record';
// @Table 데코레이터는 이 클래스가 데이터베이스의 테이블과 매핑됨을 나타냅니다.
// timestamps: true 옵션은 createdAt 및 updatedAt 필드가 테이블에 자동으로 추가되도록 합니다.
@Table({timestamps: true})
class Image extends Model {
  // Image 클래스는 Sequelize의 Model 클래스를 확장하여 정의됩니다.
  // @Column 데코레이터는 이 속성이 데이터베이스 테이블의 칼럼과 매핑됨을 나타냅니다.
  // 이 칼럼은 부호 없는 정수, 자동 증가, 그리고 기본 키로 설정됩니다.
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  // 이 칼럼은 실수(부동소수점) 타입이며 위도를 나타냅니다.
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  GPSLatitude!: number;

  // 이 칼럼은 실수(부동소수점) 타입이며 경도를 나타냅니다.
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  GPSLongitude!: number;

  // 이 칼럼은 날짜 및 시간 타입이며 이미지가 캡처된 시간을 나타냅니다.
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  CreateDate!: Date;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  imageName!: string;

  @ForeignKey(() => Record)
  @Column(DataType.INTEGER.UNSIGNED)
  recordId!: number;

  @BelongsTo(() => Record)
  record!: Record;
}

// Image 모델을 다른 모듈에서 임포트할 수 있도록 내보냅니다.
export default Image;
