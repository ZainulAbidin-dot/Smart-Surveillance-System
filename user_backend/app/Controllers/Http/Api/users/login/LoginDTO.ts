export interface LoginDTO {
  password: string;
  email: string;
  deviceId?: string;
  fcmToken?: string;
}
