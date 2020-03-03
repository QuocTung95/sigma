import React, { Component } from 'react';
import DateUtilities from './utils';
import Week from './week';

class Weeks extends Component {
    displayName = "Weeks";

    componentDidMount() {
        this.assignRefs['currentWeeks' + this.props.id].addEventListener("transitionend", this.onTransitionEnd);
    }

    componentWillUnmount() {
        if (this.assignRefs['currentWeeks' + this.props.id] !== null) {
            this.assignRefs['currentWeeks' + this.props.id].removeEventListener("transitionend", this.onTransitionEnd);
        }
    }

    onTransitionEnd = () => {
        this.props.enable();
    }

    getWeekStartDates = view => {
        view.setDate(1);
        view = DateUtilities.moveToDayOfWeek(DateUtilities.clone(view), 0);

        let current = DateUtilities.clone(view);
        current.setDate(current.getDate() + 7);

        let starts = [view];
        let month = current.getMonth();
        while (current.getMonth() === month) {
            starts.push(DateUtilities.clone(current));
            current.setDate(current.getDate() + 7);
        }
        return starts;
    }

    render() {
        return (
            <div className="weeks">
                <div ref={(el) => this.assignRefs['currentWeeks' + this.props.id] = el}
                    className={"current" + (this.props.isForward ? (" sliding left") : (this.props.isForward === null ? "" : " sliding right"))}>
                    {this.renderWeeks(this.props.view)}
                </div>
                <div className={"other" + (this.props.isForward ? (" sliding left") : (this.props.isForward === null ? "" : " sliding right"))}>
                    {this.renderWeeks(this.props.other)}
                </div>

            </div>
        )
    }

    renderWeeks = view => {
        let starts = this.getWeekStartDates(view);
        let month = starts[1].getMonth();

        return starts.map((s, i) => (
            <Week key={i}
                start={s}
                month={month}
                selected={this.props.selected}
                onSelect={this.props.onSelect}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate} />));

    }
}

export default Weeks;