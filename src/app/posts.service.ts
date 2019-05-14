import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth.service';
import {flatMap, map} from 'rxjs/operators';
import {StorageService} from './storage.service';

export interface Post {
  body: string;
  title: string;
  createdAt?: number;
  updatedAt?: number;
  key?: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export interface LoadablePost extends Omit<Post, 'body'> {
  body: Observable<string>;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts: AngularFireList<Post>;

  constructor(private db: AngularFireDatabase, private authService: AuthService, private storageService: StorageService) {

  }

  loadFileImage(post, files, userId) {
    return this.storageService.getPostImages(post.key, files, userId);
  }

  loadImageUrls(body, post, userId): Observable<string> {
    const regex = /(!\[[^\]]*]\()([a-f\d\-]+)\)/gm;
    const files = [];
    let hasMatch = false;
    for (let group = regex.exec(body); group !== null; group = regex.exec(body)) {
      // This is necessary to avoid infinite loops with zero-width matches
      hasMatch = true;
      if (group.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      files.push(group[2]);
    }
    if (!hasMatch) {
      return of(body);
    } else {
      return this.loadFileImage(post, files, userId).pipe(map(urls => {
        body = body.replace(regex, (match, p1, p2) => {
          return p1 + urls[p2] + ')';
        });
        return body;
      }));
    }
  }

  getPosts(userId?: string): Observable<LoadablePost[]> {
    if (!userId && !this.authService.isAuth) { return; }
    if (!userId) {
      userId = this.authService.user.uid;
    }
    this.posts = this.db.list<Post>(`posts/${userId}`);
    return this.posts.snapshotChanges().pipe(map(posts => {
      return posts.map(postSnapshot => {
        const post: Post = {
          ...postSnapshot.payload.exportVal(),
          key: postSnapshot.key
        };
        return {
          ...post,
          body: this.loadImageUrls(post.body, post, userId)
        };
      }).sort((a, b) => b.createdAt - a.createdAt);
    }));
  }

  getPost(postId): Observable<Post> {
    if ( !this.authService.isAuth) { return; }
    return this.db.object<Post>(`posts/${this.authService.user.uid}/${postId}`).valueChanges().pipe(flatMap(post => {
      post = {
        ...post,
        key: postId
      };
      return this.loadImageUrls(post.body, post, this.authService.user.uid).pipe(map(body => {
        return {
          ...post,
          body
        };
      }));
    }));
  }

  /*

   */
  createPost(post: Post) {
    if (!this.authService.isAuth) { return; }
    const postId = post.key;
    delete post.key;
    return this.db.database.ref(`posts/${this.authService.user.uid}/${postId}`).set(post);
  }

  deletePost(postId: string) {
    return this.db.database.ref(`posts/${this.authService.user.uid}/${postId}`).remove();
  }
}
