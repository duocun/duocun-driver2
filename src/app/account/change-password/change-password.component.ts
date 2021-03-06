import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../account';
import { AuthService } from '../auth.service';

@Component({
    providers: [AuthService],
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    errMsg = '';
    user: User = new User();
    form: FormGroup;

    constructor(private fb:FormBuilder, private authServ:AuthService, private router:Router) {
        this.form = this.fb.group({
            password:['', Validators.required],
            newPassword:['', Validators.required],
            confirmPassword:['', Validators.required]
        })
    }

    ngOnInit() {
    }

    changePassword() {
        let self = this;
        if (this.form.valid) {
            
        }else{
            self.errMsg = "INVALID_PASSOWRD";
        }  
    }
    
    updateAccount() {
    
    }
    
    updatePassword(){

    }
}
