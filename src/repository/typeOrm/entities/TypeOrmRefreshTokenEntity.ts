import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "refresh_tokens" })
class TypeOrmRefreshTokenEntity {
  @PrimaryColumn()
  value!: string;
  @Column()
  valid!: boolean;
  @Column()
  accountUsername!: string;
  @Column()
  accessTokenValue!: string;
  @Column()
  expiration!: Date;
}

export default TypeOrmRefreshTokenEntity;
