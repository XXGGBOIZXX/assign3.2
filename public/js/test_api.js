const LOCAL_API_URL = "/api";
const REMOTE_API_URL = "TODO";

class App {
  constructor() {
    this._onChange = this._onChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);

    this._form = document.querySelector("#apiForm");
    this._form.endpoint.selectedIndex = 0;
    this._form.endpoint.addEventListener("change", this._onChange);
    this._form.addEventListener("submit", this._onSubmit);
  }

  _onChange(event) {
    let ep = this._form.endpoint.value;
    if (!ep) return;

    this._showHide("idParam", ep.includes(":id"));
    this._showHide("targetParam", ep.includes("follow"), false);
    this._showHide("bodyContainer", !ep.startsWith("GET") && !ep.includes("follow"), false);
  }

  _onSubmit(event) {
    event.preventDefault();
    /* We don't await these calls, so that if either fails, it won't prevent the other from starting. */
    // if (this._form.remote.checked) this._doReq(REMOTE_API_URL, "resRemote");
    if (this._form.local.checked) this._doReq(LOCAL_API_URL, "resLocal");
  }

  async _doReq(prefix, resName) {
    let [method, path] = this._form.endpoint.value.split(" ");
    path = path.replace(":id", this._form.userid.value);
    if (path.endsWith("follow")) path += `?target=${this._form.target.value}`;
    let body = this._form.body.value;
    let opts = { method };
    if (body) {
      opts.headers = { "Content-Type": "application/json" };
      opts.body = body;
    }
    let resElem = this._form[resName];
    try {
      let res = await fetch(`${prefix}${path}`, opts);
      let json = await res.json();
      resElem.value = `Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`;
    } catch (e) {
      resElem.value = `ERROR: ${e.message}\nCheck the Network tab for details`;
    }
  }

  _showHide(id, show, required = true) {
    let elem = document.querySelector(`#${id}`);
    if (show) {
      elem.classList.remove("hidden");
    } else {
      elem.classList.add("hidden");
      elem.querySelector("input, textarea").value = "";
    }
    /* Don't require body */
    let input = elem.querySelector("input");
    if (input && required) input.required = show;
  }
}
new App();
