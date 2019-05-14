import { Component, OnInit } from '@angular/core';
import {ImageUploaderComponent} from '../image-uploader/image-uploader.component';
import {filter} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import { v4 as uuid } from 'uuid';
import {Post, PostsService} from '../posts.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  post: Post;
  loading = false;


  toolbar = [
    'bold',
    'italic',
    'strikethrough',
    'heading',
    '|',
    'quote',
    'unordered-list',
    'ordered-list',
    '|',
    'link',
    {
      name: 'custom',
      action: (editor) => {
        // SimpleMDE.drawImage()
        this.dialog.open(ImageUploaderComponent, {
          width: '300px',
          data: {postId: this.post.key}
        }).afterClosed().pipe(filter(data => data && data.url)).subscribe(({url}) => {
          const cm = editor.codemirror;
          cm.replaceSelection('![' + cm.getSelection() + '](' + url + ')');
        });
      },
      className: 'fa fa-picture-o',
      title: 'Image',
    },
    '|',
    'preview',
    'side-by-side',
    'fullscreen',
    '|',
    'guide'
  ];

  constructor(private postsService: PostsService, public dialog: MatDialog, public route: ActivatedRoute, public router: Router) {
  }

  ngOnInit() {
    this.post = {
      key: uuid(),
      body: '',
      title: '',
    };
    if (this.route.snapshot.params.postId) {
      this.loading = true;
      this.postsService.getPost(this.route.snapshot.params.postId).subscribe(post => {
        this.post = post;
        this.loading = false;
      });
    }
  }

  sendPost() {
    const regex = new RegExp([
      /(!\[.*]\()/      // Capture user label : '[....]('
      , /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/weedgram-79d2d\.appspot\.com\/o\/posts%2F[a-zA-Z\d]+%2F[a-f\d\-]+%2F/ // FB URL
      , /([a-f\d\-]+)/     // Capture image ID
      , /\?[a-z&=0-9-]+\)/gm                 // request
     ].map(r => r.source).join(''));
    this.post.body = this.post.body.replace(regex, '$1$2)');
    if (this.post.createdAt) {
      this.post.updatedAt = Date.now();
    } else {
      this.post.createdAt = Date.now();
    }
    this.postsService.createPost(this.post).then(() => {
      this.router.navigate(['/posts']);
    });
  }

}
