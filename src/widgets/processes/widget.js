import proxyHandler from "utils/proxy/handlers/generic";

const widget =  {
  api: "{url}/{endpoint}" ,
  proxyHandler,
  mappings: {
    processes: {
      endpoint: "processes",
    }
  }
};

export default widget;
