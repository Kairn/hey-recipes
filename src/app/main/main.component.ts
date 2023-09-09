import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ChipChange, ChipType } from '../chipset/chipset.component';

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

export class UserData {
  userTags: Chip[];
  userIngredients: Chip[];
  userMeals: Meal[];
  isBlank: boolean;

  constructor(userData: any) {
    if (userData) {
      this.userTags = userData['userTags'];
      this.userIngredients = userData['userIngredients'];
      this.userMeals = userData['userMeals'];
      this.isBlank = false;
    } else {
      this.userTags = [];
      this.userIngredients = [];
      this.userMeals = [];
      this.isBlank = true;
    }
  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit {
  private _defaultData!: RawData;

  @Input() rawData!: RawData;
  rawDataDisplay = '';
  @Output() rawDataUpdateEvent = new EventEmitter<RawData>();

  @Input() userData!: UserData;
  @Output() userDataUpdateEvent = new EventEmitter<UserData>();

  readonly TAG = ChipType.TAG;
  readonly INGREDIENT = ChipType.INGREDIENT;

  allTags!: Chip[];
  allIngredients!: Chip[];
  allMeals!: Meal[];

  unselectedMeals!: Meal[];

  leftMeals!: Meal[];
  rightMeals!: Meal[];

  mealsRollup: Meal[] = [];
  ingredientsRollup: IngredientDisplay[] = [];

  showSummary = false;
  showRawData = false;

  @ViewChild('rawDataInput') rawDataInput!: ElementRef<HTMLInputElement>;

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this._defaultData = this.rawData;
    this._reloadRawData(false);
    this.unselectedMeals = this.userData.userMeals.filter(
      (m) => m.amount === 0,
    );
    this.userData.isBlank = false;
  }

  ngAfterViewInit(): void {
    // Child is set
  }

  processChipChange(change: ChipChange) {
    if (change.type === this.TAG) {
      this.userData.userTags = change.filteredChips;
    } else if (change.type === this.INGREDIENT) {
      this.userData.userIngredients = change.filteredChips;
    }

    this._filterMeals();
    this.unselectedMeals = this.userData.userMeals.filter(
      (m) => m.amount === 0,
    );
    this.userDataUpdateEvent.emit(this.userData);
  }

  rollMeal(count: number) {
    const unselected = this.unselectedMeals;
    if (unselected.length < 1) {
      return;
    }
    while (count-- > 0) {
      // Roll a random index
      let rolled = Math.floor(Math.random() * unselected.length);
      unselected[rolled].amount += 1;
      unselected.splice(rolled, 1);
    }
    this.userDataUpdateEvent.emit(this.userData);
  }

  onAmountUpdate() {
    this.unselectedMeals = this.userData.userMeals.filter(
      (m) => m.amount === 0,
    );
    this.userDataUpdateEvent.emit(this.userData);
  }

  doSummary() {
    this.mealsRollup = [];
    this.ingredientsRollup = [];

    let iMap = new Map<string, number>();
    for (let meal of this.userData.userMeals) {
      if (meal.amount < 1) {
        continue;
      }
      this.mealsRollup.push(meal);
      for (let ingredient of meal.ingredients) {
        let iName = this._getIngredientName(ingredient.id);
        let iQuan = iMap.get(iName);
        iMap.set(
          iName,
          iQuan
            ? iQuan + ingredient.quantity * meal.amount
            : ingredient.quantity * meal.amount,
        );
      }
    }

    if (this.mealsRollup.length > 0) {
      iMap.forEach((v, k) =>
        this.ingredientsRollup.push({
          name: k,
          quantity: v,
        }),
      );
      this.ingredientsRollup.sort((i1, i2) => i1.name.localeCompare(i2.name));
      this.showSummary = true;
    } else {
      this._snackBar.open('Pick a meal', '🍆', {
        duration: 4000,
      });
      this.showSummary = false;
    }
  }

  resetSummary() {
    this.allMeals.forEach((meal) => (meal.amount = 0));
    this.userData.userTags = [];
    this.userData.userIngredients = [];
    this.userData.userMeals = this.allMeals.filter((m) => true);
    this._distributeMeals();
    this.showSummary = false;
    this.userDataUpdateEvent.emit(this.userData);
    this.unselectedMeals = this.userData.userMeals.filter(
      (m) => m.amount === 0,
    );
  }

  openRawData() {
    this.rawDataDisplay = JSON.stringify(this.rawData);
    this.showRawData = true;
  }

  applyRawData() {
    try {
      let tempData = JSON.parse(this.rawDataInput.nativeElement.value);
      this._validateRawData(tempData);
      this.rawData = tempData;
      this._reloadRawData(true);
    } catch (error) {
      console.error('Cannot parse raw JSON.');
      console.error(error);
      this._snackBar.open('Bad data', '🥲', {
        duration: 4000,
      });
      this.rawData = this._defaultData;
      this._reloadRawData(true);
    }
    this.showRawData = false;
    this.rawDataUpdateEvent.emit(this.rawData);
    this.userDataUpdateEvent.emit(this.userData);
    this.unselectedMeals = this.userData.userMeals.filter(
      (m) => m.amount === 0,
    );
  }

  private _filterMeals() {
    this.userData.userMeals = this.allMeals.filter((meal) =>
      this._isMealDisplay(meal),
    );
    this._distributeMeals();
  }

  private _isMealDisplay(meal: Meal): boolean {
    let display = true;
    let tList = this.userData.userTags.map((t) => t.id);
    let iList = this.userData.userIngredients.map((i) => i.id);

    if (tList.length > 0) {
      display = false;
      for (let tag of meal.tags) {
        if (tList.includes(tag)) {
          return true;
        }
      }
    }

    if (iList.length > 0) {
      display = false;
      for (let ingredient of meal.ingredients) {
        if (iList.includes(ingredient.id)) {
          return true;
        }
      }
    }

    return display;
  }

  private _distributeMeals() {
    this.leftMeals = [];
    this.rightMeals = [];
    let rightCount = Math.floor(this.userData.userMeals.length / 2);
    for (let i = 0; i < this.userData.userMeals.length - rightCount; ++i) {
      this.leftMeals.push(this.userData.userMeals[i]);
    }
    for (
      let i = this.userData.userMeals.length - rightCount;
      i < this.userData.userMeals.length;
      ++i
    ) {
      this.rightMeals.push(this.userData.userMeals[i]);
    }
  }

  private _getIngredientName(id: number): string {
    for (let ingredient of this.allIngredients) {
      if (id === ingredient.id) {
        return ingredient.name;
      }
    }
    return 'Unknown';
  }

  private _reloadRawData(resetUserData: boolean) {
    this.allTags = this.rawData['tags'];
    this.allIngredients = this.rawData['ingredients'];
    this.allMeals = this.rawData['meals'];
    this.allMeals.forEach((m) => {
      if (!m.amount) {
        m.amount = 0;
      }
    });
    if (resetUserData || this.userData.isBlank) {
      this.userData.userTags = [];
      this.userData.userIngredients = [];
      this.userData.userMeals = this.allMeals.filter((m) => true);
    }
    this._distributeMeals();
  }

  private _validateRawData(rawData: any) {
    let tags: Chip[] = rawData['tags'];
    if (!tags) {
      tags = [];
    } else if (tags.length > 50) {
      throw new Error(
        `Not allowed to have more than 50 tags, got ${tags.length}`,
      );
    }
    let ingredients: Chip[] = rawData['ingredients'];
    if (!ingredients) {
      ingredients = [];
    } else if (ingredients.length > 100) {
      throw new Error(
        `Not allowed to have more than 100 ingredients, got ${ingredients.length}`,
      );
    }
    let meals: Meal[] = rawData['meals'];
    if (!meals) {
      meals = [];
    } else if (meals.length > 100) {
      throw new Error(
        `Not allowed to have more than 100 recipes, got ${meals.length}`,
      );
    }

    let idSet = new Set<number>();
    let nameSet = new Set<string>();

    // Check duplicate tags
    for (let tag of tags) {
      if (idSet.has(tag.id)) {
        throw new Error(`Duplicate Tag ID <${tag.id}> found`);
      }
      idSet.add(tag.id);
      if (nameSet.has(tag.name)) {
        throw new Error(`Duplicate Tag name <${tag.name}> found`);
      }
      nameSet.add(tag.name);
    }

    idSet.clear();
    nameSet.clear();

    // Check for duplicate ingredients
    for (let ingredient of ingredients) {
      if (idSet.has(ingredient.id)) {
        throw new Error(`Duplicate Tag ID <${ingredient.id}> found`);
      }
      idSet.add(ingredient.id);
      if (nameSet.has(ingredient.name)) {
        throw new Error(`Duplicate Tag name <${ingredient.name}> found`);
      }
      nameSet.add(ingredient.name);
    }

    idSet.clear();
    nameSet.clear();

    // Check for duplicate meals
    for (let meal of meals) {
      if (idSet.has(meal.id)) {
        throw new Error(`Duplicate Tag ID <${meal.id}> found`);
      }
      idSet.add(meal.id);
      if (nameSet.has(meal.name)) {
        throw new Error(`Duplicate Tag name <${meal.name}> found`);
      }
      nameSet.add(meal.name);
    }
  }

  _dbg() {
    // Debug print
  }
}
