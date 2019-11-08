import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "activations_secrets" })
class TypeOrmActivationSecretEntity {
  @PrimaryColumn()
  value!: string;
  @Column()
  used!: boolean;
  @Column()
  accountUsername!: string;
  @Column()
  expiration!: Date;
}

export default TypeOrmActivationSecretEntity;
