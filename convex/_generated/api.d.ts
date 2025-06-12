/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as CustomProfile from "../CustomProfile.js";
import type * as MagicLinkProvider from "../MagicLinkProvider.js";
import type * as auth from "../auth.js";
import type * as authActions from "../authActions.js";
import type * as events from "../events.js";
import type * as feed from "../feed.js";
import type * as http from "../http.js";
import type * as myAction from "../myAction.js";
import type * as posts from "../posts.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  CustomProfile: typeof CustomProfile;
  MagicLinkProvider: typeof MagicLinkProvider;
  auth: typeof auth;
  authActions: typeof authActions;
  events: typeof events;
  feed: typeof feed;
  http: typeof http;
  myAction: typeof myAction;
  posts: typeof posts;
  tasks: typeof tasks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
