import {Component, OnInit} from '@angular/core';
import {ContractService} from "../../services/contract/contract.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

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
        if (!this.owner) {
          this.router.navigate(['/home'])
        }
      }).catch((error: any) => {
      this.router.navigate(['/account'])
    });
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
      'isbn': [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      'name': [null, Validators.required],
      'url': [null, Validators.required],
      'price': [null, [Validators.required, Validators.pattern(/^\d+$/)]]
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
    if (isbnValue.length !== 13) {
      return 'Invalid ISBN length';
    }
  }

  async onSubmit(post) {
    console.log(post);
    this.post = post;
    debugger;
    if (await this.contract.addBook(post.isbn, post.price, this.direction)) {
      Swal.fire({
        icon: 'success',
        title: 'Successo',
        text: "eBook aggiunto!",
      }).then(status => this.router.navigate(['/home']))
    }

  }

}
