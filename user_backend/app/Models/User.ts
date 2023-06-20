import { DateTime } from "luxon";
import { column, BaseModel, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, {
    foreignKey: "user_id",
  })
  public userId: BelongsTo<typeof User>;
  $dirty: any;

  // @beforeSave()
  // public static async hashPassword(user: User) {
  //   if (user.$dirty.password) {
  //     user.password = await Hash.make(user.password);
  //   }
  // }
}
