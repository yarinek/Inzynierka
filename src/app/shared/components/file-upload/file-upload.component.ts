import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from '@app/core/services/toast.service';

import { FileUploadTypes } from './file-upload.types';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Input() type: FileUploadTypes = FileUploadTypes.IMAGE;
  @Output() emitFile = new EventEmitter<File | null>();
  http = inject(HttpClient);
  toast = inject(ToastrService);
  fileName = '';

  get accept(): string {
    switch (this.type) {
      case FileUploadTypes.IMAGE:
        return '.jpg,.jpeg,.png';
      case FileUploadTypes.AUDIO:
        return 'audio/mpeg, .mpeg, .ogg, .webp';
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this.emitFile.emit(null);
      return;
    }

    if (!this.isCorrectType(file.type)) {
      this.toast.error('errors.fileNotSupported');
      this.emitFile.emit(null);
      return;
    }

    this.fileName = file.name;

    this.emitFile.emit(file);
  }

  isCorrectType(fileType: string): boolean {
    if (this.type === FileUploadTypes.IMAGE) {
      return ['image/jpeg', 'image/png'].includes(fileType);
    }
    if (this.type === FileUploadTypes.AUDIO) {
      return ['video/mpeg', 'audio/ogg', 'audio/webm', 'audio/mpeg'].includes(fileType);
    }
    return false;
  }
}
