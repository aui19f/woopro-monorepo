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
  return { date, display };
}

export default async function AdminPage() {
  const { date, display } = getTodayKST();
  const todayCount = await countTodayReceptions(date);
  return <AdminReception todayCount={todayCount} today={display} />;
}
