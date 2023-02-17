import {ContractService} from "../../services/contract/contract.service";
import {Component, OnInit} from "@angular/core";
import {coerceStringArray} from "@angular/cdk/coercion";
import {HttpClient} from "@angular/common/http";

/*import { ThreeBox } from "../../services/3box.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Identicon } from "../../services/identicon";
import { Md5 } from "ts-md5/dist/md5";*/

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent {
  direction: string;
  balance: string;
  orderList;
  //profile;
  //url;
  //data;

  constructor(
    private contract: ContractService,
    private http: HttpClient
    //private sanitizer: DomSanitizer,
    //private threebox: ThreeBox
  ) {
    this.contract
      .connectAccount()
      .then(async (value: any) => {
        this.direction = value;
        this.getDetails(this.direction);
        await this.getOrderList(this.direction);
        /* this.profile = this.threebox.getProfile(this.direction).then((response) => {
             console.log(response);
             this.profile = response;
             this.url = this.profile.image[0].contentUrl["/"];
           });
         this.getImage(this.direction);*/
      })
      .catch((error: any) => {
        this.contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  ngon

  /*getImage(account) {
    this.data = this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/svg+xml; utf8," +
      encodeURI(
        new Identicon(Md5.hashStr(account), {
          size: 32,
          format: "svg",
        }).toString(true)
      )
    );
  }*/

  navigateTo() {
    window.open("https://metamask.io/");
  }

  connectAccount() {
    this.contract
      .connectAccount()
      .then((value: any) => {
        console.log(value);
        this.direction = value;
        this.getDetails(this.direction);
      })
      .catch((error: any) => {
        this.contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  //Recupera il saldo ETH
  getDetails(account) {
    this.contract
      .accountInfo(account)
      .then((value: any) => {
        this.balance = value;
      })
      .catch((error: any) => {
        this.contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  async getOrderList(account) {
    this.http.get("http://localhost:3000/api/books").subscribe((data) => {
      console.log(data);
    });
    this.orderList = await this.contract.getBuyedBook(account);
  }
}
