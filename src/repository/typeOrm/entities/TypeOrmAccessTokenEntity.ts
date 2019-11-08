import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "access_tokens" })
class TypeOrmAccessTokenEntity {
  @PrimaryColumn()
  value!: string;
  @Column()
  valid!: boolean;
  @Column()
  accountUsername!: string;
  @Column()
  expiration!: Date;
}

export default TypeOrmAccessTokenEntity;
