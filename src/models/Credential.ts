import {
  Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo,
  CreatedAt, UpdatedAt, DeletedAt, Unique
} from 'sequelize-typescript';
import { User } from './User';

@Table
export class Credential extends Model<Credential> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column
  password: string;

  @Unique
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  static async createCredential(options) {
    try {
      return await Credential.create(options);
    } catch (e) {
      throw new Error('invalid-user-name');
    }
  }
}
