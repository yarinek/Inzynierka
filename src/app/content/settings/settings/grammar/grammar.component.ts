import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { selectGrammarList } from '@app/content/exercises/store/reducers';
import { GrammarListEntry, UserGrammarSettingsUpsert } from 'src/http-client';
import { SelectOptionInterface } from '@app/shared/components/select/select.types';

import { selectGrammarSettings } from '../../store/reducers';
import { settingsActions } from '../../store/actions';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SelectComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
  ],
  templateUrl: './grammar.component.html',
  styleUrls: ['./grammar.component.scss'],
})
export class GrammarComponent implements OnInit {
  store = inject(Store);
  data$ = combineLatest({
    grammarSettings: this.store.select(selectGrammarSettings),
    grammarList: this.store.select(selectGrammarList).pipe(
      map((data: GrammarListEntry[]) =>
        data.map(({ grammar, useCases }) => ({
          useCases: useCases?.map((val) => ({ value: val, label: val })),
          value: grammar as string,
          label: grammar as string,
        })),
      ),
    ),
  });

  fb = inject(FormBuilder);

  formArray = this.fb.array([this.getFormGroup()]);

  ngOnInit(): void {
    this.store.dispatch(settingsActions.getgrammarsettings());
    this.data$.pipe(filter((r) => !!r)).subscribe(({ grammarSettings }) => {
      grammarSettings?.results?.forEach((val, index) => {
        if (index !== 0) {
          this.addGrammar();
        }
        this.formArray.at(index).patchValue(val);
      });
    });
  }

  protected save(): void {
    this.store.dispatch(
      settingsActions.savegrammarsettings({
        userGrammarSettingsUpsert: this.formArray.value as UserGrammarSettingsUpsert[],
      }),
    );
  }

  protected addGrammar(): void {
    this.formArray.push(this.getFormGroup());
  }

  protected removeGrammar(index: number): void {
    this.formArray.removeAt(index);
  }

  protected getGrammarList(
    data: {
      useCases:
        | {
            value: string;
            label: string;
          }[]
        | undefined;
      value: string;
      label: string;
    }[],
    index: number,
  ): SelectOptionInterface[] {
    const currentGrammar = this.formArray.at(index).value.grammar as string;
    const choosenGrammars = this.formArray.value.map((val: { grammar: string }) => val.grammar);
    const grammarList = data.filter((val) => {
      if (val.value === currentGrammar) {
        return true;
      }
      return !choosenGrammars.includes(val.value);
    });
    return grammarList;
  }

  protected getUseCases(
    data: {
      useCases:
        | {
            value: string;
            label: string;
          }[]
        | undefined;
      value: string;
      label: string;
    }[],
    form: FormGroup,
  ): SelectOptionInterface[] {
    return data.find((el) => el.value === form.get('grammar')?.value)?.useCases || [];
  }

  private getFormGroup(): FormGroup {
    return this.fb.group({
      grammar: this.fb.control('', [Validators.required]),
      enabledUseCases: this.fb.control('', [Validators.required]),
    });
  }
}
