import React, { Component } from 'react';
import DateUtilities from './utils';
import WeekHeader from './week-header';
import Weeks from './weeks';

class MonthHeader extends Component {
    displayName = "MonthHeader";

    state = {
        view: DateUtilities.clone(this.props.view),
        enabled: true,
        isForward: null
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            view: DateUtilities.clone(nextProps.view),
        });
        return true;
    }

    moveBackward = () => {
        let view = DateUtilities.clone(this.state.view);
        view.setMonth(view.getMonth() - 1);
        this.move(view, false);
    }

    moveForward = () => {
        let view = DateUtilities.clone(this.state.view);
        view.setMonth(view.getMonth() + 1);
        this.move(view, true);
    }

    move = (view, isForward) => {
        if (!this.state.enabled)
            return;

        this.setState({
            view: view,
            enabled: false,
            isForward: isForward
        });
    }

    enable = () => {
        this.setState({
            enabled: true,
            isForward: null
        });
    }

    render() {
        const enabled = this.state.enabled;
        return (

            <div>
                <div className="month-header">
                    <i className={enabled ? "" : "disabled"} onClick={this.moveBackward}>{String.fromCharCode(9664)}</i>
                    <span>{DateUtilities.toMonthAndYearString(this.state.view)}</span>
                    <i className={enabled ? "" : "disabled"} onClick={this.moveForward}>{String.fromCharCode(9654)}</i>
                </div>
                <WeekHeader />
                <Weeks id={this.props.id}
                    view={this.state.view}
                    other={this.state.view}
                    selected={this.props.selected}
                    onSelect={this.props.onSelect}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                    isForward={this.state.isForward}
                    enable={this.enable} />
            </div>

        )
    }
}

export default MonthHeader;