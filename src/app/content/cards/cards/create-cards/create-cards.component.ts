import { TranslateModule } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@app/shared/components/input/input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CardContentElementType, CardCreateRequest } from 'src/http-client';

@Component({
  selector: 'app-create-cards',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatButtonModule, TranslateModule],
  templateUrl: './create-cards.component.html',
  styleUrls: ['./create-cards.component.scss'],
})
export class CreateCardsComponent implements OnInit {
  dialogRef = inject(MatDialogRef);
  store = inject(Store);
  fb = inject(FormBuilder);
  dialogData = inject(MAT_DIALOG_DATA) as CardCreateRequest | undefined;

  formArray = this.fb.array([
    this.fb.group({
      front: ['', Validators.required],
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
    this.dialogRef.close(this.convertToCreateCardRequest(this.formArray.value as { front: string; back: string }[]));
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  addForm(): void {
    this.formArray.push(
      this.fb.group({
        front: ['', Validators.required],
        back: ['', Validators.required],
      }),
    );
  }

  removeForm(): void {
    this.formArray.removeAt(this.formArray.length - 1);
  }

  convertToCreateCardRequest(data: { front: string; back: string }[]): CardCreateRequest {
    const result: CardCreateRequest = {
      front: [],
      back: [],
    };

    data.forEach((card) => {
      result.front.push({
        type: CardContentElementType.Text,
        content: card.front,
      });

      result.back.push({
        type: CardContentElementType.Text,
        content: card.back,
      });
    });

    return result;
  }

  convertToFormArray(data: CardCreateRequest): { front: string; back: string }[] {
    const result = [];

    for (let i = 0; i < data.front.length; i++) {
      const frontContent = data.front[i].content;
      const backContent = data.back[i].content;

      result.push({
        front: frontContent,
        back: backContent,
      });
    }

    return result;
  }
}
