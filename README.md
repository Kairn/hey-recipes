# HeyRecipes :meat_on_bone:

[![Demo](https://img.shields.io/badge/View%20Demo-E91E63)](https://kairn.github.io/hey-recipes)

Help busy people manage their cooking recipes without paying premiums to get services from online meal kit providers; and it comes with much more freedom and customization options. With a little bit of setup work, anyone can deploy an independent instance of the application to start working on his/her very own meal plans.

## How to Get Started

### Prerequisites

- [Node.js](https://nodejs.org/en) version 18+.
- [Angular](https://angular.io) version 16+.

### Build and deploy

1. Clone the source code and change into the root directory.
2. Run `npm install` to install dependencies.
3. Create a `data.json` file with your recipe data according to the schema (explained below).
4. Run `ng serve -o` to see the how it renders.
5. Once satisfied, build with `ng build`.
6. Built assets will be at `./dist/hey-recipes`, which can be deployed to any web server as static website.

### Data schema

The `data.json` (resides in `src/assets/`) is what gives the application recipe data. This application CANNOT be mutated internally on the server side without a new deployment (browser cookie is supported too, explained later). The data file is a simple JSON file with the following 3 top level attributes. A sample data file can be found at `src/assets/data-sample.json`.

#### Tags

Tags can be used to filter meals for convenience (they are optional). Identified as `tags` (array) at the root of the data object; each array element contains 2 fields:

- **ID** - denoted as `id`, a number that uniquely identifies a tag.
- **Name** - denoted as `name`, the name of the tag.

You may have up to 50 tags.

#### Ingredients

Ingredients are reusable building blocks for meals. Identified as `ingredients` (array) at the root of the data object; each element has the same construction as a Tag.

You may have up to 100 tags.

#### Meals

Meals are your recipe definitions. Identified as `meals` (array) at the root of the data object; each element contains the following besides an ID and a name:

- **Picture URL** - denoted as `picUrl`, the url for the picture of the meal. For best viewing experience, the image should have equal height and width and at least "400x400" pixels large. This is optional, if not supplied, a placeholder image will show up.
- **Description** - denoted as `desc`, the description of the meal. Some short recipe instructions can be included.
- **Tags** - denoted as `tags`, an array of Tag IDs defined in the data.
- **Ingredients** - denoted as `ingredients`, similar to tags but with an additional `quantity` field. The quantity is a generic unit for each ingredient; typical 1 unit is 1 serving amount (unless the item is very countable, e.g. potatoes or eggs) for the meal. This can vary from person to person.

You may have up to 100 meals.

## Usage

### Basics

The interface is fairly self-explanatory, in the meals section, you can filter meals by tags and/or ingredients and select/unselect them by using the arrow buttons. Once done, click on `Checkout` to get the list of ingredients you need to prepare.

### Browser cookie integration

Though the application is "mostly" non-mutating (from server side), it does support using transient data cached inside each user's browser. If you have made a meal selection and would like to keep it after refresh, you can hit the `Capture` button on the top banner (rightmost button) to save a snapshot of the current state, and this will be automatically loaded when the application is opened again.

Using the Capture functionality, you may also modify the raw recipe data without redeployment. The application has an `Edit` button at the bottom section which allows inputting of a raw `data.json`. After applying and capturing, the new data will be persisted until the cookie goes away (easily cleaned by issuing `localStorage.clear()` in the console). This can be leveraged to more easily tweak and test your new recipes before deploying a committed version.

## Is this better than HelloFresh?

It depends. If you don't go shopping and are not a picky eater, using HelloFresh or other meal kit providers is probably more convenient. But if you would like to have more control and eliminate the unnecessary costs, then this app is ideal (and 100% free). The most tedious setup step is filling up the recipe data, but this is mostly an one-time work. You also need to remember how to cook things, but that should be easy once you have done it once (you can totally bring recipes from other places here).

## Credits

- [flaticon](https://www.flaticon.com) for some of the awesome SVGs.
- [Matt](https://www.svgbackgrounds.com) for some of the background assets.
- [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages) for the GitHub Pages deploy CLI.
