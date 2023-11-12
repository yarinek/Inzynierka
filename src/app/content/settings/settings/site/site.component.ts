import { combineLatest, filter } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { DefaultUserDeckSettings, DefaultUserGrammarSettings, Language } from 'src/http-client';
import { SiteLanguage } from '@app/shared/types/language.type';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from '@app/shared/components/input/input.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { settingsActions } from '../../store/actions';
import { selectUserSettings } from '../../store/reducers';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    TranslateModule,
    MatButtonModule,
    InputComponent,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit {
  translate = inject(TranslateService);
  store = inject(Store);
  fb = inject(FormBuilder);

  deckForm = this.fb.group(
    {
      newCardsPerDay: [0],
      easyRate: [0],
      hardRate: [0],
      maxInterval: [0],
      minIntervalIncrease: [0],
      globalEaseModifier: [0],
      intervalRateAfterFail: [0],
      leechThreshold: [0],
      newCardSteps: [[0]],
    },
    { updateOn: 'blur' },
  );

  grammarForm = this.fb.group(
    {
      maxInterval: [0],
      intervalRateAfterFail: [0],
      failThreshold: [0],
      exercisesPerDay: [0],
    },
    { updateOn: 'blur' },
  );

  data$ = combineLatest({
    userSettings: this.store.select(selectUserSettings),
  });

  ngOnInit(): void {
    this.store.dispatch(settingsActions.getusersettings());
    this.data$.pipe(filter((r) => !!r)).subscribe(({ userSettings }) => {
      this.deckForm.patchValue({ ...userSettings?.defaultDecksSettings });
      this.grammarForm.patchValue({ ...userSettings?.defaultGrammarSettings });
    });
  }

  changeLanguage(event: MatButtonToggleChange): void {
    const language = event.value as Language;
    this.translate.use(SiteLanguage[language]);
    this.store.dispatch(settingsActions.changedisplaylanguage({ language }));
  }

  changeInstructionLanguage(event: MatButtonToggleChange): void {
    const language = event.value as Language;
    this.store.dispatch(settingsActions.changeinstructionlanguage({ language }));
  }

  save(): void {
    this.store.dispatch(
      settingsActions.changedecksettings({ deckSettings: this.deckForm.getRawValue() as DefaultUserDeckSettings }),
    );
    this.store.dispatch(
      settingsActions.changegrammarsettings({
        grammarSettings: this.grammarForm.getRawValue() as DefaultUserGrammarSettings,
      }),
    );
    this.store.dispatch(settingsActions.saveusersettings());
  }
}
