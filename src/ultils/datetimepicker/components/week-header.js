import React, { Component } from 'react';
import lang from '../lang';

class WeekHeader extends Component {
    displayName = "WeekHeader"
    render() {
        return (
            <div className="week-header">
                <span>{lang.dayInWeek.Sunday}</span>
                <span>{lang.dayInWeek.Monday}</span>
                <span>{lang.dayInWeek.Tuesday}</span>
                <span>{lang.dayInWeek.Wednesday}</span>
                <span>{lang.dayInWeek.Thursday}</span>
                <span>{lang.dayInWeek.Friday}</span>
                <span>{lang.dayInWeek.Saturday}</span>
            </div>
        )
    }
}

export default WeekHeader;