import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private userService: UserService, public router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> | boolean | UrlTree {
    return Observable.create(observer => {
      this.authService.authState$.subscribe(user => {
        if (user) {
          this.userService.getUser(user.uid).subscribe(userDb => {
            if (userDb) {
              observer.next(true);
            } else {
              if (route.url[0].path !== 'profile') {
                this.router.navigate(['profile']);
              }
              observer.next(true);
            }
            observer.complete();
          });
        } else {
          this.router.navigate(['login']);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

}
