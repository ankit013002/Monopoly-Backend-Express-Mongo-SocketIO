export type TradeType = {
  from: string;
  to: string;
  offer: {
    money: number;
    properties: number[];
  };
  request: {
    money: number;
    properties: number[];
  };
};
