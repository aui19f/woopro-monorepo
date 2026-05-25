import { countTodayReceptions } from "@/services/reception";
import AdminReception from "./AdminReception";

function getTodayKST() {
  const now = new Date();
  const date = now
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\. /g, "")
    .replace(".", "");
  const display = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return { date, display, iso };
}

export default async function AdminPage() {
  const { date, display, iso } = getTodayKST();
  const todayCount = await countTodayReceptions(date);
  return <AdminReception todayCount={todayCount} today={display} todayISO={iso} />;
}
