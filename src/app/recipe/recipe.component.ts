import { Component, OnInit } from '@angular/core';

import { Chip, Meal } from '../main/main.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  all_ingredients!: Chip[];
  meal!: Meal;

  ngOnInit(): void {
  }

  getIngredientName(id: number): string {
    for (let ingredient of this.all_ingredients) {
      if (ingredient.id === id) {
        return ingredient.name;
      }
    }
    return 'Unknown';
  }
}
