import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mail: string;
  password: string;

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.router.navigate(['posts']);
      }
    });
  }

  loginWithGoogle() {
    this.authService.doGoogleLogin().subscribe(res => {
      this.userService.getUser(res.user.uid).subscribe(user => {
        if (!user) {
          this.router.navigate(['profile']);
        } else {
          this.router.navigate(['posts']);
        }
      });
    });
  }

  loginWithMailPassword() {
    this.authService.doMailPasswordLogin(this.mail, this.password).subscribe((user) => {
      if (!user) {
        this.router.navigate(['profile']);
      } else {
        this.router.navigate(['posts']);
      }
    }, (error) => {
      this.snackBar.open(error.message, '', {duration: 4000});
    });
  }

}
