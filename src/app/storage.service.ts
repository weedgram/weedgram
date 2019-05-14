import { Injectable } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private afStorage: AngularFireStorage, private authService: AuthService) { }

  uploadPostPic(postId: string, file: File, fileName: string) {
      return Observable.create(observer => {
        const upload = this.afStorage.upload(`posts/${this.authService.user.uid}/${postId}/${fileName}`, file);
        upload.percentageChanges().subscribe(percentage => {
          observer.next({fileName, progress: percentage, ended: false});
        });
        upload.then(() => {
          observer.next({fileName, progress: 100, ended: true});
        });
      });
  }

  getImageUrl(postId, fileName, userId?: string) {
    if (userId == null) {
      userId = this.authService.user.uid;
    }
    return Observable.create(observer => {
      this.afStorage.storage.ref(`posts/${userId}/${postId}/${fileName}`).getDownloadURL().catch(observer.catch).then(url => {
        observer.next(url);
      });
    });
  }

  getPostImages(postId: string, files: string[], userId?: string) {
    if (userId == null) {
      userId = this.authService.user.uid;
    }
    return Observable.create(observer => {
      let i = files.length;
      const urls = {};
      files.map(file => {
        this.afStorage.storage.ref(`posts/${userId}/${postId}/${file}`).getDownloadURL().catch(observer.catch).then(url => {
          urls[file] = url;
          i--;
          if (i === 0) {
            observer.next(urls);
          }
        });
      });
    });
  }
}
