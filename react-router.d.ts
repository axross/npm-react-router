import * as React from 'react';
import {LocationDescriptor, Query, Location, History, HistoryOptions, CreateHistory, BasenameOptions, QueryOptions} from 'history';

declare namespace ReactRouter {

	type RouteConfig = Route | PlainRoute;

	type ReactComponent<IProps> = React.Component<IProps, any> | React.StatelessComponent<IProps> | React.ClassicComponent<IProps, any>;

	type Params = { [paramName: string]: any };

	//Components
	export interface IRouterProps {
		/**
		 * children (required)
		 * One or many <Route>s or PlainRoutes. When the history changes, <Router> will match a branch of its routes, and render their configured components, with child route components nested inside the parents.
		 *
		 * @type {(RouteConfig | RouteConfig[])
		 */
		children?: RouteConfig | RouteConfig[];

		/**
		 * Alias for children.
		 *
		 * @type {(RouteConfig | RouteConfig[])}
		 * @alias children
		 */
		routes?: RouteConfig | RouteConfig[];

		/**
		 * The history the router should listen to. Typically browserHistory or hashHistory.
		 *
		 * @example
		 * import { browserHistory } from 'react-router'
		 * ReactDOM.render(<Router history={browserHistory} />, el)
		 * @type {History}
		 */
		history?: History;

		/**
		 * When the router is ready to render a branch of route components, it will use this function to create the elements. You may want to take control of creating the elements when you're using some sort of data abstraction, like setting up subscriptions to stores, or passing in some sort of * * application module to each component via props.
		 *
		 * @example
		 * <Router createElement={createElement} />
		 *
		 *  // default behavior
		 *	function createElement(Component, props) {
		 *		// make sure you pass all the props in!
		 *		return <Component {...props} />
		 *	}
		 *
		 *	// maybe you're using something like Relay
		 *	function createElement(Component, props) {
		 *		// make sure you pass all the props in!
		 *		return <RelayContainer Component={Component} routerProps={props} />
		 *	}
		 * @template IProps
		 * @param {Components<IProps, any>} component
		 * @param {IProps} props
		 */
		createElement?<IProps>(component: ReactComponent<IProps>, props: IProps): JSX.Element;

		/**
		 * A function used to convert an object from <Link>s or calls to transitionTo to a URL query string.
		 *
		 * @param {Object} queryObject
		 */
		stringifyQuery?(queryObject: Object): string;


		/**
		 * A function used to convert a query string into an object that gets passed to route component props.
		 *
		 * @param {string} queryString
		 */
		parseQueryString?(queryString: string): Object;

		/**
		 * While the router is matching, errors may bubble up, here is your opportunity to catch and deal with them. Typically these will come from async features like route.getComponents, route.getIndexRoute, and route.getChildRoutes.
		 *
		 * @param {Error} error
		 */
		onError?(error: Error): void;

		/**
		 * Called whenever the router updates its state in response to URL changes.
		 */
		onUpdate?(): void;

		/**
		 * This is primarily for integrating with other libraries that need to participate in rendering before the route components are rendered. It defaults to render={(props) => <RouterContext {...props} />}.
		 * Ensure that you render a <RouterContext> at the end of the line, passing all the props passed to render.
		 */
		render?<IProps>(props: IProps): JSX.Element;
	}



	/**
	 * Primary component of React Router. It keeps your UI and the URL in sync.
	 *
	 * @export
	 * @class Router
	 * @extends {React.Component<IRouterProps, {}>}
	 */
	export class Router extends React.Component<IRouterProps, {}>{ }

	export interface ILinkProps extends React.HTMLAttributes {
		/**
		 * The path to link to, e.g. /users/123.
		 *
		 * @type {LocationDescriptor}
		 */
		to?: LocationDescriptor;

		/**
		 * Should this link only active on index?
		 *
		 * @type {boolean}
		 */
		onlyActiveOnIndex?: boolean;


		/**
		 * An object of key:value pairs to be stringified.
		 *
		 * @type {{ [key: string]: any }}
		 */
		query?: { [key: string]: any };

		/**
		 * A hash to put in the URL, e.g. #a-hash.
		 *
		 *	Note: React Router currently does not manage scroll position, and will not scroll to the element corresponding to the hash. Scroll position management utilities are available in the scroll-behavior library.
		 *
		 * @type {string}
		 */
		hash?: string;

		/**
		 * State to persist to the location.
		 *
		 * @type {string}
		 */
		state?: string; //TOOD : Have a look back at this one

		/**
		 * The styles to apply to the link element when its route is active.
		 *
		 * @type {string}
		 */
		activeClassName?: string;

		/**
		 * The styles to apply to the link element when its route is active.
		 *
		 * @type {React.CSSProperties}
		 */
		activeStyle?: React.CSSProperties;

		/**
		 * The styles to apply to the link element when its route is active.
		 *
		 * @param {React.MouseEvent} event **NOTE** I'm assuming this will be a click event.
		 */
		onClick?(event: React.MouseEvent): any;
	}

	/**
	 * The primary way to allow users to navigate around your application. <Link> will render a fully accessible anchor tag with the proper href.
	 * A <Link> can know when the route it links to is active and automatically apply an activeClassName and/or activeStyle when given either prop.
	 * The <Link> will be active if the current route is either the linked route or any descendant of the linked route.
	 * To have the link be active only on the exact linked route, use <IndexLink> instead.
	 *
	 * @example
	 * <Link to={`/users/${user.id}`} activeClassName="active">{user.name}</Link>
	 * // becomes one of these depending on your History and if the route is
	 * // active
	 * <a href="/users/123" class="active">Michael</a>
	 * <a href="#/users/123">Michael</a>
	 *
	 * // change the activeClassName
	 * <Link to={`/users/${user.id}`} activeClassName="current">{user.name}</Link>
	 *
	 * // change style when link is active
	 * <Link to="/users" style={{color: 'white'}} activeStyle={{color: 'red'}}>Users</Link>
	 * @export
	 * @class Link
	 * @extends {React.Component<ILinkProps, {}>}
	 */
	export class Link extends React.Component<ILinkProps, {}>{ }

	/**
	 * An <IndexLink> is like a <Link>, except it is only active when the current route is exactly the linked route.
	 *
	 * @export
	 * @class IndexLink
	 * @extends {Link}
	 */
	export class IndexLink extends Link { }

	export interface IRouterContext {

		router?: IRouter;
	}

	/**
	 * Contains data and methods relevant to routing. Most useful for imperatively transitioning around the application.
	 *
	 * @export
	 * @interface IRouter
	 */
	export interface IRouter {
		/**
		 * Transitions to a new URL, adding a new entry in the browser history.
		 *
		 * @example
		 * router.push('/users/12')
		 *
		 * // or with a location descriptor object
		 * router.push({
		 * 	pathname: '/users/12',
		 * 	query: { modal: true },
		 * 	state: { fromDashboard: true }
		 * })
		 *
		 * @param {LocationDescriptor} pathOrLoc
		 */
		push(pathOrLoc: LocationDescriptor): void;

		/**
		 * Identical to push except replaces the current history entry with a new one.
		 *
		 * @param {LocationDescriptor} pathOrLoc
		 */
		replace(pathOrLoc: LocationDescriptor): void;

		/**
		 * Go forward or backward in the history by n or -n.
		 *
		 * @param {number} n
		 */
		go(n: number): void;

		/**
		 * Go back one entry in the history.
		 */
		goBack(): void;

		/**
		 * Go forward one entry in the history.
		 */
		goForward(): void;

		/**
		 * Stringifies the query into the pathname, using the router's config.
		 *
		 * @param {LocationDescriptor} pathOrLoc
		 * @param {Query} query
		 */
		createPath(pathOrLoc: LocationDescriptor, query: Query): void;

		/**
		 * Creates a URL, using the router's config. For example, it will add #/ in front of the pathname for hash history.
		 *
		 * @param {LocationDescriptor} pathOrLoc
		 * @param {Query} query
		 */
		createHref(pathOrLoc: LocationDescriptor, query: Query): void;

		/**
		 * Returns true or false depending on if the pathOrLoc is active. Will be true for every route in the route branch matched (child route is active, therefore parent is too), unless indexOnly is specified, in which case it will only match the exact path.
		 *
		 * @param {LocationDescriptor} pathOrLoc
		 * @param {boolean} indexOnly
		 */
		isActive(pathOrLoc: LocationDescriptor, indexOnly: boolean): boolean;
	}

	/**
	 * A <RouterContext> renders the component tree for a given router state. Its used by <Router> but also useful for server rendering and integrating in brownfield development.
	 *
	 * It also provides a router object on context.
	 *
	 * @export
	 * @class RouterContext
	 * @extends {React.Component<{}, {}>}
	 */
	export class RouterContext extends React.Component<{}, {}>{
		context: IRouterContext;
	}

	//Configuration
	export interface IRouteProps extends IIndexRouteProps {

		/**
		 * The path used in the URL.
		 *
		 * It will concat with the parent route's path unless it starts with /, making it an absolute path.
		 *
		 * Note: Absolute paths may not be used in route config that is dynamically loaded.
		 *
		 * If left undefined, the router will try to match the child routes.
		 *
		 * @type {string}
		 */
		path?: string;
	}

	export class Route extends React.Component<IRouteProps, {}> { }

	export interface PlainRoute extends IRouteProps {
		/**
		 * An array of child routes, same as children in JSX route configs.
		 *
		 * @type {PlainRoute[]}
		 */
		childRoutes?: PlainRoute[];

		/**
		 * Same as childRoutes but asynchronous and receives the location. Useful for code-splitting and dynamic route matching (given some state or session data to return a different set of child routes).
		 *
		 * @example
		 *
		 * let myRoute = {
		 *   path: 'course/:courseId',
		 *   childRoutes: [
		 *     announcementsRoute,
		 *     gradesRoute,
		 *     assignmentsRoute
		 *   ]
		 * }
		 *
		 * // async child routes
		 * let myRoute = {
		 *   path: 'course/:courseId',
		 *   getChildRoutes(location, cb) {
		 *     // do asynchronous stuff to find the child routes
		 *     cb(null, [ announcementsRoute, gradesRoute, assignmentsRoute ])
		 *   }
		 * }
		 *
		 * // navigation dependent child routes
		 * // can link with some state
		 * <Link to="/picture/123" state={{ fromDashboard: true }} />
		 *
		 * let myRoute = {
		 *   path: 'picture/:id',
		 *   getChildRoutes(location, cb) {
		 *     let { state } = location
		 *
		 *     if (state && state.fromDashboard) {
		 *       cb(null, [dashboardPictureRoute])
		 *     } else {
		 *       cb(null, [pictureRoute])
		 *     }
		 *   }
		 * }
		 * @param {Location} location
		 * @param {(err: Error, routes: PlainRoute[]) => void} callback
		 */
		getChildRoutes?(location: Location, callback: (err: Error, routes: PlainRoute[]) => void): void;

		/**
		 * The index route. This is the same as specifying an <IndexRoute> child when using JSX route configs.
		 *
		 * @type {PlainRoute}
		 */
		indexRoute?: PlainRoute;

		/**
		 * Same as indexRoute, but asynchronous and receives the location. As with getChildRoutes, this can be useful for code-splitting and dynamic route matching.
		 *
		 * // For example:
		 * let myIndexRoute = {
		 *   component: MyIndex
		 * }
		 *
		 * let myRoute = {
		 *   path: 'courses',
		 *   indexRoute: myIndexRoute
		 * }
		 *
		 * // async index route
		 * let myRoute = {
		 *   path: 'courses',
		 *   getIndexRoute(location, cb) {
		 *     // do something async here
		 *     cb(null, myIndexRoute)
		 *   }
		 * }
		 * @param {Location} location
		 * @param {(err: Error, route: PlainRoute) => void} callback
		 */

		getIndexRoute?(location: Location, callback: (err: Error, route: PlainRoute) => void): void;
	}

	export interface IRedirectProps extends IIndexRedirectProps {
		/**
		 * The path you want to redirect from, including dynamic segments.
		 *
		 * @type {string}
		 */
		from?: string;
	}

	/**
	 * A <Redirect> sets up a redirect to another route in your application to maintain old URLs.
	 *
	 * @export
	 * @class Redirect
	 * @extends {React.Component<IRedirectProps, {}>}
	 */
	export class Redirect extends React.Component<IRedirectProps, {}>{ }

	export interface IIndexRouteProps {
		/**
		 * A single component to be rendered when the route matches the URL. It can be rendered by the parent route component with this.props.children.
		 *
		 * @example
		 * const routes = (
  		 * <Route component={App}>
    	 * <Route path="groups" component={Groups} />
    	 * <Route path="users" component={Users} />
  		 * </Route>
		 * )
		 *
		 * class App extends React.Component {
  		 * render () {
    	 * 	return (
      	 * 		<div>
         * 			{// this will be either <Users> or <Groups> }
         * 			{this.props.children}
      	 * 		</div>
    	 * 		)
		 * 	}
		 * }
		 *
		 * @type {Component<any>}
		 */
		component?: React.ComponentClass<any> | React.StatelessComponent<any>;

		/**
		 * Routes can define one or more named components as an object of [name]: component pairs to be rendered when the path matches the URL. They can be rendered by the parent route component with this.props[name].
		 *
		 * @example
		 * // Think of it outside the context of the router - if you had pluggable
         * // portions of your `render`, you might do it like this:
         * // <App main={<Users />} sidebar={<UsersSidebar />} />
         *
         * const routes = (
         *   <Route component={App}>
         *     <Route path="groups" components={{main: Groups, sidebar: GroupsSidebar}} />
         *     <Route path="users" components={{main: Users, sidebar: UsersSidebar}}>
         *       <Route path="users/:userId" component={Profile} />
         *     </Route>
         *   </Route>
         * )
         *
         * class App extends React.Component {
         *   render () {
         *     const { main, sidebar } = this.props
         *     return (
         *       <div>
         *         <div className="Main">
         *           {main}
         *         </div>
         *         <div className="Sidebar">
         *           {sidebar}
         *         </div>
         *       </div>
         *     )
         *   }
         * }
         *
         * class Users extends React.Component {
         *   render () {
         *     return (
         *       <div>
         *         { // if at "/users/123" `children` will be <Profile>}
         *         { // UsersSidebar will also get <Profile> as this.props.children,
         *             so its a little weird, but you can decide which one wants
         *             to continue with the nesting //}
         *         {this.props.children}
         *       </div>
         *     )
         *   }
         * }
		 * @type {{ [name: string]: Component<any> }}
		 */
		components?: { [name: string]: React.ComponentClass<any> | React.StatelessComponent<any>; }

		/**
		 * Same as component but asynchronous, useful for code-splitting.
		 *
		 * @example
		 * <Route path="courses/:courseId" getComponent={(location, cb) => {
		 *   // do asynchronous stuff to find the components
		 *   cb(null, Course)
		 * }} />
		 *
		 * @param {Location} location
		 * @param {(error: Error, component: Component<any>) => void} callback
		 */
		getComponent?(location: Location, callback: (error: Error, component: ReactComponent<any>) => void): void;

		/**
		 * Same as components but asynchronous, useful for code-splitting.
		 *
		 * @example
		 * <Route path="courses/:courseId" getComponents={(location, cb) => {
		 *   // do asynchronous stuff to find the components
		 *   cb(null, {sidebar: CourseSidebar, content: Course})
		 * }} />
		 * @param {Location} location
		 * @param {(error: Error, components: { [name: string]: Component<any> }) => void} callback
		 */
		getComponent?(location: Location, callback: (error: Error, components: { [name: string]: ReactComponent<any> }) => void): void;

		/**
		 * Routes can be nested, this.props.children will contain the element created from the child route component. Please refer to the Route Configuration since this is a very critical part of the router's design.
		 *
		 * @type {Route[]}
		 */
		children?: Route[];

		/**
		 * Called when a route is about to be entered. It provides the next router state and a function to redirect to another path. this will be the route instance that triggered the hook.
		 *
		 * If callback is listed as a 3rd argument, this hook will run asynchronously, and the transition will block until callback is called.
		 */
		onEnter?: EnterHook;

    /**
     * Called on routes when the location changes, but the route itself neither enters or leaves. For example, this will be called when a route's children change, or when the location query changes. It provides the previous router state, the next router state, and a function to redirect to another path. this will be the route instance that triggered the hook.
     *
     * If callback is listed as a 4th argument, this hook will run asynchronously, and the transition will block until callback is called.
     */
		onChange?: ChangeHook;

		/**
		 * Called when a route is about to be exited.
		 */
		onLeave?(): void;
	}

	type Component = ReactComponent<any> | string;

	type RouterState = {
			location: Location;
			routes: Array<Route>;
			params: Params;
			components: Array<Component>;
	};

	type EnterHook = (nextState: RouterState, replace: RedirectFunction, callback?: Function) => any;

	type ChangeHook = (prevState: RouterState, nextState: RouterState, replace: RedirectFunction, callback?: Function) => any;

	type RedirectFunction = (state: LocationState, pathname: Pathname | Path, query?: Query) => void;

	type LocationState = Object;

	type Path = string;

	type Pathname = string;

	type Query = Object;

	/**
	 * An <IndexRoute> allows you to provide a default "child" to a parent route when visitor is at the URL of the parent.
	 *
	 * @export
	 * @class IndexRoute
	 * @extends {React.Component<IIndexRouteProps, {}>}
	 */
	export class IndexRoute extends React.Component<IIndexRouteProps, {}>{ }

	export interface IIndexRedirectProps {
		/**
		 * The path you want to redirect to.
		 *
		 * @type {string}
		 */
		to?: string;

		/**
		 * By default, the query parameters will just pass through but you can specify them if you need to.
		 *
		 * @example
		 * // Say we want to change from `/profile/123` to `/about/123`
		 * // and redirect `/get-in-touch` to `/contact`
		 * <Route component={App}>
		 *   <Route path="about/:userId" component={UserProfile} />
		 *   {// /profile/123 -> /about/123 }
		 *   <Redirect from="profile/:userId" to="about/:userId" />
		 * </Route>
		 * @description Note that the <Redirect> can be placed anywhere in the route hierarchy, though normal precedence rules apply. If you'd prefer the redirects to be next to their respective routes, the from path will match the same as a regular route path.
		 * @example
		 * <Route path="course/:courseId">
		 *   <Route path="dashboard" />
		 *   {// /course/123/home -> /course/123/dashboard }
		 *   <Redirect from="home" to="dashboard" />
		 * </Route>
		 * @type {Query}
		 */
		query?: Query;
	}

	export class IndexRedirect extends React.Component<IIndexRedirectProps, {}>{ }

	//Route Components

	//TODO : This feels a little out of place
	export interface IRoute {

		/**
		 * Child routes for the current route.
		 *
		 * @type {IRoute[]}
		 */
		childRoutes?: IRoute[];

		/**
		 * Component this route will render
		 *
		 * @type {typeof React.Component}
		 */
		component?: typeof React.Component;

		/**
		 * Path for this route
		 *
		 * @type {string}
		 */
		path?: string;
	}

	/**
	 * Extension of all injected props
	 *
	 * @export
	 * @interface IInjectedProps
	 */
	export interface IInjectedProps {
		/**
		 * The current location.
		 *
		 * @type {Location}
		 */
		location?: Location;


		/**
		 * The dynamic segments of the URL.
		 *
		 * @type {Params}
		 */
		params?: Params

		/**
		 * The route that rendered this component.
		 *
		 * @type {IRoute}
		 */
		route?: IRoute;

		/**
		 * The routes that belonog to this component
		 *
		 * @type {IRoute[]}
		 */
		routes?: IRoute[];

		/**
		 * A subset of this.props.params that were directly specified in this component's route.
		 * For example, if the route's path is users/:userId and the URL is /users/123/portfolios/345 then this.props.routeParams will be {userId: '123'}, and this.props.params will be {userId: '123', portfolioId: 345}.
		 *
		 * @type {Params}
		 */
		routeParams?: Params

		/**
		 * The matched child route element to be rendered. If the route has named components then this will be undefined, and the components will instead be available as direct properties on this.props.
		 *
		 * @example
		 * render((
		 *   <Router>
		 *     <Route path="/" component={App}>
		 *       <Route path="groups" component={Groups} />
		 *       <Route path="users" component={Users} />
		 *     </Route>
		 *   </Router>
		 * ), node)
		 *
		 * class App extends React.Component {
		 *   render() {
		 *     return (
		 *       <div>
		 *         {// this will be either <Users> or <Groups> }
		 *         {this.props.children}
		 *       </div>
		 *     )
		 *   }
		 * }
		 * @type {typeof React.Component}
		 */
		children?: typeof React.Component;
	}

	//Histories
	/**
	 * browserHistory uses the HTML5 History API when available, and falls back to full refreshes otherwise. browserHistory requires additional configuration on the server side to serve up URLs, but is the generally preferred solution for modern web pages.
	 * @export
	 */
	export const browserHistory: History;

	/**
	 * hashHistory uses URL hashes, along with a query key to keep track of state. hashHistory requires no additional server configuration, but is generally less preferred than browserHistory.
	 * @export
	 */
	export const hashHistory: History;

	/**
	 * createMemoryHistory creates an in-memory history object that does not interact with the browser URL. This is useful when you need to customize the history used for server-side rendering, as well as for automated testing.
	 *
	 * @export
	 * @param {HistoryOptions} [options]
	 */
	export function createMemoryHistory(options?: HistoryOptions): History;

	/**
	 * useRouterHistory is a history enhancer that configures a given createHistory factory to work with React Router. This allows using custom histories in addition to the bundled singleton histories.
	 *
	 * @example
	 * const history = useRouterHistory(createHashHistory)({ queryKey: false })
	 * @export
	 * @template TArguments
	 * @template TResult
	 * @param {CreateHistory<TArguments, TResult>} createHistory
	 */
	export function useRouterHistory<TArguments, TResult extends History>(createHistory: CreateHistory<TArguments, TResult>): CreateHistory<TArguments, TResult>;

	//Utilities
	export interface IMatchArgs extends BasenameOptions, QueryOptions {
		routes: RouteConfig;

		location: Location;

		history?: History;
	}


	/**
	 * This function is to be used for server-side rendering. It matches a set of routes to a location, without rendering, and calls a callback(error, redirectLocation, renderProps) when it's done.
	 *
	 * The function will create a history for you, passing the additional options along to create it.
	 * These options can include basename to control the base name for URLs, as well as the pair of parseQueryString and stringifyQuery to control query string parsing and serializing. You can also pass in an
	 * already instantiated history object, which can be constructed however you like.
	 *
	 * The three arguments to the callback function you pass to match are:
	 *
	 * error: A Javascript Error object if an error occurred, undefined otherwise.
	 * redirectLocation: A Location object if the route is a redirect, undefined otherwise.
	 * renderProps: The props you should pass to the routing context if the route matched, undefined otherwise.
	 * If all three parameters are undefined, this means that there was no route found matching the given location.
	 *
	 * Note: You probably don't want to use this in a browser unless you're doing server-side rendering of async routes.
	 *
	 * @export
	 * @param {routes: RouteConfig}
	 * @param {(error:Error, redirectLocation:Location, renderProps : Object) => void} callback
	 */
	export function match(args: IMatchArgs, callback: (error: Error, redirectLocation: Location, renderProps: Object) => void): void;

	/**
	 * Creates and returns an array of routes from the given object which may be a JSX route, a plain object route, or an array of either.
	 *
	 * @export
	 * @param {((Route | PlainRoute)[])} routes
	 */
	export function createRoutes(routes: (Route | PlainRoute)[]): Route[];

	/**
	 * Add router object to props of pure component
	 */
	export function withRouter<T>(fun: (props: T & { router: IRouter }) => JSX.Element): (props: T) => JSX.Element;

	/**
	 * Add router object to props of component
	 */
	export function withRouter<T extends Function>(el: T): T;

	/**
	 * Apply Router middleware (for using in <Router render={applyRouterMiddleware(...)} ... />)
	 */
	export function applyRouterMiddleware<T extends Function>(middleware: T): <IProps>(props: IProps) => JSX.Element;
}

export = ReactRouter;
