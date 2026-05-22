import { findReceptions, type EnumReceptionStatus } from "@/services/reception";
import ReceptionView from "./ReceptionView";

// YYYYMMDD 형식으로 변환 (KST 기준)
function toYYYYMMDD(date: Date): string {
  return date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, "")
    .replace(".", "");
}

// YYYYMM 문자열의 마지막 날 → YYYYMMDD
function lastDayOfMonth(yyyymm: string): string {
  const parts = yyyymm.split("-").map(Number) as [number, number];
  const lastDay = new Date(parts[0], parts[1], 0).getDate();
  return `${yyyymm.replace("-", "")}${String(lastDay).padStart(2, "0")}`;
}

function getDateRange(
  filter: string,
  from?: string
): { fromDate?: string; toDate?: string } {
  const today = new Date();
  const todayStr = toYYYYMMDD(today);

  switch (filter) {
    case "today":
      return { fromDate: todayStr, toDate: todayStr };
    case "week": {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      return { fromDate: toYYYYMMDD(d), toDate: todayStr };
    }
    case "month": {
      const d = new Date(today);
      d.setMonth(d.getMonth() - 1);
      return { fromDate: toYYYYMMDD(d), toDate: todayStr };
    }
    case "custom": {
      if (!from) return {};
      return {
        fromDate: from.replace("-", "") + "01",
        toDate: lastDayOfMonth(from),
      };
    }
    default:
      return {};
  }
}

const VALID_STATUSES = new Set(["READY", "IN_PROGRESS", "DONE", "CANCELLED"]);

export default async function ReceptionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const dateFilter = params.date ?? "today";
  const fromMonth = params.from;
  const statusParam = params.status ?? "";

  const { fromDate, toDate } = getDateRange(dateFilter, fromMonth);

  const statusFilter = statusParam
    .split(",")
    .filter((s) => VALID_STATUSES.has(s)) as EnumReceptionStatus[];

  const receptions = await findReceptions({
    fromDate,
    toDate,
    status: statusFilter.length ? statusFilter : undefined,
  });

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">접수 목록</h1>
      <ReceptionView
        receptions={receptions}
        dateFilter={dateFilter}
        fromMonth={fromMonth ?? ""}
        statusParam={statusParam}
      />
    </main>
  );
}
