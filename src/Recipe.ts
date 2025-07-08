import type { ResourceType } from "./Resource";

export interface Recipe {
	inputs: { type: ResourceType; amount: number }[];
	output: { type: ResourceType; amount: number };
	craftTime: number; // in seconds
}

export const ironPlateRecipe: Recipe = {
	inputs: [{ type: "iron", amount: 1 }],
	output: { type: "iron-plate", amount: 1 },
	craftTime: 2,
};
