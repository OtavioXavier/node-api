import { AccountModel, AddAccount, addAccountModel, AddAccountRepository, Hasher } from "./db-add-account-protocols";

export class DBAddAccount implements AddAccount{
    
        constructor (private addAccountRepository: AddAccountRepository, private hasher: Hasher) {
            this.addAccountRepository = addAccountRepository;
            this.hasher = hasher;
        }
    
        async add(account: addAccountModel): Promise<AccountModel> {
            const hashedPassword = await this.hasher.hash(account.password);
            account.password = hashedPassword;
            return this.addAccountRepository.add(account);
        }
    
}