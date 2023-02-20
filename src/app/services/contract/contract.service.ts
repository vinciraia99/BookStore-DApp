import {Inject, Injectable} from '@angular/core';
import {WEB3} from '../../core/web3';
//import contract from 'truffle-contract'; //acceso a libreria deprecada
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2'
import BigNumber from 'bignumber.js';

import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

declare let require: any;
const tokenAbi = require('../../../../Blockchain/build/contracts/EBookStoreFinal.json');
declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  public accountsObservable = new Subject<string[]>();
  public compatible: boolean;
  web3Modal;
  web3js;
  provider;
  accounts;
  balance;

  constructor(@Inject(WEB3) private web3: Web3 ,private snackbar: MatSnackBar) {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" // required
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }


  async connectAccount() {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    return this.accounts;
  }

  async accountInfo(accounts){
    const initialvalue = await this.web3js.eth.getBalance(accounts[0]);
    this.balance = this.web3js.utils.fromWei(initialvalue , 'ether');
    return this.balance;
  }


  trasnferEther(originAccount, destinyAccount, amount) {
    const that = this;
    return new Promise((resolve, reject) => {
      var contract = require("@truffle/contract"); // acceso a nueva version de libreria
      const paymentContract = contract(tokenAbi);
      const pay = contract(tokenAbi);
      pay.setProvider(this.provider);
      pay.deployed().then((instance)=>{
        return instance.getOwner().then((status)=>console.log("contratto" +  status));
      })
      paymentContract.setProvider(this.provider);
      paymentContract.deployed().then((instance) => {
        let finalAmount =  this.web3.utils.toBN(amount)
        console.log(finalAmount)
        console.log(originAccount);
        let account = originAccount[0].toLowerCase()
        return instance.buyEBook(
          "ABBCCSS",
          {
            from: originAccount[0] ,
            value: this.web3.utils.toWei(finalAmount, 'ether')
          }
          );
      }).then((status) => {
        if (status) {
          pay.deployed({
            from: originAccount[0]
          }).then((instance)=>{
            return instance.getBuyerEbooks2({
              from: originAccount[0]
            }).then((status)=>console.log(status));
          })
          return resolve({status: true});
        }
      }).catch((error) => {
        console.log(error);
        pay.deployed({
          from: originAccount[0]
        }).then((instance)=>{
          return instance.getBuyerEbooks2({
            from: originAccount[0]
          }).then((status)=>{
            console.log(status);
          }
          );
        })
        return reject('Error transfering Ether');
      });

    });
  }

  async getBuyedBook(originAccount) {
    var contract = require("@truffle/contract"); // acceso a nueva version de libreria
    const paymentContract = contract(tokenAbi);
    paymentContract.setProvider(this.provider);
    let result = await paymentContract.deployed().then((instance) => {
      return instance.getBuyerEbooks2({
        from: originAccount[0]
      }).then((status)=>status);
    });
    return result;
  }

  async getAllBookIntoContract(){
    var contract = require("@truffle/contract"); // acceso a nueva version de libreria
    const paymentContract = contract(tokenAbi);
    paymentContract.setProvider(this.provider);
    let result = await paymentContract.deployed().then((instance) => {
      return instance.getAllEBooks().then((status)=>status);
    });
    return result;
  }

  async isOwner(originAccount){
    var contract = require("@truffle/contract"); // acceso a nueva version de libreria
    const paymentContract = contract(tokenAbi);
    paymentContract.setProvider(this.provider);
    let result = await paymentContract.deployed().then((instance) => {
      return instance.isOwner({
        from: originAccount[0]
      }).then((status) => status).catch(error => {
        let json = this.jsonParse(error.message);
        this.failure(json.message)
      });
    });
    return result;
  }

  async addBook(isbn, price, originAccount) {
    let resultflag = false;
    var contract = require("@truffle/contract"); // acceso a nueva version de libreria
    const paymentContract = contract(tokenAbi);
    paymentContract.setProvider(this.provider);
    let result = await paymentContract.deployed().then((instance) => {
      let prices = (new BigNumber(price)).toString()
      return instance.addEBook(price, isbn, {
        from: originAccount[0]
      }).then((status) => resultflag = true).catch(error => {
        this.failure(error.message)
      });
    });
    return resultflag;
  }

  private jsonParse(jsontext: string) {
    return JSON.parse(jsontext.slice(24, jsontext.length));
  }


  failure(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Errore contratto',
      text: message,
    })
  }

  success() {
    Swal.fire({
      icon: 'success',
      title: 'Contratto OK',
      text: "Transazione completata",
    })
  }
}
