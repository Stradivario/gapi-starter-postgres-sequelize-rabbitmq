import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  DataType
} from 'sequelize-typescript';
import { Credential } from './Credential';

export interface UserSettings {
  sidebar: boolean;
  language: string;
}

@Table
export class User extends Model<User> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  username: string;

  @Column({
    type: DataType.ENUM({ values: ['ADMIN', 'USER'] })
  })
  type: 'ADMIN' | 'USER';

  @Column({
    type: DataType.JSONB,
    allowNull: true
  })
  settings: UserSettings;

  @HasMany(() => Credential)
  credential: Credential[];

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  static async createUser(payload) {

    const exists = await Credential.find(<any>{
      where: {
        email: payload.email
      }
    });

    if (exists) {
      throw new Error('invalid-user-name');
    } else {
      return await User.create(payload);
    }
  }

}
