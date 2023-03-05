import React, { useEffect, useState } from "react";
import { createClient } from "graphql-ws";
import _ from "lodash";
import "./App.css";

const client = createClient({
  url: "ws://localhost:4000/graphql",
});

function App() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    client.subscribe(
      {
        query: "subscription { greetings }",
      },
      {
        next: (data: any) => {
          /* handle incoming values */
          setGreeting(data.data.greetings);
        },
        error: (e) => console.log(e),
        complete: () => {},
      }
    );
  }, []);

  const onChange = _.debounce((e) => {
    client.subscribe(
      {
        query: `mutation { setName(x: "${e.target.value}") }`,
      },
      {
        next: ({ data }) => console.log(data),
        error: (e) => console.log(e),
        complete: () => {},
      }
    );
  }, 500);

  return (
    <div className="App">
      <input type="text" onChange={onChange} />
      <div>{greeting}</div>
    </div>
  );
}

export default App;
