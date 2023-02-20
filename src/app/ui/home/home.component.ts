import {Component, Inject, OnInit} from '@angular/core';
import {ContractService} from "../../services/contract/contract.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {WEB3} from "../../core/web3";
import Web3 from "web3";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  direction: string;
  balance: string;
  bookMockList: any;
  contractCeck = false;
  bookList;
  viewList = new Array();

  constructor(@Inject(WEB3) private web3: Web3, private router: Router, private http: HttpClient, private contract: ContractService) {
    this.getOrderList();
    this.contract
      .connectAccount()
      .then(async (value: any) => {
        this.contractCeck = true;
        this.direction = value;
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
          e.price = this.web3.utils.fromWei(e.price, 'ether');
          this.viewList.push(e);
        }
      })
    })
  }

  getOrderList() {
    this.http.get("http://localhost:3000/api/books").subscribe((data) => {
      this.bookMockList = data;
      this.bookMockList = this.bookMockList.books;
    });
  }

  ngOnInit(): void {
  }


}
