import { HashComparater } from "@/data/protocols/criptography/hash-comparater";
import { Hasher } from "@/data/protocols/criptography/hasher";
import bcrypt from "bcrypt";

export class BcryptAdapter implements Hasher, HashComparater {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }
  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
  async hash(value: string): Promise<string> {
    const hash = bcrypt.hash(value, this.salt);
    return hash;
  }
}
