import { pathToFileURL } from "node:url";
import { closeDb, query } from "../db.js";

export async function localSummary() {
  const contactStatuses = await query(
    "select contact_status, count(1)::int as count from buyer_contacts group by contact_status order by contact_status"
  );
  const routeStatuses = await query(
    `select cr.route_type, bc.contact_status, count(1)::int as count
     from contact_routes cr
     join buyer_contacts bc on bc.id = cr.contact_id
     group by cr.route_type, bc.contact_status
     order by cr.route_type, bc.contact_status`
  );
  const draftStatuses = await query(
    "select status, count(1)::int as count from outreach_drafts group by status order by status"
  );
  const suppressionReasons = await query(
    "select reason, count(1)::int as count from suppression_list group by reason order by reason"
  );
  const sampleRequests = await query(
    "select status, count(1)::int as count from sample_requests group by status order by status"
  );
  const tasks = await query(
    "select status, count(1)::int as count from tasks group by status order by status"
  );

  return {
    contact_statuses: contactStatuses.rows,
    route_statuses: routeStatuses.rows,
    draft_statuses: draftStatuses.rows,
    suppression_reasons: suppressionReasons.rows,
    sample_requests: sampleRequests.rows,
    tasks: tasks.rows
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  localSummary()
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .finally(() => closeDb());
}
