import { AccountModel, AddAccount, addAccountModel, AddAccountRepository, Hasher } from "./db-add-account-protocols";

const makeHasher = () => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return new Promise( resolve => resolve('hashed_password'));
        }
    }

    return new HasherStub();
}

const makeAddAccountRepository = () => {
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

return new AddAccountRepositoryStub();
}

const makeSut = () => {
    const hasherStub = makeHasher();
    const addAccountRepositoryStub = makeAddAccountRepository();

    class DBAddAccount implements AddAccount{
    
        constructor (private addAccountRepository: AddAccountRepository, private hasher: Hasher) {
            this.addAccountRepository = addAccountRepository;
            this.hasher = hasher;
        }
    
        async add(account: addAccountModel): Promise<AccountModel> {
            const hashedPassword = await this.hasher.hash(account.password);
            return this.addAccountRepository.add(account);
        }
    
    }

    const dbAddAccount = new DBAddAccount(addAccountRepositoryStub, hasherStub);

    return {
        sut: dbAddAccount,
        hasherStub,
        addAccountRepositoryStub
    }
}

const makeFakeAccountData = ():addAccountModel => ({
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
})


describe('DBAddAccount', () => {
    it('Shold call Hasher with correct password', async () => {
        const {sut, hasherStub} = makeSut();
        const encryptSpy = jest.spyOn(hasherStub, 'hash');
        await sut.add(makeFakeAccountData());
        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });

    it('Shold call AddAccountRepository with correct credentials', async () => {
        const {sut, addAccountRepositoryStub} = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        })
    });

});