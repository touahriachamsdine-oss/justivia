import { queryDB } from "@/lib/db";
import { AdminQueriesClient } from "@/components/Admin/AdminQueriesClient";

export default async function AdminQueriesPage() {
  const queries = await queryDB(`
    SELECT q.id, q.query, q.user_role, q.timestamp, q.flagged, u.email 
    FROM queries q 
    LEFT JOIN users u ON q.user_id = u.id 
    ORDER BY q.timestamp DESC
  `, []);

  return <AdminQueriesClient queries={queries} />;
}
