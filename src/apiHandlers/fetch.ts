// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchData(
  route: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  payload?: object,
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method !== 'GET') {
    options.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + route,
      options,
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.log('Error in fetching data', error);
    return null;
  }
}
