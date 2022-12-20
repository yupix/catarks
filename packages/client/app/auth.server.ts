import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { sessionStorage } from "./session.server";
import { api } from "./utils/utils";

export let authenticator = new Authenticator<TUserSession>(sessionStorage);


authenticator.use(
  new FormStrategy(async ({ form, context }) => {

    let username = form.get("username"); 
    let password = form.get("password");
    console.log(typeof username === 'string')
    // You can validate the inputs however you want
    if(typeof username !== "string") throw new Error("username must be a string");
    // if(typeof username.length > 0) throw new Error("username must not be empty");

    if(typeof password !== "string") throw new Error ("password must be a string");


    let res = await api.call('POST', '/api/auth/signin', {body: {username, password}});
    if (res.type === 'failed') throw new Error(JSON.stringify(res.data))
    const session = res.headers?.get('set-cookie')
    if (!session) throw new Error('not found session')
    const user: TUserSession = {...res.data, session}
    return user;
  })
);