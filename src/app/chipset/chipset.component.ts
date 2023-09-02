import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

import { Chip } from '../main/main.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

const TAG = 'tag';
const INGREDIENT = 'ingredient';

@Component({
  selector: 'app-chipset',
  templateUrl: './chipset.component.html',
  styleUrls: ['./chipset.component.scss']
})
export class ChipsetComponent implements OnInit, AfterViewInit {

  @Input() type!: string;
  @Input() all_chips!: Chip[];
  @Input() filtered_chips!: Chip[];

  title!: string;
  acLabel!: string;
  acControl = new FormControl('');
  chipOptions!: string[];
  acFilteredOptions!: Observable<string[]>;

  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.title = this.type === TAG ? "Filter by tags" : "Filter by ingredients";
    this.acLabel = this.type === TAG ? "Tags" : "Ingredients";
    this.acFilteredOptions = this.acControl.valueChanges.pipe(
      startWith(''),
      map(value => this._ac_filter(value || '')),
    );
    this.chipOptions = this.all_chips.filter(chip => {
      return !this.filtered_chips.map(fc => fc.id).includes(chip.id);
    }).map(chip => chip.name);
  }

  ngAfterViewInit(): void {
    // Child is set
  }

  addChip(event: MatAutocompleteSelectedEvent) {
    for (let chip of this.all_chips) {
      if (chip.name === event.option.value) {
        this.filtered_chips.push(chip);
        break;
      }
    }
    this._ac_update();
  }

  removeChip(id: number) {
    this.filtered_chips = this.filtered_chips.filter(chip => chip.id !== id);
    this._ac_update();
  }

  private _ac_update() {
    this.chipOptions = this.all_chips.filter(chip => {
      return !this.filtered_chips.map(fc => fc.id).includes(chip.id);
    }).map(chip => chip.name);
    this.chipInput.nativeElement.value = '';
    this.acControl.setValue(null);
  }

  private _ac_filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.chipOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
}
