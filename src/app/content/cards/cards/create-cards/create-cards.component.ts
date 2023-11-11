import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@app/shared/components/input/input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CardContentElementType } from 'src/http-client';

@Component({
  selector: 'app-create-cards',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatButtonModule],
  templateUrl: './create-cards.component.html',
  styleUrls: ['./create-cards.component.scss'],
})
export class CreateCardsComponent implements OnInit {
  dialogRef = inject(MatDialogRef);
  store = inject(Store);
  fb = inject(FormBuilder);
  dialogData = inject(MAT_DIALOG_DATA) as { front: string; back: string };

  form = this.fb.group({
    front: ['', Validators.required],
    back: ['', Validators.required],
  });

  get isEdit(): boolean {
    return !!this.dialogData;
  }

  ngOnInit(): void {
    this.form.patchValue({ ...this.dialogData });
  }

  onConfirm(): void {
    const { front, back } = this.form.getRawValue();
    this.dialogRef.close({
      front: [{ type: CardContentElementType.Text, content: front }],
      back: [{ type: CardContentElementType.Text, content: back }],
    });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
