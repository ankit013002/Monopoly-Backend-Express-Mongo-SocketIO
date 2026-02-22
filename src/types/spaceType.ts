type Group =
  | "brown"
  | "lightBlue"
  | "pink"
  | "orange"
  | "red"
  | "yellow"
  | "green"
  | "darkBlue";

type SpaceEnums =
  | "corner"
  | "property"
  | "railroad"
  | "utility"
  | "tax"
  | "chance"
  | "community"
  | "special";

export type SpaceType = {
  id: number;
  name: string;
  type: SpaceEnums;
  price?: number;
  group?: Group;
  icon?: string;
  ownedBy?: string;
};
