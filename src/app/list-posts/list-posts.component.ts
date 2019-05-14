import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {LoadablePost, PostsService} from '../posts.service';
import { map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../auth.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserService} from '../user.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit {

  posts$: Observable<LoadablePost[]>;

  files: FileList;
  userId: string;
  url: string;
  userName$;

  constructor( public postsService: PostsService,
               private route: ActivatedRoute,
               private authService: AuthService,
               public snackbar: MatSnackBar,
               private userService: UserService,
               private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.route.snapshot.params.userId) {
      this.userId = this.route.snapshot.params.userId;
      this.userName$ = this.userService.getUser(this.userId).pipe(map(user => user.name));
    } else {
      this.url = window.location.origin + '/posts/' + this.authService.user.uid;
    }
    this.posts$ = this.postsService.getPosts(this.userId);
  }

  share() {
    this.snackbar.open('Share link copied to clipboard !', '', {
      duration: 4000,
    });
  }

  delete(key) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe(result => {
      if (result) {
        this.postsService.deletePost(key);
      }
    });
  }
}
