import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Chip, Meal } from '../main/main.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @Input() allIngredients!: Chip[];
  @Input() meal!: Meal;

  @Output() amountUpdateEvent = new EventEmitter<void>();

  picUrl!: string;

  ngOnInit(): void {
    if (!this.meal.amount) {
      this.meal.amount = 0;
    }
    this.picUrl = this.meal.picUrl
      ? this.meal.picUrl
      : './assets/meal-placeholder.svg';
  }

  moreMeal() {
    this.meal.amount++;
    this.amountUpdateEvent.emit();
  }

  fewerMeal() {
    this.meal.amount--;
    this.amountUpdateEvent.emit();
  }

  getIngredientName(id: number): string {
    for (let ingredient of this.allIngredients) {
      if (ingredient.id === id) {
        return ingredient.name;
      }
    }
    return 'Unknown';
  }
}
