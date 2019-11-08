import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "accounts" })
class TypeOrmAccountEntity {
  @PrimaryColumn()
  username!: string;
  @Column()
  password!: string;
  @Column()
  active!: boolean;
}

export default TypeOrmAccountEntity;
