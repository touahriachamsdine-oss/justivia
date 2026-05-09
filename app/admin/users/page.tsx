import { queryDB } from "@/lib/db";
import { AdminUsersClient } from "@/components/Admin/AdminUsersClient";

export default async function AdminUsersPage() {
  const users = await queryDB('SELECT id, email, name, role, queries_used_today, total_queries_all_time, last_query_reset FROM users ORDER BY id DESC', []);

  return <AdminUsersClient users={users} />;
}
