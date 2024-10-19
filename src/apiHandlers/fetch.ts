// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchData(
  payload: object,
  route: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
) {
  const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + route, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  return json;
}
