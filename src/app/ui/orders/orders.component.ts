import {ContractService} from "../../services/contract/contract.service";
import {Component, Inject, ViewEncapsulation} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WEB3} from "../../core/web3";
import Web3 from "web3";

/*import { ThreeBox } from "../../services/3box.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Identicon } from "../../services/identicon";
import { Md5 } from "ts-md5/dist/md5";*/

@Component({
  selector: "app-account",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class OrdersComponent {
  direction: string;
  balance: string;
  orderList;
  owner = false;
  //profile;
  //url;
  //data;
  private bookList: any;
  private bookMockList: any;
  viewList = new Array();
  private bookBuyedList: any;

  constructor(
    private contract: ContractService,
    private http: HttpClient,
    @Inject(WEB3) private web3: Web3
  ) {
    this.contract
      .connectAccount()
      .then(async (value: any) => {
        this.direction = value;
        this.owner = await this.contract.isOwner(this.direction);
        await this.getOrderList();
        await this.getBuyedUserBook();
        await this.getBuyableBook();
        console.log("BookMockList");
        console.log(this.bookMockList);
        console.log("bookList");
        console.log(this.bookList);
        console.log("viewList");
        console.log(this.viewList);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  async getBuyableBook() {
    this.bookList = await this.contract.getAllBookIntoContract();
    this.bookMockList.forEach(e => {
      this.bookList.forEach(e2 => {
        if (e.isbn == e2.isbn) {
          if (this.checkBookIsBuyed(e2.isbn)) {
            e.price = this.web3.utils.fromWei(e2.price, 'ether');
            if (!this.checkIfIsPresent(e.isbn)) this.viewList.push(e);
          }
        }
      })
    })
  }

  private checkIfIsPresent(element) {
    let result = false;
    this.viewList.forEach(e => {
      if (e.isbn == element) {
        result = true;
        return;
      }
    });
    return result;
  }

  private checkBookIsBuyed(element) {
    let result = false;
    this.bookBuyedList.forEach(e => {
      if (e.isbn == element) {
        result = true;
        return;
      }
    });
    return result;
  }

  private async getBuyedUserBook() {
    this.bookBuyedList = await this.contract.getBuyedBook(this.direction);
    console.log(this.bookBuyedList);
  }


  private getOrderList() {
    this.http.get("http://localhost:3000/api/books").subscribe((data) => {
      this.bookMockList = data;
      this.bookMockList = this.bookMockList.books;
    });
  }

}
