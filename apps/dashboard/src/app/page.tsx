async function getData() {
  const res = await fetch(
    `http://${process.env.GLANCES_IP as string}:${
      process.env.GLANCES_PORT as string
    }/api/3/all`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const data = await getData();
  return <div>{JSON.stringify(data.sensors)}</div>;
}
