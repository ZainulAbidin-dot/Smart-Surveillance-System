import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class UserRoom extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;

  @column()
  public device_type: string;

  @column()
  public device_name: string;

  @column()
  public device_id: string;

  @column()
  public device_info: string;

  @column()
  public room_no: number;

  @column()
  public room_name: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
