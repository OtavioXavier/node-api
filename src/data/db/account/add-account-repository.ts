import { AccountModel } from "@/domain/models/account";
import { addAccountModel } from "@/domain/usecases/add-account";

export interface AddAccountRepository {
    add (accountData: addAccountModel): Promise<AccountModel>
}