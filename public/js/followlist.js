/* A DOM component which displays a list of users (strings) and allows the user to add and remove them.
   Note that the list will not automatically update after a call to onAdd or onRemove; you must call
   setList to give it a new list whenever the list of users has changed. */
export default class FollowList {
  /* Create a new empty list and add it to the tree under parent.
     - When the user tries to follow someone, the onAdd callback is called with the user ID.
     - When the user clicks on the remove button next to someone they're following, onRemove
       is called with the user ID being removed. */
  constructor(parent, onAdd, onRemove) {
    this._handleAdd = this._handleAdd.bind(this);
    this._handleRemove = this._handleRemove.bind(this);

    /* This is shorthand syntax, equivalent to { onAdd: onAdd, onRemove: onRemove } */
    this._callbacks = { onAdd, onRemove };
    /* Defines this._list and this._form. */
    this._createElements();
    parent.append(this._list, this._form);
  }

  /* Set the list of user IDs to display. users is an Array of strings. */
  setList(users) {
    this._list.textContent = "";
    for (let user of users) {
      let li = document.createElement("li");
      let text = document.createElement("span");
      text.classList.add("text");
      text.textContent = user;
      li.append(text);

      let button = document.createElement("button");
      button.type = "button";
      button.classList.add("remove");
      /* Set this attribute to make the button readable with assistive technology. */
      button.setAttribute("aria-label", `Remove ${user}`);
      button.textContent = "\u00d7"; /* The "times" character */
      button.addEventListener("click", this._handleRemove);
      li.append(button);

      this._list.append(li);
    }
  }

  /* Create the DOM elements for this component, storing them in instance variables. */
  _createElements() {
    this._list = document.createElement("ul");
    this._list.classList.add("followList");
    this._form = document.createElement("form");
    this._form.classList.add("followForm");

    let input = document.createElement("input");
    input.name = "userid";
    input.placeholder = "Follow user";
    this._form.append(input);

    let button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Add";
    this._form.append(button);

    this._form.addEventListener("submit", this._handleAdd);
  }

  _handleAdd(event) {
    event.preventDefault();
    let id = this._form.userid.value;
    this._form.reset();
    this._callbacks.onAdd(id);
  }

  _handleRemove(event) {
    let li = event.currentTarget.closest("li");
    let id = li.querySelector(".text").textContent;
    this._callbacks.onRemove(id);
  }
}
