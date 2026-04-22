import jwt from "jsonwebtoken";
import { Encrypter } from "@/data/protocols/criptography/encrypter";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve("any_token"));
  },
}));

const secret = "secret";

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {
    this.secret = secret;
  }
  async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return new Promise((resolve) => resolve(accessToken));
  }
}

describe("JWT Adapter", () => {
  it("Shold call sign with correct id", async () => {
    const sut = new JwtAdapter(secret);
    const spy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(spy).toHaveBeenCalledWith({ id: "any_id" }, secret);
  });
});
