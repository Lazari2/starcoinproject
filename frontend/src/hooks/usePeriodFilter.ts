import { useMemo, useState } from "react";
import { Period, Transaction } from "@/types/finance";

export function getPeriodRange(period: Period, ref = new Date()): { start: Date; end: Date } {
  const start = new Date(ref);
  const end = new Date(ref);
  end.setHours(23, 59, 59, 999);

  switch (period) {
    case "week": {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "month": {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "year": {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "all":
    default:
      start.setFullYear(1970, 0, 1);
      start.setHours(0, 0, 0, 0);
  }
  return { start, end };
}

export function usePeriodFilter(initial: Period = "month") {
  const [period, setPeriod] = useState<Period>(initial);
  const range = useMemo(() => getPeriodRange(period), [period]);

  const filter = (txs: Transaction[]) =>
    txs.filter((t) => {
      const d = new Date(t.date);
      return d >= range.start && d <= range.end;
    });

  return { period, setPeriod, range, filter };
}
