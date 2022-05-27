import React, { Component } from "react";
import EventList from "./EventList";
import NumberOfEvents from "./NumberOfEvents";
import CitySearch from "./CitySearch";

import WelcomeScreen from './WelcomeScreen';
import { getEvents, extractLocations, checkToken, getAccessToken } from
  './api';

//import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Navbar, Nav } from 'react-bootstrap';
//import Nav from "react-bootstrap/Nav";
import Alert from "react-bootstrap/Alert";

import "./App.css";
import "./nprogress.css";

class App extends Component {
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
    location: "all",
    showWelcomeScreen: undefined,
  };

  updateEvents = (location, eventCount = this.state.numberOfEvents) => {
    this.mounted = true;
    getEvents().then((events) => {
      const locationEvents =
        location === "all" ? events : events.filter((event) => event.location === location);
      const eventNumberFilter =
        eventCount > locationEvents.length ? locationEvents : locationEvents.slice(0, eventCount);
      if (this.mounted) {
        this.setState({
          events: eventNumberFilter,
        });
      }
    });
  };

  async componentDidMount() {
    this.mounted = true;
    // Only attempt to access Google API if online
    if (navigator.onLine && !window.location.href.startsWith("http://localhost")) {
      const accessToken = localStorage.getItem("access_token");
      const isTokenValid = (await checkToken(accessToken)).error ? false : true;
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      this.setState({ showWelcomeScreen: !(code || isTokenValid) });
      if ((code || isTokenValid) && this.mounted) {
        getEvents().then((events) => {
          if (this.mounted) {
            this.setState({
              events: events.slice(0, this.state.numberOfEvents),
              locations: extractLocations(events),
            });
          }
        });
      }
    }
    // If offline, skip to getEvents. This function grabs from localStorage when offline.
    else {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events: events.slice(0, this.state.numberOfEvents),
            locations: extractLocations(events),
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEventNumbers = (eventNumbers) => {
    this.setState({
      numberOfEvents: eventNumbers,
    });
    this.updateEvents(this.state.location, eventNumbers);
  };

  render() {
    //const logo = require("./meetUp_logo_transparent.png"); // with require
    if (
      this.state.showWelcomeScreen === undefined &&
      navigator.onLine &&
      !window.location.href.startsWith("http://localhost")
    ) {
      return <div className="App" />;
    }

    if (this.state.showWelcomeScreen === true)
      return (
        <WelcomeScreen
          showWelcomeScreen={this.state.showWelcomeScreen}
          getAccessToken={() => {
            getAccessToken();
          }}
        />
      );

    return (
      <div className="App">
        <Navbar sticky="top" bg="light" expand="lg" variant="light" className="mb-3">
          <Container fluid>
            <Navbar.Brand id="navbar-brand" >Meet <span id="navSpan">React </span> App{" "}
            </Navbar.Brand>

            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ml-auto">
                {" "}
                <NumberOfEvents updateEventNumbers={this.updateEventNumbers} />
                {" "}
                <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {!navigator.onLine && (
          <Alert variant="warning" style={{ textAlign: "center" }}>
            Attention: The app is running in offline mode! New Events cannot be loaded.
          </Alert>
        )}
        <EventList events={this.state.events} />
      </div>
    );
  }
}

export default App;