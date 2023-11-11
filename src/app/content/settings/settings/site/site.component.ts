import { combineLatest } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { Language } from 'src/http-client';
import { SiteLanguage } from '@app/shared/types/language.type';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';

import { settingsActions } from '../../store/actions';
import { selectUserSettings } from '../../store/reducers';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, TranslateModule, MatButtonModule],
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit {
  translate = inject(TranslateService);
  store = inject(Store);

  data$ = combineLatest({
    userSettings: this.store.select(selectUserSettings),
  });

  ngOnInit(): void {
    this.store.dispatch(settingsActions.getusersettings());
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
    this.store.dispatch(settingsActions.saveusersettings());
  }
}
