
class SpaceObject {
    constructor(name) {
        this.name = this.checkInput(name);
    }

    checkInput(input) {
        if (input == null) {
            throw new Error("This input can't be null");
        }
        if (typeof (input) !== "string") {
            throw new Error("This input must be a String");
        }
        return input;
    }

    checkArrayLength(array) {
        if (array.length <= 0) {
            throw new Error("This array can't be empty");
        }
        return array;
    }
}

//Galaxy
class Galaxy extends SpaceObject {
    planetarySystems = [];
    constructor(name, planetarySystem) {
        super(name);
        if (planetarySystem.length < 1) {
            throw new Error("A galaxy needs at least 2 planetary systems.");
        }
        this.planetarySystems = planetarySystem;
    }
}

//PLANETARY SYSTEM
class PlanetarySystem extends SpaceObject {
    constructor(name, star) {
        super(name);
        if (!star) {
            throw new Error("A planetary system needs at least one star, this value can't be null");
        }
        if (!(star instanceof Star)) {
            throw new Error("The parameter provided is not a star")
        }
        if (star.collapsed) {
            throw new Error("This star can't be added, it is collapsed.");
        }
        if (star.planetarySystem !== null) {
            throw new Error("This star already belongs to a planetary system");
        }
        star.planetarySystem = this;
        this.star = star;
        this.planets = this.checkArrayLength(star.planets);
    }

    addPlanet(planet) {
        this.star.addSinglePlanet(planet);
        this.planets.push(planet);
    }

    updatePlanets() {
        this.planets = this.star.planets;
        for (let i = 0; i < this.planets.length; i++) {
            if (this.planets[i].planetarySystem === null) {
                this.planets[i].planetarySystem = this;
            }
        }
    }

    collapseStar() {
        this.star.collapsed = true;
        this.star.planetarySystem = null;
        for (let i = 0; i < this.star.planets.length; i++) {
            this.star.planets[i].collapsed = true;
            this.star.planets[i].star = null;
            this.star.planets[i].planetarySystem = null;
            for (let x = 0; x < this.star.planets[i].satellites.length; x++) {
                this.star.planets[i].satellites[x].collapsed = true;
            }
        }
        if (this.star.type === "black-hole") {
            for (let i = 0; i < this.star.planets.length; i++) {
                this.star.planets[i].satellites = []
            }
            this.star.planets = [];
            this.planets = [];
        }
        else {
            let counter = this.star.planets.length;
            for (let i = 0; i < counter; i++) {
                for (let x = 0; x < this.star.planets[i].satellites.length; x++) {
                    this.star.planets[i].satellites.shift();
                }
            }
            for (let x = 0; x < counter; x++) {
                this.star.planets.shift();
            }
        }
        this.star = null;
    }
}

//STAR
class Star extends SpaceObject {
    planetarySystem = null;
    planets = [];
    collapsed = false;
    constructor(name, type) {
        super(name);
        this.type = this.checkInput(type);
    }

    addSinglePlanet(planet) {
        if (!(planet instanceof Planet)) {
            throw new Error("The parameter is not a Planet")
        }
        if (planet.collapsed) {
            throw new Error("The planet" + planet.name + " can't be added, it collapsed");
        }
        if (planet.star !== null) {
            throw new Error("This planet already belongs to one star.");
        }
        planet.star = this;
        this.planets.push(planet);
        planet.indexFromStar = this.planets.indexOf(planet);
        if (this.planetarySystem !== null) {
            this.planetarySystem.updatePlanets();
        }
    }

    addPlanets(planets) {
        if (!Array.isArray(planets)) {
            throw new Error("The parameter is not an array");
        }
        for (let i = 0; i < planets.length; i++) {
            if (!(planets[i] instanceof Planet)) {
                throw new Error("The element " + planets[i] + " is not a planet")
            }
        }
        for (let i = 0; i < planets.length; i++) {
            if (planets[i].star !== null) {
                throw new Error("The planet " + planets[i].name + " already belongs to a star.");
            }
        }
        for (let i = 0; i < planets.length; i++) {
            this.planets.push(planets[i]);
            planets[i].star = this;
            planets[i].indexFromStar = this.planets.indexOf(planets[i]);
        }
        if (this.planetarySystem !== null) {
            this.planetarySystem.updatePlanets();
        }
    }
}

//PLANET
class Planet extends SpaceObject {
    planetarySystem = null;
    star = null;
    collapsed = false;
    indexFromStar = null;
    numberOfSatellites = 0;
    satellites = [];

    constructor(name) {
        super(name);
    }

    displayPlanetIndex() {
        if (this.star === null) {
            console.log("The planet " + this.name + " does not have a star assigned to it");
            return null;
        }
        console.log("The index of the planet " + this.name + " from the star " + this.star.name + " is " + this.index);
        return this.index;
    }

    addSatellite(satellite) {
        if (!(satellite instanceof Satellite)) {
            throw new Error("The parameter is not a Satellite")
        }
        if (satellite.collapsed) {
            throw new Error("This satellite can't be added, it has been destroyed");
        }
        if (satellite.planet !== null) {
            throw new Error("This satellite already belongs to one planet.");
        }
        this.satellites.push(satellite);
        satellite.planet = this;
        satellite.indexFromPlanet = this.satellites.indexOf(satellite);
        this.numberOfSatellites = this.satellites.length;
    }

    displaySatellites() {
        if (this.satellites.length === 0) {
            console.log("this planet has no satellites assigned");
        } else {
            console.log(this.satellites);
        }

    }

}

//SATELLITE
class Satellite extends SpaceObject {
    planet = null;
    collapsed = false;
    indexFromPlanet = null;
    constructor(name, isNatural) {
        super(name);
        if (typeof (isNatural) !== "boolean") {
            throw new Error("This input must be a boolean");
        }
        this.isNatural = isNatural;
    }
}


//object creation/Verification

let sun = new Star("Sun", "Yellow Dwarf");

let mercury = new Planet("Mercury");
let venus = new Planet("Venus")

let earth = new Planet("Earth");
let ISS = new Satellite("ISS", false)
let moon = new Satellite("Moon", true);
earth.addSatellite(ISS);
earth.addSatellite(moon);

let mars = new Planet("Mars");
let phobos = new Satellite("Phobos", true);
let deimos = new Satellite("Deimos", true);
mars.addSatellite(phobos);
mars.addSatellite(deimos);


let solarSystemPlanets = [mercury, venus, earth]
sun.addPlanets(solarSystemPlanets);


let solarSystem = new PlanetarySystem("Solar System", sun);
solarSystem.addPlanet(mars);



let gielinor = new Planet("Gielinor");
let varrock = new Satellite("Varrock", true);
let falador = new Satellite("falador", false);
gielinor.addSatellite(varrock);
gielinor.addSatellite(falador);

let ardan = new Planet("Ardan");
let lumbridge = new Satellite("Lumbridge", false);
let alKharid = new Satellite("Al-Kharid", true)

let guthix = new Star("Guthix", "black-hole");
let guthixPlanets = [gielinor, ardan];
guthix.addPlanets(guthixPlanets);


let runescape = new PlanetarySystem("Runescape", guthix);



