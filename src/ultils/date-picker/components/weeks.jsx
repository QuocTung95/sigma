import DateUtilities from './utils';
import Week from './week';
import React, {Component} from 'react';

class Weeks extends Component {
    constructor(props) {
        super(props);
        this.assignRefs={}
    }

    componentDidMount() {
        var self = this;
        self.assignRefs['currentWeeks' + self.props.id].addEventListener("transitionend", self.onTransitionEnd);
    };

    componentWillUnmount() {
        if (this.assignRefs['currentWeeks' + this.props.id] !== null) {
            this.assignRefs['currentWeeks' + this.props.id].removeEventListener("transitionend", this.onTransitionEnd);
        }
    };

    onTransitionEnd = () => {
        this.props.enable();
    };

    getWeekStartDates = (view) => {
        view.setDate(1);
        view = DateUtilities.moveToDayOfWeek(DateUtilities.clone(view), 0);

        const current = DateUtilities.clone(view);
        current.setDate(current.getDate() + 7);

        let starts = [view], month = current.getMonth();
        while (current.getMonth() === month) {
            starts.push(DateUtilities.clone(current));
            current.setDate(current.getDate() + 7);
        }
        return starts;
    };

    renderWeeks = (view) => {
        var starts = this.getWeekStartDates(view),
            month = starts[1].getMonth();

        return starts.map(function (s, i) {
            return React.createElement(Week, {
                key: i,
                start: s,
                month: month,
                selected: this.props.selected,
                onSelect: this.props.onSelect,
                minDate: this.props.minDate,
                maxDate: this.props.maxDate
            });
        }.bind(this));
    };

    render() {
        var self = this;
        return React.createElement("div", {className: "weeks"},
            React.createElement("div", {
                    ref: function (el) {
                        self.assignRefs['currentWeeks' + self.props.id] = el
                    },
                    className: "current" + (this.props.isForward ? (" sliding left") : (this.props.isForward === null ? "" : " sliding right"))
                },
                this.renderWeeks(this.props.view)
            ),
            React.createElement("div", {
                    className: "other" + (this.props.isForward ? (" sliding left") : (this.props.isForward === null ? "" : " sliding right"))
                },
                this.renderWeeks(this.props.other)
            )
        );
    }
}

export default Weeks;
