import {
  type Authentication,
  type AuthenticationModel,
  HashComparater,
  LoadAccountByEmailRepository,
} from "./db-authentication-protocols";

export class DBAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByRepository: LoadAccountByEmailRepository,
    private readonly hashComparater: HashComparater,
  ) {
    this.loadAccountByRepository = loadAccountByRepository;
  }
  async auth(credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByRepository.loadByEmail(
      credentials.email,
    );
    if (account != null) {
      const isTheSamePassword = await this.hashComparater.compare(
        credentials.password,
        account.password,
      );
      if (isTheSamePassword) {
        return new Promise((resolve) => resolve("valid_token"));
      }
    }
    return null;
  }
}
