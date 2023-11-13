import { TranslateModule } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@app/shared/components/input/input.component';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CardContentElementType, CardCreateRequest } from 'src/http-client';
import { SelectOptionInterface } from '@app/shared/components/select/select.types';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { FileUploadComponent } from '@app/shared/components/file-upload/file-upload.component';
import { FileUploadTypes } from '@app/shared/components/file-upload/file-upload.types';

@Component({
  selector: 'app-create-cards',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule,
    SelectComponent,
    FileUploadComponent,
  ],
  templateUrl: './create-cards.component.html',
  styleUrls: ['./create-cards.component.scss'],
})
export class CreateCardsComponent implements OnInit {
  dialogRef = inject(MatDialogRef);
  store = inject(Store);
  fb = inject(FormBuilder);
  dialogData = inject(MAT_DIALOG_DATA) as CardCreateRequest | undefined;
  fileTypes = FileUploadTypes;
  cardTypeOption: SelectOptionInterface[] = [
    { value: CardContentElementType.Text, label: 'Text' },
    { value: CardContentElementType.Audio, label: 'Audio' },
    { value: CardContentElementType.Image, label: 'Image' },
  ];

  formArray = this.fb.array([
    this.fb.group({
      frontType: [CardContentElementType.Text, Validators.required],
      front: ['', Validators.required],
      backType: [CardContentElementType.Text, Validators.required],
      back: ['', Validators.required],
    }),
  ]);

  get isEdit(): boolean {
    return !!this.dialogData;
  }

  get isValid(): boolean {
    return this.formArray.valid;
  }

  ngOnInit(): void {
    if (this.isEdit) {
      this.setFormValue();
    }
  }

  setFormValue(): void {
    this.dialogData?.front.forEach((_, i) => {
      if (i == 0) return;
      this.addForm();
    });
    this.formArray.setValue(this.convertToFormArray(this.dialogData as CardCreateRequest));
  }

  onConfirm(): void {
    this.dialogRef.close(
      this.convertToCreateCardRequest(
        this.formArray.value as {
          frontType: CardContentElementType;
          front: string;
          backType: CardContentElementType;
          back: string;
        }[],
      ),
    );
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  addForm(): void {
    this.formArray.push(
      this.fb.group({
        frontType: [CardContentElementType.Text, Validators.required],
        front: ['', Validators.required],
        backType: [CardContentElementType.Text, Validators.required],
        back: ['', Validators.required],
      }),
    );
  }

  removeForm(): void {
    this.formArray.removeAt(this.formArray.length - 1);
  }

  convertToCreateCardRequest(
    data: { frontType: CardContentElementType; front: string; backType: CardContentElementType; back: string }[],
  ): CardCreateRequest {
    const result: CardCreateRequest = {
      front: [],
      back: [],
    };

    data.forEach((card) => {
      result.front.push({
        type: card.frontType,
        content: card.front,
      });

      result.back.push({
        type: card.backType,
        content: card.back,
      });
    });

    return result;
  }

  convertToFormArray(
    data: CardCreateRequest,
  ): { frontType: CardContentElementType; front: string; backType: CardContentElementType; back: string }[] {
    const result = [];

    for (let i = 0; i < data.front.length; i++) {
      const frontContent = data.front[i].content;
      const backContent = data.back[i].content;

      result.push({
        frontType: data.front[i].type,
        front: frontContent,
        backType: data.back[i].type,
        back: backContent,
      });
    }

    return result;
  }

  protected onFileSelected(file: File, control: AbstractControl): void {
    control.patchValue(file);
  }
}
