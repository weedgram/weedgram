import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Post, PostsService} from '../posts.service';
import {ActivatedRoute} from '@angular/router';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  postId: string;
  userId: string;
  post$: Observable<Post>;

  constructor(private postsService: PostsService, private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit() {
    this.postId = this.route.snapshot.params.postId;
    this.userId = this.route.snapshot.params.userId;
    this.post$ = this.postsService.getPost(this.postId);
  }

  delete() {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe(result => {
      if (result) {
        this.postsService.deletePost(this.postId);
      }
    });
  }

}
