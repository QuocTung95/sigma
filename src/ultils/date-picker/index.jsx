"use strict";
import './css/style.css';
import DateUtilities from './components/utils';
import Calendar from './components/calendar';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class DatePicker extends Component {

    showTime = false;

    constructor(props) {
        super(props);
        this.assignRefs={}
        this.setRef = this.setRef.bind(this);
        let propsDate = this.props.selected,
            def = new Date(),
            hourTime = "00",
            minuteTime = "00",
            _minDate = (this.props.minDate && this.props.minDate instanceof Date ? this.props.minDate : null);

        this.showTime = this.props.showTime !== false;
        if (typeof propsDate === 'string') {
            if (DateUtilities.isCorrectDateTime(propsDate)) {
                var strDate = propsDate.substring(0, 10),
                    strTime = propsDate.substring(10, propsDate.length).trim();
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

        /*if(_minDate != null && def.getFullYear() == _minDate.getFullYear() && def.getMonth() == _minDate.getMonth() && def.getDate() == _minDate.getDate()){
            hourTime = ('0' + _minDate.getHours()).slice(-2);
            minuteTime = ('0' + _minDate.getMinutes()).slice(-2);
        }*/


        this.state = {
            view: DateUtilities.clone(def),
            selected: DateUtilities.clone(def),
            minDate: this.props.minDate instanceof Date ? this.props.minDate : null,
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
    };

    componentWillUnmount() {
        document.removeEventListener("click", this.hideOnDocumentClick);
    };

    componentWillReceiveProps(nextProps) {
        var propsDate = nextProps.selected, def,
            hourTime = "00", minuteTime = "00";
        if (typeof propsDate === 'string') {
            if (DateUtilities.isCorrectDateTime(propsDate)) {
                var strDate = propsDate.substring(0, 10),
                    strTime = propsDate.substring(10, propsDate.length).trim();
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

        if (!(DateUtilities.compareDateObj(def, this.state.selected) && hourTime === this.state.hourTime && minuteTime === this.state.minuteTime) || nextProps.selected === '' || nextProps.selected === null) {
            //set props to state
            this.setState({
                view: DateUtilities.clone(def),
                selected: DateUtilities.clone(def),
                stringDate: propsDate === '' ? '' : DateUtilities.toString(def) + (this.showTime ? ' ' + hourTime + ':' + minuteTime : ''),
                hourTime: hourTime,
                minuteTime: minuteTime,
            });
        }
        else{
            //console.log('datepicker componentWillReceiveProps: ',nextProps);
        }
    }

    hideOnDocumentClick = (e) => {
        if (typeof e.target.className !== 'string' || (e.target.className.indexOf("date-picker-trigger-" + this.state.id) === -1 && !this.parentsHaveClassName(e.target, "ardp-calendar-" + this.state.id)))
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
        var parent = element;
        while (parent) {
            if (typeof parent.className === 'string' && parent.className.indexOf(className) > -1)
                return true;
            parent = parent.parentNode;
        }
        return false;
    }

    onChangeDate = (event) => {
        var self = this, strDateTime = event.target.value.trim();
        if (DateUtilities.isCorrectDateTime(strDateTime) && this.showTime) {
            var strDate = strDateTime.substring(0, 10),
                strTime = strDateTime.substring(10, strDateTime.length).trim(),
                DateObj = DateUtilities.buildDateObj(strDate);

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

    onChangeHourTime = (hourTime) => {
        var self = this;
        var strDateTime = DateUtilities.toString(this.state.selected) + " " + ('0' + hourTime).slice(-2) + ":" + this.state.minuteTime;
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

    onChangeMinuteTime = (minuteTime) => {
        var strDateTime = DateUtilities.toString(this.state.selected) + " " + this.state.hourTime + ":" + ('0' + minuteTime).slice(-2),
            self = this;
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

    setMinDate = (date) => {
        this.setState({minDate: date});
    }

    setMaxDate = (date) => {
        this.setState({maxDate: date});
    }

    onSelect = (day) => {
        var self = this;
        this.setState({
            selected: DateUtilities.clone(day),
            view: DateUtilities.clone(day),
            stringDate: DateUtilities.toString(day) + (self.showTime ? " " + this.state.hourTime + ":" + this.state.minuteTime : '')
        }, function () {            
            if (self.props.onSelect)
                self.props.onSelect(this.state.stringDate);
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(this.state.selected, this.state.hourTime, this.state.minuteTime));
            self.hide();
        });
    }

    show = (event) => {
        var elInput = this.assignRefs['inputDateTimePicker' + this.state.id]
        var elCalendar = this.assignRefs['calendar_' + this.state.id]
        var isTopHalf = elInput.getBoundingClientRect().top > window.innerHeight / 2
        var valueTop = isTopHalf ? -(elCalendar.getBoundingClientRect().height) : elInput.getBoundingClientRect().height
        var isLeft = window.innerWidth - elInput.getBoundingClientRect().left > elCalendar.getBoundingClientRect().width
        var valueLeft = isLeft ? 0 : -(elCalendar.getBoundingClientRect().width + elInput.getBoundingClientRect().left - window.innerWidth);

        if (!DateUtilities.isCorrectDateTime(event.target.value) && !DateUtilities.isCorrectDate(event.target.value)) {
            if (!this.state.visible) {
                var _date = new Date(), hours = _date.getHours(), minutes = _date.getMinutes();
                this.setState({
                    view: _date,
                    visible: true,
                    selected: _date,
                    hourTime: (hours<10?'0'+hours : hours.toString()),
                    minuteTime: (minutes<10?'0'+minutes : minutes.toString()),
                    stringDate: '',
                    top: valueTop,
                    left: valueLeft
                });
            }
        } else {
            if (!this.state.visible) {
                this.setState({
                    visible: true,
                    top: isTopHalf ? (this.showTime ? -270 : -200) : 25,
                    left: valueLeft
                });
            }
        }

        event.preventDefault();
    }

    hide = ()=> {
        if (this.state.visible) {
            var strDate = this.state.stringDate;
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
    setRef(el) {
        this.assignRefs['calendar_' + this.state.id] = el;
    }

    render() {
        var self = this;
        return React.createElement("div", {className: "ardp-date-picker"},
            React.createElement("input",
                {
                    ref: function (el) {
                        self.assignRefs['inputDateTimePicker' + self.state.id] = el
                    },
                    name: self.props.nameInputDate || null,
                    type: "text",
                    autoComplete: 'on',
                    readOnly: self.state.isReadOnly,
                    placeholder: self.props.placeholder ? self.props.placeholder : 'Nhập ngày',
                    className: (self.showTime ? 'minWidthInput ' : '') + "date-picker-trigger-" + self.state.id,
                    value: self.state.stringDate,
                    // contentEditable: true,
                    onFocus: self.show,
                    onChange: self.onChangeDate
                }
            ),
            React.createElement(Calendar,
                {
                    id: self.state.id,
                    showTime: self.showTime,
                    view: self.state.view,
                    selected: self.state.selected,
                    onSelect: self.onSelect,
                    minDate: self.state.minDate,
                    maxDate: self.state.maxDate,
                    visible: self.state.visible,
                    top: self.state.top,
                    left: self.state.left,
                    hourTime: self.state.hourTime,
                    minuteTime: self.state.minuteTime,
                    onChangeHourTime: self.onChangeHourTime,
                    onChangeMinuteTime: self.onChangeMinuteTime,
                    setRef : self.setRef
                }
            )
        );
    }
}

DatePicker.propTypes = {
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    showTime: PropTypes.bool,
    nameInputDate: PropTypes.string,
    onSelect: PropTypes.func,
    onSelectObj: PropTypes.func
};

export default DatePicker;