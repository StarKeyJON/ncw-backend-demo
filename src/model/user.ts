import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Trade } from "./trade";
import { Passphrase } from "./passphrase";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ nullable: false })
  sub: string;

  @OneToMany(() => Trade, (trade) => trade.id)
  devices: Trade[];

  @OneToMany(() => Passphrase, (passphrase) => passphrase.userId)
  passphrases: Passphrase[];
}
