const jwt = require("jsonwebtoken");

export default class TokenDecoder {
  public decode = async (request: any) => {
    const bearerToken = request.headers().authorization;

    if (!bearerToken) {
      return { status: false, value: "No Token Found" };
    }
    try {
      const token = bearerToken.split(" ")[1];
      const decoded = await jwt.verify(token, "shhhhh");
      const isSignatureFine = !!decoded;
      if (!isSignatureFine) {
        return { status: false, value: "Token signature expired." };
      }
      const { user } = decoded;
      return { status: true, value: user };
    } catch (error) {
      return { status: false, value: error };
    }
  };
}
