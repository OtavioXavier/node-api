import {
  type Authentication,
  type AuthenticationModel,
  LoadAccountByEmailRepository,
} from "./db-authentication-protocols";

export class DBAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByRepository: LoadAccountByEmailRepository,
  ) {
    this.loadAccountByRepository = loadAccountByRepository;
  }
  async auth(credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByRepository.loadByEmail(
      credentials.email,
    );
    if (account != null) {
      return new Promise((resolve) => resolve("valid_token"));
    }
    return null;
  }
}
