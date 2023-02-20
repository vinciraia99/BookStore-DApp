import {Routes} from '@angular/router';

// Components
import {AccountComponent} from "./account/account.component";
import {ErrorComponent} from "./error/error.component";
import {HomeComponent} from "./home/home.component";
import {AddBookComponent} from "./addBook/addBook.component";
import {TransactionComponent} from "./transaction/transaction.component";
import {ContractNotFoundComponent} from "./contractNotFound/contractnotfound.component";

export const UiRoute: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'money', component: TransactionComponent},
  {path: 'home', component: HomeComponent},
  {path: 'account', component: AccountComponent},
  {path: 'addBook', component: AddBookComponent},
  {path: '404', component: ErrorComponent},
  {path: '401', component: ContractNotFoundComponent},
  {path: '**', redirectTo: '/404'},
];
