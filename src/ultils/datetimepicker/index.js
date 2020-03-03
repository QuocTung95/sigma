import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css/style.css';
import DateUtilities from './components/utils';
import Calendar from './components/calendar';
import lang from './lang';

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.displayName = "DatePicker";
        this.showTime = false;
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        let propsDate = this.props.selected;
        let def;
        let hourTime = "00";
        let minuteTime = "00";
        this.showTime = this.props.showTime !== false;

        if (typeof propsDate === 'string') {
            if (DateUtilities.isCorrectDateTime(propsDate)) {
                let strDate = propsDate.substring(0, 10);
                let strTime = propsDate.substring(10, propsDate.length).trim();
                def = DateUtilities.buildDateObj(strDate);
                hourTime = strTime.split(":")[0];
                minuteTime = strTime.split(":")[1];

            } else if (DateUtilities.isCorrectDate(propsDate)) {
                def = DateUtilities.buildDateObj(propsDate);
            } else {
                def = new Date();
                propsDate = '';
            }
        } else if (propsDate instanceof Date && !isNaN(propsDate.getTime())) {
            def = propsDate;
            hourTime = ('0' + propsDate.getHours()).slice(-2);
            minuteTime = ('0' + propsDate.getMinutes()).slice(-2);

        } else {
            def = new Date();
            propsDate = '';
        }

        return {
            view: DateUtilities.clone(def),
            selected: DateUtilities.clone(def),
            minDate: null,
            maxDate: null,
            visible: false,
            isReadOnly: this.props.isReadOnly || false,
            id: this.getUniqueIdentifier(),
            stringDate: propsDate === '' ? '' : DateUtilities.toString(def) + (this.showTime ? ' ' + hourTime + ':' + minuteTime : ''),
            hourTime: hourTime,
            minuteTime: minuteTime,
            top: -999,
            left: 0
        };
    }

    componentDidMount() {
        document.addEventListener("click", this.hideOnDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.hideOnDocumentClick);
    }

    componentWillReceiveProps(nextProps) {
        let propsDate = nextProps.selected;
        let def;
        let hourTime = "00";
        let minuteTime = "00";
        if (typeof propsDate === 'string') {
            if (DateUtilities.isCorrectDateTime(propsDate)) {
                let strDate = propsDate.substring(0, 10);
                let strTime = propsDate.substring(10, propsDate.length).trim();
                def = DateUtilities.buildDateObj(strDate);
                hourTime = strTime.split(":")[0];
                minuteTime = strTime.split(":")[1];

            } else if (DateUtilities.isCorrectDate(propsDate)) {
                def = DateUtilities.buildDateObj(propsDate);
            } else {
                def = new Date();
                propsDate = '';
            }
        } else if (propsDate instanceof Date && !isNaN(propsDate.getTime())) {
            def = propsDate;
            hourTime = ('0' + propsDate.getHours()).slice(-2);
            minuteTime = ('0' + propsDate.getMinutes()).slice(-2);
        } else {
            def = new Date();
            propsDate = '';
        }

        if (!((DateUtilities.compareDateObj(def, this.state.selected) && hourTime === this.state.hourTime && minuteTime === this.state.minuteTime) || nextProps.selected === '')) {
            //set props to state
            this.setState({
                view: DateUtilities.clone(def),
                selected: DateUtilities.clone(def),
                visible: false,
                stringDate: propsDate === '' ? '' : DateUtilities.toString(def) + (this.showTime ? ' ' + hourTime + ':' + minuteTime : ''),
                hourTime: hourTime,
                minuteTime: minuteTime,
            });
        }
    }

    hideOnDocumentClick = e => {
        if (e.target.className.indexOf("date-picker-trigger-" + this.state.id) === -1 && !this.parentsHaveClassName(e.target, "ardp-calendar-" + this.state.id))
            this.hide();
    }

    getUniqueIdentifier = () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    parentsHaveClassName = (element, className) => {
        let parent = element;
        while (parent) {
            if (typeof parent.className === 'string' && parent.className.indexOf(className) > -1)
                return true;
            parent = parent.parentNode;
        }
        return false;
    }

    onChangeDate = event => {
        const self = this;
        let strDateTime = event.target.value.trim();
        if (DateUtilities.isCorrectDateTime(strDateTime) && this.showTime) {
            let strDate = strDateTime.substring(0, 10);
            let strTime = strDateTime.substring(10, strDateTime.length).trim();
            let DateObj = DateUtilities.buildDateObj(strDate);

            this.setState({
                selected: DateObj,
                view: DateObj,
                stringDate: strDate + " " + strTime,
                hourTime: strTime.split(":")[0],
                minuteTime: strTime.split(":")[1]
            }, function () {
                if (self.props.onSelect)
                    self.props.onSelect(strDateTime);
                if (self.props.onSelectObj)
                    self.props.onSelectObj(DateUtilities.buildDateTimeObj(DateObj, strTime.split(":")[0], strTime.split(":")[1]));
            });

        }
        else if (DateUtilities.isCorrectDate(strDateTime) && !(this.showTime)) {
            this.setState({
                selected: DateUtilities.buildDateObj(strDateTime),
                view: DateUtilities.buildDateObj(strDateTime),
                stringDate: strDateTime
            }, function () {
                if (self.props.onSelect)
                    self.props.onSelect(strDateTime);
                if (self.props.onSelectObj)
                    self.props.onSelectObj(DateUtilities.buildDateTimeObj(DateUtilities.buildDateObj(strDateTime), 0, 0));
            });
        }
        else {
            this.setState({
                stringDate: event.target.value
            }, function () {
                if (self.props.onSelect)
                    self.props.onSelect('');
                if (self.props.onSelectObj)
                    self.props.onSelectObj(null);
            });
        }
    }

    onChangeHourTime = hourTime => {
        const self = this;
        let strDateTime = DateUtilities.toString(this.state.selected) + " " + ('0' + hourTime).slice(-2) + ":" + this.state.minuteTime;
        this.setState({
            hourTime: ('0' + hourTime).slice(-2),
            stringDate: strDateTime
        }, function () {
            if (self.props.onSelect)
                self.props.onSelect(strDateTime);
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(self.state.selected, ('0' + hourTime).slice(-2), self.state.minuteTime));
        });
    }

    onChangeMinuteTime = minuteTime => {
        let strDateTime = DateUtilities.toString(this.state.selected) + " " + this.state.hourTime + ":" + ('0' + minuteTime).slice(-2);
        const self = this;
        this.setState({
            minuteTime: ('0' + minuteTime).slice(-2),
            stringDate: strDateTime
        }, function () {
            if (self.props.onSelect)
                self.props.onSelect(strDateTime);
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(self.state.selected, self.state.hourTime, ('0' + minuteTime).slice(-2)));
        });
    }

    setMinDate = date => {
        this.setState({ minDate: date });
    }

    setMaxDate = date => {
        this.setState({ maxDate: date });
    }

    onSelect = day => {
        const self = this;
        this.setState({
            selected: DateUtilities.clone(day),
            view: DateUtilities.clone(day),
            stringDate: DateUtilities.toString(day) + (this.showTime ? " " + this.state.hourTime + ":" + this.state.minuteTime : '')
        }, function () {
            if (self.props.onSelect)
                self.props.onSelect(this.state.stringDate);
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(this.state.selected, this.state.hourTime, this.state.minuteTime));
            self.hide();
        });
    }

    show = event => {
        let elInput = this.assignRefs['inputDateTimePicker' + this.state.id];
        let elCalendar = this.assignRefs['calendar_' + this.state.id];
        let isTopHalf = elInput.getBoundingClientRect().top > window.innerHeight / 2;
        let valueTop = isTopHalf ? -(elCalendar.getBoundingClientRect().height) : elInput.getBoundingClientRect().height;
        let isLeft = window.innerWidth - elInput.getBoundingClientRect().left > elCalendar.getBoundingClientRect().width;
        let valueLeft = isLeft ? 0 : -(elCalendar.getBoundingClientRect().width + elInput.getBoundingClientRect().left - window.innerWidth);

        if (!DateUtilities.isCorrectDateTime(event.target.value) && !DateUtilities.isCorrectDate(event.target.value)) {
            if (!this.state.visible) {
                this.setState({
                    view: new Date(),
                    visible: true,
                    selected: new Date(),
                    hourTime: '00',
                    minuteTime: '00',
                    stringDate: '',
                    top: valueTop,
                    left: valueLeft
                });
            }
        } else {
            if (!this.state.visible) {
                this.setState({
                    visible: true,
                    top: isTopHalf ? -270 : 25,
                    left: valueLeft
                });
            }
        }
    }

    hide = () => {
        if (this.state.visible) {
            let strDate = this.state.stringDate;
            if (!(DateUtilities.isCorrectDateTime(strDate) && this.showTime) &&
                !(DateUtilities.isCorrectDate(strDate) && !(this.showTime))) {
                strDate = '';
            }
            this.setState({
                visible: false,
                stringDate: strDate
            });
        }
    }

    render() {
        return (
            <div className='ardp-date-picker'>
                <input
                    ref={el => this.assignRefs['inputDateTimePicker' + this.state.id] = el}
                    name={this.props.nameInputDate || null}
                    type='text'
                    autoComplete='off'
                    readOnly={this.state.readOnly}
                    placeholder={this.props.placeholder ? this.props.placeholder : lang.placeholder.enterDate}
                    className={(this.showTime ? 'minWidthInput ' : '') + "date-picker-trigger-" + this.state.id}
                    value={this.state.stringDate}
                    contentEditable={true}
                    onClick={this.show}
                    onChange={this.onChangeDate} />
                <Calendar
                    id={this.state.id}
                    showTime={this.showTime}
                    view={this.state.view}
                    selected={this.state.selected}
                    onSelect={this.onSelect}
                    minDate={this.state.minDate}
                    maxDate={this.state.maxDate}
                    visible={this.state.visible}
                    top={this.state.top}
                    left={this.state.left}
                    hourTime={this.state.hourTime}
                    minuteTime={this.state.minuteTime}
                    onChangeHourTime={this.onChangeHourTime}
                    onChangeMinuteTime={this.onChangeMinuteTime} />

            </div>
        )
    }
};

DatePicker.propTypes = {
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    showTime: PropTypes.bool,
    nameInputDate: PropTypes.string,
    onSelect: PropTypes.func,
    onSelectObj: PropTypes.func
};

export default DatePicker;