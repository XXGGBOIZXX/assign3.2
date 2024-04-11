import FollowList from "./followlist.js";
import User, { Post } from "./user.js";

export default class App {
  constructor() {
    this._user = null;
    this._followList = null;

    this._onListUsers = this._onListUsers.bind(this);
    this._onLogin = this._onLogin.bind(this);
    this._loadProfile = this._loadProfile.bind(this);
    this._nameEdit= this._nameEdit.bind(this);
    this._avatarEdit = this._avatarEdit.bind(this);
    this._onPost=this._onPost.bind(this);

    this._loginForm = document.querySelector("#loginForm");
    this._postForm = document.querySelector("#postForm");
    this._nameForm = document.querySelector("#nameForm");
    this._avatarForm = document.querySelector("#avatarForm");
    this._followContainer = document.querySelector('#followContainer');

    this._loginForm.addEventListener("submit", this._onLogin);
    this._loginForm.listUsers.addEventListener("click", this._onListUsers); 
    this._postForm.addEventListener("submit", this._onPost);
    this._nameForm.addEventListener("submit", this._nameEdit);
    this._avatarForm.addEventListener("submit", this._avatarEdit);
    this._followList = new FollowList(this._followContainer, 
      this._onAdd.bind(this), 
      this._onRemove.bind(this));
  }

  async _onListUsers() {
    let users = await User.listUsers();
    let usersStr = users.join("\n");
    alert(`List of users:\n\n${usersStr}`);
  }

  _displayPost(post) {
    if (!(post instanceof Post)) throw new Error("displayPost wasn't passed a Post object");
    let elem = document.querySelector("#templatePost").cloneNode(true);
    elem.id = "";

    let avatar = elem.querySelector(".avatar");
    avatar.src = post.user.avatarURL;
    avatar.alt = `${post.user.name}'s avatar`;

    elem.querySelector(".name").textContent = post.user.name;
    elem.querySelector(".userid").textContent = post.user.id;
    elem.querySelector(".time").textContent = post.time.toLocaleString();
    elem.querySelector(".text").textContent = post.text;

    document.querySelector("#feed").append(elem);
  }

  async _onLogin(e) {
    e.preventDefault();
    let id = e.target.querySelector("input[name='userid']").value;
    this._user = await User.loadOrCreate(id);
    this._loadProfile();
  }
  
  async _loadProfile() {
    document.querySelector("#welcome").classList.add("hidden");
    document.querySelector("#main").classList.remove("hidden");
    document.querySelector("#idContainer").textContent = this._user.id;
    document.querySelector("#feed").textContent = "";

    this._postForm.querySelector(".avatar").src = this._user.avatarURL;
    this._postForm.querySelector(".name").textContent = this._user.name;
    this._postForm.querySelector(".userid").textContent = this._user.id;

    this._nameForm.name.value = this._user.name;
    this._avatarForm.avatar.value = this._user.avatarURL;      
    this._followList.setList(this._user.following);
    let posts = await this._user.getFeed();
    for (let post of posts) {
      this._displayPost(post);
    }
  }

  async _nameEdit(e) {
    e.preventDefault();

    this._user.name = this._nameForm.name.value;
    console.log(this._user.name);
    this._user.save();
    this._loadProfile();
  }

  async _avatarEdit(e) {
    e.preventDefault();
    this._user.avatarURL = this._avatarForm.avatar.value;
    this._user.save();
    this._loadProfile();
  }

  
  async _onPost(event) {
    event.preventDefault();
    let postText = this._postForm.querySelector("#newPost").value;
    this._user.makePost(postText);
    this._postForm.reset();
    this._user = await User.loadOrCreate(this._user.id);
    this._loadProfile();
  }

  async _onAdd(id) {
    await this._user.addFollow(id);
    this._user = await User.loadOrCreate(this._user.id);
    this._loadProfile();
  }

  async _onRemove(id) {
    await this._user.deleteFollow(id);
    this._user = await User.loadOrCreate(this._user.id);
    this._loadProfile();
  }

}
