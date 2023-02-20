import {Component, OnInit} from '@angular/core';

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {ContractService} from "../../services/contract/contract.service";

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  menuItems = ['Home', 'Transaction'];
  private direction: any;
  owner = false;

  ngOnInit(): void {
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private contract: ContractService) {
    this.contract
      .connectAccount()
      .then(async (value: any) => {
        this.direction = value;
        await this.isOwner(this.direction);
      });
  }
  async isOwner(user){
    if(await this.contract.isOwner(user)){
      this.owner = true;
    }
  }




}
