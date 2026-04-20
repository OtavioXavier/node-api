import { AccountModel, AddAccount, addAccountModel, AddAccountRepository, Hasher } from "./db-add-account-protocols";

class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
        return new Promise( resolve => resolve('hashed_password'));
    }
}

class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: addAccountModel): Promise<AccountModel> {
        return new Promise(resolve => resolve( {
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        })
        )
    }
}

class DBAddAccount implements AddAccount{
    constructor (private addAccountRepository: AddAccountRepository, private hasher: Hasher) {
        this.addAccountRepository = addAccountRepository;
        this.hasher = hasher;
    }
    
    add(account: addAccountModel): Promise<AccountModel> {
        const hashedPassword = this.hasher.hash(account.password);
        return new Promise( resolve => resolve({
            id: 'any_id',
            password: hashedPassword,
            ...account
        }))
    }
}


describe('DBAddAccount', () => {
    it('Shold call Hasher with correct password', async () => {
        const hasherStub = new HasherStub();
        const sut = new DBAddAccount(new AddAccountRepositoryStub, hasherStub);
        const encryptSpy = jest.spyOn(hasherStub, 'hash');
        await sut.add({
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        })
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    });
});