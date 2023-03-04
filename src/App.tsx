import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { createClient } from "graphql-ws";
import "./App.css";
import _ from "lodash";

const client = createClient({
  url: "ws://localhost:4000/graphql",
});

function App() {
  const [x, setX] = useState("");
  useEffect(() => {
    // subscription
    (async () => {
      const onNext = (data: any) => {
        setX(data.data.greetings);
        /* handle incoming values */
      };

      let unsubscribe = () => {
        /* complete the subscription */
      };

      await new Promise((resolve: any, reject) => {
        unsubscribe = client.subscribe(
          {
            query: "subscription { greetings }",
          },
          {
            next: onNext,
            error: reject,
            complete: resolve,
          }
        );
      });
    })();
  }, []);

  const onChange = _.debounce((e) => {
    const x = e.target.value;
    let result;
    new Promise((resolve, reject) => {
      let result: any;
      client.subscribe(
        {
          query: `mutation { setName(x: "${x}") }`,
        },
        {
          next: ({ data }) => (result = data),
          error: reject,
          complete: () => resolve(result),
        }
      );
    });
  }, 500);

  return (
    <div className="App">
      <input type="text" onChange={onChange} />
      <div>{x}</div>
    </div>
  );
}

export default App;
