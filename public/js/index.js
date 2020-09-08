// Handling logging in/out
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("LOGGED IN WITH EMAIL: " + user.email);
        router.loadRoute('home');
        router.loadNavRoute('navbar');
    } else {
        console.log("LOGGED OUT");
        router.loadRoute('');
        router.hideNav();
    }
});

// Implementing routing
const routes = new RoutesObj(new Template());
const router = new Router(routes);

window.addEventListener('hashchange', hashChangeEvent => {
    urlSegments = hashChangeEvent.newURL.split("#");
    user = firebase.auth().currentUser;
    // user = true;

    if(user && urlSegments[1] != "") {
        router.loadRoute(urlSegments[1]);
    } else if(user && urlSegments[1] === "") {
        router.loadRoute("home");
    } else {
        router.loadRoute("");
    }
});