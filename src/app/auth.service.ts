import { Injectable } from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user;
  isAuth = false;
  authState$;

  constructor(public afAuth: AngularFireAuth) {
    this.authState$ = this.afAuth.authState;
    this.authState$.subscribe(user => {
      if (user) {
        this.user = user;
        this.isAuth = true;
      } else {
        this.user = null;
        this.isAuth = false;
      }
    });
  }

  doGoogleLogin() {
    return Observable.create((observer) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          observer.next(res);
        });
    });
  }

  doMailPasswordLogin(mail, password) {
    return Observable.create((observer) => {
      this.afAuth.auth.signInWithEmailAndPassword(mail, password).then(user => observer.next(user)).catch(error => {
        if (error.code === 'auth/user-not-found') {
          this.afAuth.auth.createUserWithEmailAndPassword(mail, password).then(user => observer.next(user)).catch(err => observer.error(err));
        } else {
          observer.error(error);
        }
      });
    });
  }

  logout() {
    return Observable.create((observer: Observer<any>) => {
      this.afAuth.auth.signOut().then((arg) => {
        observer.next(arg);
        observer.complete();
      }).catch(observer.error);
    });
  }

}
