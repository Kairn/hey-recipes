import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ChipChange, ChipType } from '../chipset/chipset.component';

import * as rawData from '../../assets/data.json';

export interface Chip {
  readonly id: number;
  readonly name: string;
}

export interface Ingredient {
  readonly id: number;
  readonly quantity: number;
}

export interface IngredientDisplay {
  readonly name: string;
  quantity: number;
}

export interface Meal {
  readonly id: number;
  readonly name: string;
  readonly picUrl: string;
  readonly desc: string;
  readonly tags: number[];
  readonly ingredients: Ingredient[];
  amount: number;
}

export class RawData {
  tags: Chip[];
  ingredients: Chip[];
  meals: Meal[];

  constructor(rawData: any) {
    this.tags = rawData['tags'];
    this.ingredients = rawData['ingredients'];
    this.meals = rawData['meals'];
  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {

  private rawData!: RawData;
  private readonly defaultData!: RawData;
  rawDataDisplay = '';

  readonly TAG = ChipType.TAG;
  readonly INGREDIENT = ChipType.INGREDIENT;

  allTags!: Chip[];
  allIngredients!: Chip[];
  allMeals!: Meal[];

  filteredTags!: Chip[];
  filteredIngredients!: Chip[];
  filteredMeals!: Meal[];

  leftMeals!: Meal[];
  rightMeals!: Meal[];

  mealsRollup: Meal[] = [];
  ingredientsRollup: IngredientDisplay[] = [];

  showSummary = false;
  showRawData = false;

  @ViewChild('rawDataInput') rawDataInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.rawData = new RawData(rawData);
    this.defaultData = new RawData(rawData);
  }

  ngOnInit(): void {
    // TODO: Load data from cookies

    this._reloadRawData();
  }

  ngAfterViewInit(): void {
    // Child is set
  }

  processChipChange(change: ChipChange) {
    console.log(change);
  }

  doSummary() {
    this.mealsRollup = [];
    this.ingredientsRollup = [];

    let iMap = new Map<string, number>();
    for (let meal of this.filteredMeals) {
      if (meal.amount < 1) {
        continue;
      }
      this.mealsRollup.push(meal);
      for (let ingredient of meal.ingredients) {
        let iName = this._getIngredientName(ingredient.id);
        let iQuan = iMap.get(iName);
        iMap.set(iName, iQuan ? iQuan + ingredient.quantity * meal.amount : ingredient.quantity * meal.amount);
      }
    }

    if (this.mealsRollup.length > 0) {
      iMap.forEach((v, k) => this.ingredientsRollup.push({
        name: k,
        quantity: v,
      }))
      this.ingredientsRollup.sort((i1, i2) => i1.name.localeCompare(i2.name));
      this.showSummary = true;
    }
  }

  resetSummary() {
    this.allMeals.forEach(meal => meal.amount = 0);
    this.showSummary = false;
  }

  openRawData() {
    this.rawDataDisplay = JSON.stringify(this.rawData);
    this.showRawData = true;
  }

  applyRawData() {
    try {
      let tempData = JSON.parse(this.rawDataInput.nativeElement.value);
      this.rawData = tempData;
      this._reloadRawData();
    } catch (error) {
      console.error("Cannot parse raw JSON.");
    }
    this.showRawData = false;
  }

  private _filterMeals() {
    this.filteredMeals = this.allMeals.filter(meal => this._isMealDisplay(meal));
    this._distributeMeals();
  }

  private _isMealDisplay(meal: Meal): boolean {
    return true;
  }

  private _distributeMeals() {
    this.leftMeals = [];
    this.rightMeals = [];
    let rightCount = Math.floor(this.filteredMeals.length / 2);
    for (let i = 0; i < this.filteredMeals.length - rightCount; ++i) {
      this.leftMeals.push(this.filteredMeals[i]);
    }
    for (let i = this.filteredMeals.length - rightCount; i < this.filteredMeals.length; ++i) {
      this.rightMeals.push(this.filteredMeals[i]);
    }
  }

  private _getIngredientName(id: number): string {
    for (let ingredient of this.allIngredients) {
      if (id === ingredient.id) {
        return ingredient.name;
      }
    }
    return '';
  }

  private _reloadRawData() {
    this.allTags = this.rawData['tags'];
    this.allIngredients = this.rawData['ingredients'];
    this.allMeals = this.rawData['meals'];

    this.filteredTags = [];
    this.filteredIngredients = [];
    this.filteredMeals = [];

    this._filterMeals();
  }

  _dbg() {
    console.log(this.filteredIngredients);
    console.log(this.filteredTags);
    console.log(this.filteredMeals);
  }
}
