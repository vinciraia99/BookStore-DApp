import { Component, OnInit } from '@angular/core';
import {ContractService} from "../../services/contract/contract.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  direction: string;
  balance: string;
  bookMockList: any;

  constructor(private http: HttpClient, private contract: ContractService) {
    this.getOrderList();
    this.contract
      .connectAccount()
      .then(async (value: any) => {
        this.direction = value;
        await this.getAllBookIntoContract();
      })
      .catch((error: any) => {
        this.contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  async getAllBookIntoContract(){
    //this.bookList = await this.contract.getAllBookIntoContract();
  }

  ngOnInit(): void {
  }
  async getOrderList() {
    this.http.get("http://localhost:3000/api/books").subscribe((data) => {
      this.bookMockList = data;
      this.bookMockList= this.bookMockList.books;
    });
  }



}
