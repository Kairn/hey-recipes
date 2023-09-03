import { Component, Input, OnInit } from '@angular/core';

import { Chip, Meal } from '../main/main.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  @Input() allIngredients!: Chip[];
  @Input() meal!: Meal;

  picUrl!: string;

  ngOnInit(): void {
    this.meal.amount = 0;
    this.picUrl = this.meal.picUrl ? this.meal.picUrl : '../../assets/meal-placeholder.svg';
  }

  moreMeal() {
    this.meal.amount++;
  }

  fewerMeal() {
    this.meal.amount--;
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
