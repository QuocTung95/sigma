import React, {Component} from 'react';

class WeekHeader extends Component {
    render() {
        return React.createElement("div", {className: "week-header"},
            React.createElement("span", null, "C N"),
            React.createElement("span", null, "T 2"),
            React.createElement("span", null, "T 3"),
            React.createElement("span", null, "T 4"),
            React.createElement("span", null, "T 5"),
            React.createElement("span", null, "T 6"),
            React.createElement("span", null, "T 7")
        );
    }
}
WeekHeader.displayName = "WeekHeader";

export default WeekHeader;