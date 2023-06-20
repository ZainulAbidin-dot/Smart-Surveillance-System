import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class FcmToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;

  @column()
  public fcm_token: string;

  @column()
  public device_id: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
