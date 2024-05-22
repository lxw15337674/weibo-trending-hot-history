import { type ClassValue, clsx } from "clsx"
import Decimal from "decimal.js";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numberWithUnit(val:number){
  const decimalVal = new Decimal(val);
  if(val>100000000){
    return (decimalVal.div(100000000).toNumber()).toFixed(2)+'亿'    
  }
  if(val>10000){
    return (decimalVal.div(10000).toNumber()).toFixed(2)+'万'
  }
  return val
}