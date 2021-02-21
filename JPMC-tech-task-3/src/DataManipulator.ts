import { ServerRespond } from './DataStreamer';
//edit initialization to account for ratio
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator
 {
  static generateRow(serverRespond: ServerRespond[]): Row 
  {
    //price of each stock  is average of asking and bidding price
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
    //ratio is the comparision of each stock
    const ratio = priceABC/priceDEF;
    // bounds are set 
    const lowerBound = 1 - 0.1;
    const upperBound = 1 + 0.1;
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
          serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      };
  }
}
