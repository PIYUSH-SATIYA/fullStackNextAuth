As next js is a framework, it has more specific rules about project structure and directory naming.

## Project structure and naming rules for NextJS

Everything is inside a directory src/

### The src directory

1. The first comp of it is the `app/` directory

    - In the app/ , we put the backend of the project in the dir. `api/`
    - We put the frontend too in the app/ dir, with separate dirs like login/, etc.

    majority of the files will be in `app/`

2. Other directories

Other directories for DB models, helper functions, middlewares/ etc. in src/ too along with the app/ dir.f

### Filenames

we name the backend files `route.js/ts`.

we name the frontend files `page.js/ts`.

> So, instead of naming files like anything and then defining the route separately for it as in express, we create a folder for every route we want, and the rest is taken care by NextJS.
>
> > and for that we name the file in that folder, page.js/ts if frontend or route.js/ts if backend

There may be subfolders inside those, just name the final last file that will be served on that route as route or page.

## Client side vs Server side

tldr;
Client side = React + Interactivity

Server side = Data fetching + Pre-rendering

Mostly the components in the api/ directory are the server side and almost everythign outside is related to the client.

The server side components can't access the client side functionalities like getting getting window size of the client, window object, browser apis etc.

However to make any component client side, i.e. enable it client side functionalities, we write `"use client"` at the top of the file and that's it.

## creating dynamic routes

This means getting the text(in the url) after a specific route, will be taken as params and pages can be dynamically generated using that params

Let's say we want to grab params on the page, `src/app/profile/page.tsx`

We create another folder with its name necessarily in square brackets say, `[id]`, and in that dir, we will write the page to be served which can be completely different than `src/app/profile/page.tsx`.  
But now that page can be accessed on the route `src/app/profile/` and is dynamic. i.e. the text after the route e.g. `src/app/profile/THISTEXT` can be accessed in that page `[id]/page.tsx` by passing the parameter `{params}` to the component being server on the route i.e. `[id]/page.tsx` and using it like `{params.id}` anywhere in the component we want.

We may have to define types too like `{params}: any` while passing it as parameter.

### For more than one params on that route, we have to options:

1. create as many subfolders with name in `[]` in the dir/ here `profile/` as many params we want to use and at the very bottom i.e. deepest dir, we write in the same way as above the `page.tsx`.
2. or we can create a dir/ like `profile/[...profile]/page.tsx` for variable no. of params to be available
   accessing it like

    ```tsx
    // app/profile/[...slug]/page.tsx
    type Props = {
        params: {
            slug: string[]; // e.g. ["42", "settings"]
        };
    };

    export default function CatchAll({ params }: Props) {
        return (
            <div>
                <h1>Catch-All Params</h1>
                <pre>{JSON.stringify(params.slug)}</pre>
            </div>
        );
    }
    ```

## Designing database models with NextJS

In nextjs we have to take care whether the model exists or not before creating a new model.

We do it like,

```js
export const MyModel =
    mongoose.models.myModels || mongoose.model("myModels", myModelSchema);
```

# Writing APIs in nextjs

https://nextjs.org/blog/building-apis-with-nextjs

## Middlewares

Middleware allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.

The boilerplate for middleware in nextJS is :

```js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
// This is the logic part
export function middleware(request: NextRequest) {
    return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below
export const config = {
    // matcher: "/about/:path*",
    // instead of writing like that, we can write an array of the routes and it will match it all like written below

    matcher: ["/api/route1", "/api/route2"],
};
```

There are two parts in the middleware in it:

-   1. Logic part: This is the main function middleware
-   2. Matching part: This is the route on which we want to apply our middleware

## params with NextJS and some js 101

In NextJS app router and server components, especially dynamic routing (taking params from url), the params obj. may be passed as a Promise behind the scene due to react server component behaviour.

It should be awaited before using like (w.r.t. profile/[id]/page)

```ts
export default async function Page(props: Promise<{ params: { id: string } }>) {
    const { params } = await props;
    const profileId = params.id;

    // const profileId = await params.id; // incorrect, bcoz it is first getting destructured and than awaited

    return <div>Profile: {profileId}</div>;
}
```

## General flow of forgot password and email verification

First step is setting up the mailing agent.

here we have set up nodemailer and using mailtrap to test.

for the email verification, an email is sent along with a verification token generated and stored to db (temporarily). Then the user sends a post req. by clicking the url sent in the mail.  
The url in the mail contains the verification token, which is extracted from there and is matched with the token we stored in the db. If matched, then user email is verified successfully.  
Here for the verification we are finding the user in the db based on the token we recieved, if there is a user then it must be that only.

Same flow for forgot password too, except we send the mail from login page, and after matching the token we store new password in the db.
