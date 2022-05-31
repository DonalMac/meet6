import React, { Component } from "react";

class Event extends Component {
  state = {
    collapsed: true,
    date: "",
  };

  handleClick = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { event } = this.props;
    const { collapsed } = this.state;

    const eventDate = event.start.dateTime;
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let splitDate = eventDate.split(/[-T]+/);
    let exactTime = splitDate[3].split("+")[0].slice(0, 5);
    let extraTime = splitDate[3].split("+")[1].slice(1, 2);
    let yearDate = splitDate[0];
    let yearMonth = splitDate[1].includes("0")
      ? splitDate[1].slice(1, 2)
      : splitDate[1];
    let yearDay = splitDate[2];
    var yearMonthInt = parseInt(yearMonth);
    let monthStr = months.slice(yearMonthInt, yearMonthInt + 1);
    let dateToConvert = `${monthStr} ${yearDay}, ${yearDate} ${exactTime}`;
    let converD = new Date(dateToConvert);
    let weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let dayInt = converD.getDay();
    //this is the exact weekday (name)
    let actualDay = weekdays[dayInt];
    let convertedDate = `${actualDay} ${yearDay}/${splitDate[1]}/${yearDate}, at ${exactTime}`;
    return (
      <div className="event">
        <h2 className="summary">{event.summary}</h2>
        <p className="start-date">
          {convertedDate} <br></br>
          <span>
            Timezone: {event.start.timeZone} + {extraTime} hours
          </span>
        </p>

        <p className="location">
          @{event.summary} | {event.location}
        </p>

        <button
          variant="outline-info"
          className={`details-button ${collapsed ? "show" : "hide"}-details`}
          onClick={this.handleClick}
        >
          {collapsed ? "Show Details" : "Hide Details"}
        </button>

        {!collapsed && (
          <div
            className={`extra-details ${this.state.collapsed ? "hide" : "show"
              }`}
          >
            <h3>About the event:</h3>
            <a href={event.htmlLink} rel="noreferrer" target="_blank">
              See details on Google Calendar
            </a>
            <p className="event-description">{event.description}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Event;