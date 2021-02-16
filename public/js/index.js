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
    //user = firebase.auth().currentUser;
    user = true;

    if (user && urlSegments[1] != "") {
        router.loadRoute(urlSegments[1]);
    } else if (user && urlSegments[1] === "") {
        router.loadRoute("home");
    } else {
        router.loadRoute("");
    }
});

function loadBluetooth() {
    /*
        Testing with no filters (should pick up any nearby bluetooth device)
    */
    // navigator.bluetooth.requestDevice({
    //     acceptAllDevices: true
    // }).then( (device) =>  {
    //     // Connected to device
    //     console.log('Name: ' + device.name);
    //     // Setting up event listener for when device gets disconnected
    //     device.addEventListener('gattserverdisconnected', onDisconnected);
    // }).catch( (error) => {
    //     console.error(error);
    // });

    /*
        Testing with battery filter (should pick up nearby bluetooth devices that offer the battery_service)
    */
    // navigator.bluetooth.requestDevice({
    //     filters: [{
    //         // Filtering based on battery service
    //         services: ['battery_service'],
    //     }]
    // }).then( (device) =>  {
    //     // Connected to device
    //     console.log('Name: ' + device.name);
    //     // Setting up event listener for when device gets disconnected
    //     device.addEventListener('gattserverdisconnected', onDisconnected);
    //     // Connecting to GATT Server on device
    //     return device.gatt.connect();
    // }).then( (server) => {
    //     // Getting battery service from GATT Server
    //     return server.getPrimaryService('battery_service');
    // }).then( (service) => {
    //     // Getting Level characteristic from service
    //     return service.getCharacteristic('battery_level');
    // }).then( (characteristic) => {
    //     // Setting up event listener for when Level characteristic value changes
    //     characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    //     return characteristic.readValue();
    // }).then( (value) => {
    //     console.log(`Value: ${value.getUnit8(0)}`);
    // }).catch( (error) => { console.error(error); });

    /*
        Testing with custom filter (should only pick up ROFLEX device)
    */
    navigator.bluetooth.requestDevice({
        filters: [{
            // Filtering based on UUID of service
            services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'],
        }]
        // If we want to read other services they need to be included as well
        // optionalServices: ['battery_service']
    }).then( (device) =>  {
        // Connected to device
        console.log('Name: ' + device.name);
        // Setting up event listener for when device gets disconnected
        device.addEventListener('gattserverdisconnected', onDisconnected);
        // Connecting to GATT Server on device
        return device.gatt.connect();
    }).then( (server) => {
        // Getting service from GATT Server
        return server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
    }).then( (service) => {
        // Getting characteristic from service
        return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
    }).then( (characteristic) => {
        // Setting up event listener for when characteristic value changes
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        return characteristic.readValue();
    }).then( (value) => {
        console.log(`Value: ${value.getUnit8(0)}`);
    }).catch( (error) => { console.error(error); });
}

// Function to handle change of value of GATT characteristic
function handleCharacteristicValueChanged(event) {
    let value = event.target.value.getUint8(0);
    console.log(`Value changed to: ${value}`);
}

// Function to handle when bluetooth device is disconnected
function onDisconnected(event) {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
}
