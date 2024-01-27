import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type OpenAiRecipe = {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  totalTime: string;
  cuisineType: string;
  description: string;
  image?: string;
  saved: boolean;
};