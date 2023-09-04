import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Chip } from '../main/main.component';

export enum ChipType {
  TAG = 'tag',
  INGREDIENT = 'ingredient'
}

export interface ChipChange {
  readonly type: ChipType;
  readonly filteredChips: Chip[];
}

@Component({
  selector: 'app-chipset',
  templateUrl: './chipset.component.html',
  styleUrls: ['./chipset.component.scss']
})
export class ChipsetComponent implements OnInit, AfterViewInit {

  @Input() type!: ChipType;
  @Input() allChips!: Chip[];
  @Input() filteredChips!: Chip[];

  @Output() chipChangeEvent = new EventEmitter<ChipChange>();

  title!: string;
  acLabel!: string;
  acControl = new FormControl('');
  chipOptions!: string[];
  acFilteredOptions!: Observable<string[]>;

  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.title = this.type === ChipType.TAG ? "Filter by tags" : "Filter by ingredients";
    this.acLabel = this.type === ChipType.TAG ? "Tags" : "Ingredients";
    this.acFilteredOptions = this.acControl.valueChanges.pipe(
      startWith(''),
      map(value => this._ac_filter(value || '')),
    );
    this.chipOptions = this.allChips.filter(chip => {
      return !this.filteredChips.map(fc => fc.id).includes(chip.id);
    }).map(chip => chip.name);
  }

  ngAfterViewInit(): void {
    // Child is set
  }

  addChip(event: MatAutocompleteSelectedEvent) {
    let addedChip = null;
    for (let chip of this.allChips) {
      if (chip.name === event.option.value) {
        addedChip = chip;
        this.filteredChips.push(chip);
        break;
      }
    }
    this._ac_update();
    this.chipChangeEvent.emit({
      type: this.type,
      filteredChips: this.filteredChips,
    });
  }

  removeChip(id: number) {
    this.filteredChips = this.filteredChips.filter(chip => chip.id !== id);
    this._ac_update();
    this.chipChangeEvent.emit({
      type: this.type,
      filteredChips: this.filteredChips,
    });
  }

  private _ac_update() {
    this.chipOptions = this.allChips.filter(chip => {
      return !this.filteredChips.map(fc => fc.id).includes(chip.id);
    }).map(chip => chip.name);
    this.chipInput.nativeElement.value = '';
    this.acControl.setValue(null);
  }

  private _ac_filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.chipOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
}
