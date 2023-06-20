const jwt = require("jsonwebtoken");

export class GetUserUseCase {
  constructor() {}

  public async execute(request: any): Promise<any> {
    try {
      const bearerToken = request.headers().authorization;

      if (bearerToken) {
        const token = bearerToken.split(" ")[1];
        try {
          const decoded = await jwt.verify(token, "shhhhh");
          const isSignatureFine = !!decoded;
          if (!isSignatureFine) {
            return "Token signature expired.";
          }
          const { user } = decoded;
          return { user: user ? user : {}, token: token };
        } catch (err) {
          console.log(err);
          return err;
        }
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
