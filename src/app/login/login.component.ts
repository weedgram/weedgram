import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

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

}
