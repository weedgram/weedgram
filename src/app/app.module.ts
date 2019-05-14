import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { ListPostsComponent } from './list-posts/list-posts.component';
import {RouterModule, Routes} from '@angular/router';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import {FormsModule} from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { ListUsersComponent } from './list-users/list-users.component';
import {AuthGuardService as AuthGuard} from './auth-guard.service';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {MarkdownModule} from 'ngx-markdown';
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule, MatIconModule, MatInputModule,
  MatProgressBarModule, MatProgressSpinnerModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FileDropModule } from 'ngx-file-drop';
import { CreatePostComponent } from './create-post/create-post.component';
import {ClipboardModule} from 'ngx-clipboard';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
const firebaseConfig = {
  apiKey: 'AIzaSyAOcBL60O2i-texQWvB8i3n2cUby8i21Dg',
  authDomain: 'weedgram-79d2d.firebaseapp.com',
  databaseURL: 'https://weedgram-79d2d.firebaseio.com',
  projectId: 'weedgram-79d2d',
  storageBucket: 'weedgram-79d2d.appspot.com',
  messagingSenderId: '118541139648',
  appId: '1:118541139648:web:0d7fddffac1305d2'
};
const appRoutes: Routes = [
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'create-post/:postId', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: ListPostsComponent, canActivate: [AuthGuard] },
  { path: 'posts/:userId', component: ListPostsComponent },
  { path: 'users', component: ListUsersComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', redirectTo: '/login', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'posts'}
];
@NgModule({
  declarations: [
    AppComponent,
    ListPostsComponent,
    LoginComponent,
    ProfileComponent,
    ListUsersComponent,
    ImageUploaderComponent,
    CreatePostComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatDialogModule,
    FileDropModule,
    FormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    ClipboardModule,
    MatProgressBarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    SimplemdeModule.forRoot({
      provide: SIMPLEMDE_CONFIG,
      // config options 1
      useValue: {}
    }),
    MarkdownModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    ),
    FormsModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [ImageUploaderComponent, ConfirmDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
