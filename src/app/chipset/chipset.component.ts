import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-chipset',
  templateUrl: './chipset.component.html',
  styleUrls: ['./chipset.component.scss']
})
export class ChipsetComponent implements OnInit {

  acControl = new FormControl('');
  chipOptions: string[] = ['Chip1', 'Hello my friend', '?'];
  acFilteredOptions!: Observable<string[]>; // Assigned in `ngOnInit`

  ngOnInit() {
    this.acFilteredOptions = this.acControl.valueChanges.pipe(
      startWith(''),
      map(value => this._ac_filter(value || '')),
    );
  }

  removeChip() {
    console.log('Removed chip test');
  }

  private _ac_filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.chipOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
}
