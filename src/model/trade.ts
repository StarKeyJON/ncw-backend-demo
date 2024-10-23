import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Trade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, length: 255 })
  @Index()
  symbol: string;

  @Column({ type: "decimal", nullable: false })
  amount: number;

  @Column({ type: "decimal", nullable: true })
  price?: number;

  @Column({ type: "varchar", nullable: false, length: 255 })
  @Index()
  orderId: string;

  @Column({ type: "varchar", nullable: false, length: 50 })
  @Index()
  status: string; // Use TradeStatus type directly

  @Column({
    type: "datetime",
    nullable: false,
    default: () => "NOW(6)",
    precision: 6,
  })
  @Index()
  createdAt: Date;

  @Column({
    type: "datetime",
    nullable: false,
    default: () => "NOW(6)",
    precision: 6,
  })
  @Index()
  updatedAt: Date;
}
