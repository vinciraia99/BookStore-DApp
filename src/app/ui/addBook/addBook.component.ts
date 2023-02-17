import { Component, OnInit } from '@angular/core';
import {ContractService} from "../../services/contract/contract.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './addBook.component.html',
  styleUrls: ['./addBook.component.scss']
})
export class AddBookComponent implements OnInit {
  direction: string;
  balance: string;
  bookList;
  owner = false;
  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';r

  constructor(private router: Router,private contract: ContractService, private formBuilder: FormBuilder) {
    this.contract
      .connectAccount()
      .then(async (value: any) => {
        this.direction = value;
        await this.isOwner(this.direction);
        if(!this.owner){
          await this.router.navigate(['/home'])
        }
      });
  }

  navigateTo() {
    window.open("https://metamask.io/");
  }

  async isOwner(user){
    if(await this.contract.isOwner(user)){
      this.owner = true;
    }
  }

  ngOnInit() {
    this.createForm();
    this.setChangeValidate()
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'isbn': [null, [Validators.required,Validators.minLength(10), Validators.maxLength(10)]],
      'name': [null, Validators.required],
      'description': [null, Validators.required],
      'url': [null, Validators.required]
    });
  }

  setChangeValidate() {
    this.formGroup.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.formGroup.get('name').setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = "You need to specify at least 3 characters";
        } else {
          this.formGroup.get('name').setValidators(Validators.required);
        }
        this.formGroup.get('name').updateValueAndValidity();
      }
    )
  }

  get name() {
    return this.formGroup.get('name') as FormControl
  }

  getErrorISBN(): string {
    const isbnFormControl = this.formGroup.get('isbn');
    if (isbnFormControl.hasError('required')) {
      return 'ISBN is required';
    }
    const isbnValue = isbnFormControl.value as string;
    if (isbnValue.length !== 10 && isbnValue.length !== 13) {
      return 'Invalid ISBN length';
    }
    if (!/^\d+$/.test(isbnValue)) {
      return 'ISBN should only contain digits';
    }
    const isbnChecksum = (isbnValue.length === 10) ?
      (11 - Array.from(isbnValue).map(Number).map((n, i) => n * (10 - i)).reduce((a, b) => a + b, 0) % 11) % 11 :
      Array.from(isbnValue).map(Number).slice(0, 12).map((n, i) => n * ((i % 2 === 0) ? 1 : 3)).reduce((a, b) => a + b, 0) % 10;
    if (isbnChecksum !== Number(isbnValue.charAt(isbnValue.length - 1))) {
      return 'Invalid ISBN checksum';
    }
    return '';
  }

  onSubmit(post) {
    console.log(post);
    this.post = post;
  }

}
