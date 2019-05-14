import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  nickName: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      if (user) {
        this.nickName = user.name;
      }
    });
  }

  setProfile() {
    this.userService.setUser({name: this.nickName});
  }

}
