import { queryDB } from "@/lib/db";
import { AdminOverviewClient } from "@/components/Admin/AdminOverviewClient";

export default async function AdminDashboard() {
  const statsData = await Promise.all([
    queryDB('SELECT COUNT(*) as count FROM users', []),
    queryDB('SELECT COUNT(*) as count FROM queries', []),
    queryDB('SELECT COUNT(*) as count FROM queries WHERE timestamp > NOW() - INTERVAL \'24 hours\'', []),
    queryDB('SELECT COUNT(*) as count FROM queries WHERE flagged = true', []),
    queryDB('SELECT query, COUNT(*) as search_count FROM queries GROUP BY query ORDER BY search_count DESC LIMIT 5', []),
    queryDB('SELECT AVG(response_time_ms) as avg_response_time FROM queries', []),
    queryDB('SELECT language, COUNT(*) as count FROM queries GROUP BY language', []),
    queryDB('SELECT u.name, COUNT(q.id) as query_count FROM users u JOIN queries q ON u.id::text = q.user_id GROUP BY u.name ORDER BY query_count DESC LIMIT 5', []),
  ]);

  const [
    totalUsers, 
    totalQueries, 
    recentQueriesCount, 
    flaggedQueries, 
    mostSearched, 
    systemStats, 
    languageDist, 
    activeUsers
  ] = [
    parseInt(statsData[0][0].count),
    parseInt(statsData[1][0].count),
    parseInt(statsData[2][0].count),
    parseInt(statsData[3][0].count),
    statsData[4],
    statsData[5][0],
    statsData[6],
    statsData[7]
  ];

  const recentQueries = await queryDB('SELECT query, user_role, timestamp FROM queries ORDER BY timestamp DESC LIMIT 5', []);
  const userDistribution = await queryDB('SELECT role, COUNT(*) as count FROM users GROUP BY role', []);

  return (
    <AdminOverviewClient 
      stats={{ totalUsers, totalQueries, recentQueriesCount, flaggedQueries }}
      recentQueries={recentQueries}
      userDistribution={userDistribution}
      mostSearched={mostSearched}
      systemStats={{
        avgResponseTime: Math.round(parseFloat(systemStats.avg_response_time || '0')),
        languageDist,
        activeUsers
      }}
    />
  );
}
