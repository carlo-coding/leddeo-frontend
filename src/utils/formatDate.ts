export function formatDate(utcTimestamp: number | string) {
  let date: Date;
  if (typeof utcTimestamp === "number") {
    date = new Date(utcTimestamp * 1000);
  } else {
    date = new Date(utcTimestamp);
  }
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
