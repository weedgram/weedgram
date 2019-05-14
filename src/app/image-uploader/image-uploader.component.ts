import {ChangeDetectorRef, Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FileSystemFileEntry} from 'ngx-file-drop';
import {StorageService} from '../storage.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {
  postId: string;
  progress: number;
  uploading = false;
  constructor( private snackbar: MatSnackBar, private storageService: StorageService, @Inject(MAT_DIALOG_DATA) public data,
               public dialogRef: MatDialogRef<ImageUploaderComponent>, private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
    this.postId = data.postId;
  }

  ngOnInit() {
  }

  uploadFile(file, fileName) {
    this.storageService.uploadPostPic(this.postId, file, fileName).subscribe(progress => {
      if (!progress.ended) {
        this.progress = progress.progress;
        this.cdRef.detectChanges();
      } else {
        this.storageService.getImageUrl(this.postId, progress.fileName).subscribe(url => {
          this.ngZone.run(() => {
            this.dialogRef.close({url});
          });
        });
      }
    });
  }

  fileSelected(files: FileList) {
    this.removeExifAndUpload(files.item(0));
  }

  removeExifAndUpload(file: File) {
    this.uploading = true;
    const fileName = uuid();
    if (file.type === 'image/jpeg') {
      const fr = new FileReader();
      fr.onload = () => {
        const test = this.process(fr);
        const fileWithoutExif = new File(test, fileName, {type: file.type});
        this.uploadFile(fileWithoutExif, uuid());
      };
      fr.readAsArrayBuffer(file);
    } else {
      this.uploadFile(file, uuid());
    }
  }

  dropped(event) {
    if (event.files.length > 1) {
      return this.snackbar.open('You can only upload one image at a time');
    }
    if (this.uploading) {
      return this.snackbar.open('There already is an upload in progress');
    }
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => this.removeExifAndUpload(file));
      } else {
        return this.snackbar.open('You can only upload one image at a time');
      }
    }
  }
  process(fr) {
    const dv = new DataView(fr.result);
    let offset = 0;
    let recess = 0;
    const pieces = [];
    let i = 0;
    const newPieces = [];
    if (dv.getUint16(offset) === 0xffd8) {
      offset += 2;
      let app1 = dv.getUint16(offset);
      offset += 2;
      while (offset < dv.byteLength) {
        if (app1 === 0xffe1) {

          pieces[i] = {recess, offset: offset - 2};
          recess = offset + dv.getUint16(offset);
          i++;
        } else if (app1 === 0xffda) {
          break;
        }
        offset += dv.getUint16(offset);
        app1 = dv.getUint16(offset);
        offset += 2;
      }
      if (pieces.length > 0) {
        pieces.forEach((v) => {
          newPieces.push(fr.result.slice(v.recess, v.offset));
        });
        // @ts-ignore
        newPieces.push(fr.result.slice(recess));

      }
    }
    return newPieces;
  }


}
