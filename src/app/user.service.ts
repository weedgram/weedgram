import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable, Observer} from 'rxjs';
import {AuthService} from './auth.service';

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  items: AngularFireList<User>;

  constructor(private db: AngularFireDatabase, private authService: AuthService) {

  }

  // noinspection JSUnusedGlobalSymbols
  getUsers(): Observable<User[]> {
    if (!this.authService.isAuth) { return; }
    this.items = this.db.list<User>(`users`);
    return this.items.valueChanges();
  }

  setUser(user: User) {
    if (!this.authService.isAuth) { return; }
    return this.db.database.ref('users').child(this.authService.user.uid).set(user);
  }

  getUser(userId: string = null): Observable<User> {
    if (!userId) {
      userId = this.authService.user.uid;
    }
    return Observable.create((observer: Observer<User>) => {
      this.db.database.ref(`users/${userId}`).once('value').then(snapshot => {
        observer.next(snapshot.val());
        observer.complete();
      });
    });
  }
}
