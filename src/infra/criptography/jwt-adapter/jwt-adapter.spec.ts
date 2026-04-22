import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve("access_token"));
  },
}));

const secret = "secret";

describe("JWT Adapter", () => {
  it("Shold call sign with correct id", async () => {
    const sut = new JwtAdapter(secret);
    const spy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(spy).toHaveBeenCalledWith({ id: "any_id" }, secret);
  });

  it("Shold return a token on sign success", async () => {
    const sut = new JwtAdapter(secret);
    const accessToken = await sut.encrypt("any_id");
    expect(accessToken).toEqual("access_token");
  });
});
