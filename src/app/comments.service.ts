import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoadablePost, Post} from './posts.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from './auth.service';

export interface Comment {
  comment: string;
  createdAt: number;
  userId: string;
  key?: string;
  userName?: string;
  updatedAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  comments;

  constructor(private db: AngularFireDatabase, private authService: AuthService) { }



  getComments(userId: string, postId: string): Observable<LoadablePost[]> {
    this.comments = this.db.list<Comment>(`posts/${userId}/${postId}/comments`);
    return this.comments.snapshotChanges().pipe(map(comments => {
      return comments.map(commentSnapshot => {
        return {
          ...commentSnapshot.payload.exportVal(),
          key: commentSnapshot.key
        };
      }).sort((a, b) => b.createdAt - a.createdAt);
    }));
  }


  createComment(userId: string, postId: string, comment: Comment) {
    if (!this.authService.isAuth) { return; }
    const commentId = comment.key;
    delete comment.key;
    return this.db.database.ref(`posts/${userId}/${postId}/${commentId}`).set(comment);
  }

  deleteComment(userId: string, postId: string, commentId: string) {
    return this.db.database.ref(`posts/${userId}/${postId}/${commentId}`).remove();
  }
}
