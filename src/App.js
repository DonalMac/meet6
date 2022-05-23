import React, { Component } from "react";
import EventList from "./EventList";
import NumberOfEvents from "./NumberOfEvents";
import CitySearch from "./CitySearch";
import { getEvents, extractLocations } from "./api";
//import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Navbar, Nav } from 'react-bootstrap';
//import Nav from "react-bootstrap/Nav";

import "./App.css";
import "./nprogress.css";

class App extends Component {
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
    location: "all",
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

  componentDidMount() {
    this.mounted = true;
    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({
          events: events.slice(0, this.state.numberOfEvents),
          locations: extractLocations(events),
        });
      }
    });
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
        <EventList events={this.state.events} />
      </div>
    );
  }
}

export default App;