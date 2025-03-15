import proxyHandler from "utils/proxy/handlers/generic";

const widget =  {
  api: "{url}/{endpoint}" ,
  proxyHandler,
  mappings: {
    query: {
      endpoint: "query",
      params: ["db", "q"]
    }
  }
};

export default widget;
