import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type OpenAiRecipe = {
  title: string;
  ingredients: string[];
  steps: string[];
  totalTime: string;
  cuisineType: string;
  description: string;
  image: string;
};

export type EdamamResponse = {
  q: string;
  from: number;
  to: number;
  more: boolean;
  count: number;
  hits: EdamamHit[];
};

export type EdamamHit = {
  recipe: EdamamRecipe;
};

export type EdamamRecipe = {
  uri: string;
  label: string;
  image: string;
  source: string;
  url: string;
  shareAs: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: EdamamIngredient[];
  calories: number;
  totalWeight: number;
  totalTime: number;
  totalNutrients: EdamamNutrient[];
  totalDaily: EdamamNutrient[];
  digest: EdamamDigest[];
  cuisineType?: string[];
};

export type EdamamIngredient = {
  text: string;
  weight: number;
};

export type EdamamNutrient = {
  label: string;
  quantity: number;
  unit: string;
};

export type EdamamDigest = {
  label: string;
  tag: string;
  schemaOrgTag: string;
  total: number;
  hasRDI: boolean;
  daily: number;
  unit: string;
  sub?: EdamamDigest[];
};