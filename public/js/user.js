export class Post {
  /* data is the post data from the API. */
  constructor(data) {
    this.user = new User(data.user);
    this.time = new Date(data.time);
    this.text = data.text;
  }
}

/* A data model representing a user of the app. */
export default class User {
  static async listUsers() {
    let res = await fetch('/api/users');
    let data = await res.json();
    return data.users;
  }

  constructor(data) {
    Object.assign(this,data);
    this.uri=`/api/users/${this.id}`;
  }

  toString() {
    return `User: ${this.name} (@${this.id})`;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      avatarURL: this.avatarURL,
      following: this.following,
    };
  }
  
  static async loadOrCreate(id) {
    let res = await fetch(`/api/users/${id}`);
    if (res.status === 404) {
      let newUser = await fetch(`/api/users`, {
        method: 'POST',
        body: JSON.stringify({ id:id}),
        headers: { 'Content-Type': 'application/json' },
      });
      let newUserData = await newUser.json();
      return new User(newUserData);
    } else {
      let userData = await res.json();
      return new User(userData);
    }
  }

  async save() {
    let updateData = { name: this.name, avatarURL: this.avatarURL };
    let res = await fetch(this.uri, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      let updatedUserData = await res.json();
      this.name = updatedUserData.name;
      this.avatarURL = updatedUserData.avatarURL;
    } else {
      throw new Error('Failed to update user');
    }
  }

  async getFeed() {
    let res = await fetch(`${this.uri}/feed`);
    let data = await res.json();
    let posts=data.posts.map(post => new Post(post));
    return posts;
  }

  async makePost(text) {
    let res = await fetch(`${this.uri}/posts`, {
      method: 'POST',
      body: JSON.stringify({text:text }),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.status;
  }

  async addFollow(id) {
    return await fetch(`${this.uri}/follow?target=${id}`,{
      method:'POST'
    });
  }

  async deleteFollow(id) {    
    return await fetch(`${this.uri}/follow?target=${id}`, {
      method: 'DELETE'
    });
  }
}
