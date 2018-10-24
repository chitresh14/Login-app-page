import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl,Validator, Validators} from '@angular/forms';
import { UserService } from '../user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerform:FormGroup = new FormGroup({
    email:new FormControl(null,[Validators.email,Validators.required]),
    username:new FormControl(null,[Validators.required]),
    password:new FormControl(null, [Validators.required]),
    cpass:new FormControl(null,[Validators.required])
  })
  constructor(private _router:Router, private _userService:UserService) { }

  ngOnInit() {
  }
  navigatelogin(){
    this._router.navigate(['/login']);
  }
  register(){
    if(!this.registerform.valid || (this.registerform.controls.password.value!== this.registerform.controls.cpass.value)){
      console.log('Invalid Form');
      return;
    }
    console.log(JSON.stringify(this.registerform.value))
    
    this._userService.register(JSON.stringify(this.registerform.value))
    .subscribe(
      data => {
        console.log(data); 
        this._router.navigate(['/login']);
      },
      error =>console.error(error)
    )};
}
