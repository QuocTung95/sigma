import React, { Component } from 'react';
import MonthHeader from './month-header';
import lang from '../lang/index';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.displayName = "Calendar";
    }

    onChangeHourTime = event => {
        this.props.onChangeHourTime(event.target.value);
    }

    onChangeMinuteTime = event =>{
        this.props.onChangeMinuteTime(event.target.value);
    }

    renderTimePicker = () => {
        let hourTime = parseInt(this.props.hourTime);
        let minuteTime = parseInt(this.props.minuteTime);
        let showTime = this.props.showTime;
        if (showTime) {
            return (
                <div className="TimePicker">
                    <div className="divTableBody">
                        <div className="divTableRow">
                            <div className="divTableCell">{lang.titles.time}</div>
                            <div className="divTableCell"
                                 style={{
                                     textAlign: "center",
                                     fontSize: "16px"
                                 }}>{this.props.hourTime + ':' + this.props.minuteTime}</div>
                        </div>
                        <div className="divTableRow">
                            <div className="divTableCell">{lang.titles.hours}</div>
                            <div className="divTableCell">
                                <input max="23" min="0" type="range" defaultValue="0" value={hourTime}
                                       onChange={this.onChangeHourTime}/>
                            </div>
                        </div>
                        <div className="divTableRow">
                            <div className="divTableCell">{lang.titles.minute}</div>
                            <div className="divTableCell">
                                <input max="59" min="0" type="range" defaultValue="0" value={minuteTime}
                                       onChange={this.onChangeMinuteTime}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div style={{top: this.props.top, left: this.props.left}}
                 ref={el => {
                     this.assignRefs['calendar_' + this.props.id] = el
                 }}
                 className={"ardp-calendar-" + this.props.id + " calendar" + (this.props.visible ? " calendar-show" : " calendar-hide") }>
                <MonthHeader view={this.props.view} onMove={this.onMove} selected={this.props.selected}
                             id={this.props.id} onSelect={this.props.onSelect} minDate={this.props.minDate}
                             maxDate={this.props.maxDate}/>
                {this.renderTimePicker()}
            </div>
        );
    }
}

export default Calendar;