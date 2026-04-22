import { Hasher } from "@/data/protocols/criptography/hasher";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));
const salt = 12;

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }
  async hash(value: string): Promise<string> {
    const hash = bcrypt.hash(value, salt);
    return hash;
  }
}

describe("Bcrypt Adapter", () => {
  it("Shold call hash with the correct password and salt", async () => {
    const sut = new BcryptAdapter(salt);
    const spy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_password");
    expect(spy).toHaveBeenCalledWith("any_password", salt);
  });

  it("Shold return a valid hash in success case", async () => {
    const sut = new BcryptAdapter(salt);
    const validHash = await sut.hash("valid_password");
    expect(validHash).toEqual("hash");
  });
});
