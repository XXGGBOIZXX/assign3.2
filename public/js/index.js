import apiRequest, { HTTPError } from "./apirequest.js";
import App from "./app.js";

/* This file contains testing code. You may add any testing code you like here, including e.g.
   adding things to window so you can call them from the console.
   We will not use this file in grading. We will directly import your apiRequest, User, and App modules. */

/* A few tests of apiRequest. These calls should work as-is if your apiRequest is implemented according to spec. */
const testApi = async () => {
  let data = await apiRequest("GET", "/tests/get?value=193x");
  console.assert(data.success && data.value === "193x", "/tests/get result mismatch");
  data = await apiRequest("POST", "/tests/post", { value: 193 });
  console.assert(data.success && data.value === 193, "/tests/post result mismatch");
  try {
    data = await apiRequest("GET", "/tests/error");
    console.error("/tests/error didn't throw an error");
  } catch (e) {
    console.assert(e instanceof HTTPError && e.status === 499 && e.message === "Test error", "/tests/error exception mismatch");
  }
  console.log("Tests finished");
};
window.testApi = testApi;

const main = () => {
  new App();
};
main();
