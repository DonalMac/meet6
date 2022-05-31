import React, { Component } from "react";
import EventList from "./EventList";
import NumberOfEvents from "./NumberOfEvents";
import CitySearch from "./CitySearch";
import EventGenre from "./EventGenre";
import EventGenreCity from "./EventGenreCity";
import { getEvents, extractLocations, checkToken, getAccessToken } from
  './api';
import { Navbar, Nav } from 'react-bootstrap';
import Container from "react-bootstrap/Container";
import WelcomeScreen from './WelcomeScreen';
import Alert from "react-bootstrap/Alert";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./App.css";
import "./nprogress.css";
import { Col, Row } from "react-bootstrap";

class App extends Component {
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
    location: "all",
    showWelcomeScreen: undefined,
    fullEvents: [],
    buttonExpanded: false,
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

  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length;
      const city = location.split(/[,-]+/).shift();
      return { city, number };
    });

    return data;
  };

  showDetailsToggle() {
    //if there is a click, the state goes from false to true, then true to false
    this.setState({ buttonExpanded: !this.state.buttonExpanded });
  }
  render() {

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
        <Navbar sticky="top" bg="light" expand="lg" variant="light" >
          <Container fluid>
            <Container className="mb-3">
              <Navbar.Brand id="navbar-brand" >Meet <span id="navSpan">React </span> App{" "}
              </Navbar.Brand></Container>

            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ml-auto">
                {" "}
                <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
                {" "}
                <NumberOfEvents updateEventNumbers={this.updateEventNumbers} />

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {!navigator.onLine && (
          <Alert variant="warning" style={{ textAlign: "center" }}>
            Attention: The app is running in offline mode! New Events cannot be loaded.
          </Alert>
        )}

        <div
          className={
            this.state.buttonExpanded
              ? "charts-container charts-container-hide"
              : "charts-container"
          }
        >
          <button
            onClick={() => this.showDetailsToggle()}
            className={
              this.state.buttonExpanded ? "showCharts-button" : "showCharts-button"
            }
          >
            {/**button text is hide details if state is true, otherwise it's "see details" */}
            {this.state.buttonExpanded
              ? "Hide Data Charts"
              : "View Data Charts"}
          </button>


          {this.state.buttonExpanded && (
            <Container id="chartContainer" md={12} lg={12}>
              <Row>
                <Col className="centerElements"><h4>PieChart Active Shape Example</h4>
                  {/* implementing a wildly popular pie chart to visualize the popularity of event genres */}

                  <EventGenre events={this.state.events} /></Col>
                <Col className="centerElements"><h4>PieChart Custom label Example</h4>

                  <EventGenreCity events={this.state.events} />
                </Col>
              </Row><Row>
                <Col className="centerElements">
                  <h4>Events in each city</h4>
                  <ResponsiveContainer height={400} minWidth={400}>
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 60,
                        bottom: 20,
                        left: 0,
                      }}
                    >
                      <CartesianGrid stroke="none" />
                      <XAxis type="category" dataKey="city" name="city" stroke="#343a40" />
                      <YAxis
                        type="number"
                        dataKey="number"
                        name="Number of events"
                        allowDecimals={false}

                      />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter data={this.getData()} fill="darkblue" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            </Container>
          )}
        </div>

        <EventList events={this.state.events} />

      </div>
    );
  }
}

export default App;