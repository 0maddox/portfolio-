import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function DataComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData(["Project 1", "Project 2"]);
    }, 1500);
  }, []);

  if (!data) return <Loader />;

  return (
    <ul>
      {data.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
