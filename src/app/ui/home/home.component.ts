import {Component, Inject, OnInit} from '@angular/core';
import {ContractService} from "../../services/contract/contract.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {WEB3} from "../../core/web3";
import Web3 from "web3";
import Swal from "sweetalert2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  direction: string;
  balance: string;
  private bookMockList: any;
  contractCeck = false;
  private bookList;
  viewList = new Array();
  private bookBuyedList: any;
  owner = false;

  constructor(@Inject(WEB3) private web3: Web3, private router: Router, private http: HttpClient, private contract: ContractService) {
    this.getOrderList();
    this.contract
      .connectAccount()
      .then(async (value: any) => {
        this.contractCeck = true;
        this.direction = value;
        this.owner = await this.contract.isOwner(this.direction);
        await this.getBuyedUserBook();
        await this.getBuyableBook();
        console.log("BookMockList");
        console.log(this.bookMockList);
        console.log("bookList");
        console.log(this.bookList);
        console.log("viewList");
        console.log(this.viewList);
      })
      .catch(async (error: any) => {
        console.error(error);
        this.router.navigate(['/account'])
      });
  }

  async getBuyableBook() {
    this.bookList = await this.contract.getAllBookIntoContract();
    this.bookMockList.forEach(e => {
      this.bookList.forEach(e2 => {
        if (e.isbn == e2.isbn) {
          if (!this.checkBookIsBuyed(e2.isbn)) {
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

  ngOnInit(): void {
  }

  async buyBook(isbn, price) {
    let flag = await this.contract.buyBook(isbn, price, this.direction);
    if (flag) {
      Swal.fire({
        icon: 'success',
        title: 'eBook acquistato!',
        text: "Lo trovi nella sezione eBook Acquistati",
      }).then(status => {
        window.location.reload();
      });
    }
  }


}
