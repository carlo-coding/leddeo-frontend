export function buildQuery(obj: object): string {
  let query =
    "?" +
    Object.entries(obj)
      .map(([key, value]) =>
        value != undefined ? `${key}=${value}`.toLowerCase() : ""
      )
      .join("&");
  if (query.endsWith("&")) return query.slice(0, query.length - 1);
  return query;
}
