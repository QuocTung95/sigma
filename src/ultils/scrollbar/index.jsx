/**
 * https://github.com/malte-wessel/react-custom-scrollbars
 */
import React from 'react';
import PropTypes from 'prop-types';
import utils from './utils';
import styles from './components/styles';
import defaultRender from './components/defaultRenderElements';
import Helper from '../helper';
import raf from 'raf';
let caf = raf.cancel;
console.log('caf :', caf);

class Scrollbars extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            didMountUniversal: false
        };
        this.getScrollLeft = this.getScrollLeft.bind(this);
        this.getScrollTop = this.getScrollTop.bind(this);
        this.getScrollWidth = this.getScrollWidth.bind(this);
        this.getScrollHeight = this.getScrollHeight.bind(this);
        this.getClientWidth = this.getClientWidth.bind(this);
        this.getClientHeight = this.getClientHeight.bind(this);
        this.getValues = this.getValues.bind(this);
        this.getThumbHorizontalWidth = this.getThumbHorizontalWidth.bind(this);
        this.getThumbVerticalHeight = this.getThumbVerticalHeight.bind(this);
        this.getScrollLeftForOffset = this.getScrollLeftForOffset.bind(this);
        this.getScrollTopForOffset = this.getScrollTopForOffset.bind(this);
        this.scrollLeft = this.scrollLeft.bind(this);
        this.scrollTop = this.scrollTop.bind(this);
        this.scrollToLeft = this.scrollToLeft.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.scrollToRight = this.scrollToRight.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.addListeners = this.addListeners.bind(this);
        this.removeListeners = this.removeListeners.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleScrollStart = this.handleScrollStart.bind(this);
        this.handleScrollStartAutoHide = this.handleScrollStartAutoHide.bind(this);
        this.handleScrollStop = this.handleScrollStop.bind(this);
        this.handleScrollStopAutoHide = this.handleScrollStopAutoHide.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleHorizontalTrackMouseDown = this.handleHorizontalTrackMouseDown.bind(this);
        this.handleVerticalTrackMouseDown = this.handleVerticalTrackMouseDown.bind(this);
        this.handleHorizontalThumbMouseDown = this.handleHorizontalThumbMouseDown.bind(this);
        this.handleVerticalThumbMouseDown = this.handleVerticalThumbMouseDown.bind(this);
        this.setupDragging = this.setupDragging.bind(this);
        this.teardownDragging = this.teardownDragging.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDragEndAutoHide = this.handleDragEndAutoHide.bind(this);
        this.handleTrackMouseEnter = this.handleTrackMouseEnter.bind(this);
        this.handleTrackMouseEnterAutoHide = this.handleTrackMouseEnterAutoHide.bind(this);
        this.handleTrackMouseLeave = this.handleTrackMouseLeave.bind(this);
        this.handleTrackMouseLeaveAutoHide = this.handleTrackMouseLeaveAutoHide.bind(this);
        this.showTracks = this.showTracks.bind(this);
        this.hideTracks = this.hideTracks.bind(this);
        this.detectScrolling = this.detectScrolling.bind(this);
        this.raf = this.raf.bind(this);
        this.update = this.update.bind(this);
        this._update = this._update.bind(this);
    }
    componentDidMount () {
        this.addListeners();
        this.update();
        this.componentDidMountUniversal();
    }

    componentDidMountUniversal () { // eslint-disable-line react/sort-comp
        let universal = this.props.universal;
        if (!universal) return;
        this.setState({ didMountUniversal: true });
    }

    componentDidUpdate () {
        this.update();
    }

    componentWillUnmount () {
        this.removeListeners();
        caf(this.requestFrame);
        clearTimeout(this.hideTracksTimeout);
        clearInterval(this.detectScrollingInterval);
    }

    getScrollLeft () {
        return this.view.scrollLeft;
    }

    getScrollTop () {
        return this.view.scrollTop;
    }

    getScrollWidth () {
        return this.view.scrollWidth;
    }

    getScrollHeight () {
        return this.view.scrollHeight;
    }

    getClientWidth () {
        return this.view.clientWidth;
    }

    getClientHeight () {
        return this.view.clientHeight;
    }

    getValues () {
        let _view = this.view,
            scrollLeft = _view.scrollLeft,
            scrollTop = _view.scrollTop,
            scrollWidth = _view.scrollWidth,
            scrollHeight = _view.scrollHeight,
            clientWidth = _view.clientWidth,
            clientHeight = _view.clientHeight;


        return {
            left: scrollLeft / (scrollWidth - clientWidth) || 0,
            top: scrollTop / (scrollHeight - clientHeight) || 0,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            scrollWidth: scrollWidth,
            scrollHeight: scrollHeight,
            clientWidth: clientWidth,
            clientHeight: clientHeight
        };
    }

    getThumbHorizontalWidth () {
        let _props = this.props,
            thumbSize = _props.thumbSize,
            thumbMinSize = _props.thumbMinSize;
        let _view = this.view,
            scrollWidth = _view.scrollWidth,
            clientWidth = _view.clientWidth;

        let trackWidth = utils.getInnerWidth(this.trackHorizontal);
        let width = Math.ceil(clientWidth / scrollWidth * trackWidth);
        if (trackWidth === width) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(width, thumbMinSize);
    }

    getThumbVerticalHeight () {
        let _props = this.props,
            thumbSize = _props.thumbSize,
            thumbMinSize = _props.thumbMinSize;
        let _view = this.view,
            scrollHeight = _view.scrollHeight,
            clientHeight = _view.clientHeight;
        let trackHeight = utils.getInnerHeight(this.trackVertical);
        let height = Math.ceil(clientHeight / scrollHeight * trackHeight);
        if (trackHeight === height) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(height, thumbMinSize);
    }

    getScrollLeftForOffset (offset) {
        let _view = this.view,
            scrollWidth = _view.scrollWidth,
            clientWidth = _view.clientWidth;

        let trackWidth = utils.getInnerWidth(this.trackHorizontal);
        let thumbWidth = this.getThumbHorizontalWidth();
        return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
    }

    getScrollTopForOffset (offset) {
        let _view = this.view,
            scrollHeight = _view.scrollHeight,
            clientHeight = _view.clientHeight;

        let trackHeight = utils.getInnerHeight(this.trackVertical);
        let thumbHeight = this.getThumbVerticalHeight();
        return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
    }

    scrollLeft () {
        let left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.view.scrollLeft = left;
    }

    scrollTop () {
        let top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.view.scrollTop = top;
    }

    scrollToLeft () {
        this.view.scrollLeft = 0;
    }

    scrollToTop () {
        this.view.scrollTop = 0;
    }

    scrollToRight () {
        this.view.scrollLeft = this.view.scrollWidth;
    }

    scrollToBottom () {
        this.view.scrollTop = this.view.scrollHeight;
    }

    addListeners () {
        if (typeof document === 'undefined') return;
        let view = this.view,
            trackHorizontal = this.trackHorizontal,
            trackVertical = this.trackVertical,
            thumbHorizontal = this.thumbHorizontal,
            thumbVertical = this.thumbVertical;

        view.addEventListener('scroll', this.handleScroll);
        if (!utils.getScrollbarWidth()) return;
        trackHorizontal.addEventListener('mouseenter', this.handleTrackMouseEnter);
        trackHorizontal.addEventListener('mouseleave', this.handleTrackMouseLeave);
        trackHorizontal.addEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        trackVertical.addEventListener('mouseenter', this.handleTrackMouseEnter);
        trackVertical.addEventListener('mouseleave', this.handleTrackMouseLeave);
        trackVertical.addEventListener('mousedown', this.handleVerticalTrackMouseDown);
        thumbHorizontal.addEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        thumbVertical.addEventListener('mousedown', this.handleVerticalThumbMouseDown);
        if(typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleWindowResize);
        }
    }

    removeListeners () {
        /* istanbul ignore if */
        if (typeof document === 'undefined') return;
        let view = this.view,
            trackHorizontal = this.trackHorizontal,
            trackVertical = this.trackVertical,
            thumbHorizontal = this.thumbHorizontal,
            thumbVertical = this.thumbVertical;

        if (typeof view !== 'undefined')
            view.removeEventListener('scroll', this.handleScroll);

        if (!utils.getScrollbarWidth()) return;

        if(trackHorizontal){
            trackHorizontal.removeEventListener('mouseenter', this.handleTrackMouseEnter);
            trackHorizontal.removeEventListener('mouseleave', this.handleTrackMouseLeave);
            trackHorizontal.removeEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        }
        if(trackVertical){
            trackVertical.removeEventListener('mouseenter', this.handleTrackMouseEnter);
            trackVertical.removeEventListener('mouseleave', this.handleTrackMouseLeave);
            trackVertical.removeEventListener('mousedown', this.handleVerticalTrackMouseDown);
        }
        if(trackVertical){
            trackVertical.removeEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        }
        if(thumbVertical){
            thumbVertical.removeEventListener('mousedown', this.handleVerticalThumbMouseDown);
        }
        if(typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleWindowResize);
        }
        // Possibly setup by `handleDragStart`
        this.teardownDragging();
    }

    handleScroll (event) {
        let self = this;
        // console.log(this);
        // debugger
        let _props = this.props,
            onScroll = _props.onScroll,
            onScrollFrame = _props.onScrollFrame;
        if (onScroll) onScroll(event);
        this.update(function (values) {
            let scrollLeft = values.scrollLeft,
                scrollTop = values.scrollTop;
            self.viewScrollLeft = scrollLeft;
            self.viewScrollTop = scrollTop;
            if (onScrollFrame) onScrollFrame(values);
        });
        this.detectScrolling();
    }

    handleScrollStart () {
        let onScrollStart = this.props.onScrollStart;

        if (onScrollStart) onScrollStart();
        this.handleScrollStartAutoHide();
    }

    handleScrollStartAutoHide () {
        let autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.showTracks();
    }

    handleScrollStop () {
        let onScrollStop = this.props.onScrollStop;
        if (onScrollStop) onScrollStop();
        this.handleScrollStopAutoHide();
    }

    handleScrollStopAutoHide () {
        let autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.hideTracks();
    }

    handleWindowResize () {
        this.update();
    }

    handleHorizontalTrackMouseDown (event) {
        event.preventDefault();
        let target = event.target,
            clientX = event.clientX;

        let _targetBounding = target.getBoundingClientRect(),
            targetLeft = _targetBounding.left;

        let thumbWidth = this.getThumbHorizontalWidth();
        let offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
        this.view.scrollLeft = this.getScrollLeftForOffset(offset);
    }

    handleVerticalTrackMouseDown (event) {
        event.preventDefault();
        let target = event.target,
            clientY = event.clientY;

        let _targetBounding = target.getBoundingClientRect(),
            targetTop = _targetBounding.top;

        let thumbHeight = this.getThumbVerticalHeight();
        let offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
        this.view.scrollTop = this.getScrollTopForOffset(offset);
    }

    handleHorizontalThumbMouseDown (event) {
        event.preventDefault();
        this.handleDragStart(event);
        let target = event.target,
            clientX = event.clientX;
        let offsetWidth = target.offsetWidth;

        let _targetBounding = target.getBoundingClientRect(),
            left = _targetBounding.left;
        this.prevPageX = offsetWidth - (clientX - left);
    }

    handleVerticalThumbMouseDown (event) {
        event.preventDefault();

        this.handleDragStart(event);
        let target = event.target,
            clientY = event.clientY;
        let offsetHeight = target.offsetHeight;

        let _targetBounding = target.getBoundingClientRect(),
            top = _targetBounding.top;
        this.prevPageY = offsetHeight - (clientY - top);
    }

    setupDragging () {
        utils.css(document.body, styles.disableSelectStyle);
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.handleDragEnd);
        document.onselectstart = utils.returnFalse;
    }

    teardownDragging () {
        utils.css(document.body, styles.disableSelectStyleReset);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.onselectstart = undefined;
    }

    handleDragStart (event) {
        this.dragging = true;
        event.stopImmediatePropagation();
        this.setupDragging();
    }

    handleDrag (event) {
        if (this.prevPageX) {
            let clientX = event.clientX;

            let _trackHorizontalBounding = this.trackHorizontal.getBoundingClientRect(),
                trackLeft = _trackHorizontalBounding.left;
            let thumbWidth = this.getThumbHorizontalWidth();
            let clickPosition = thumbWidth - this.prevPageX;
            let offset = -trackLeft + clientX - clickPosition;
            this.view.scrollLeft = this.getScrollLeftForOffset(offset);
        }
        if (this.prevPageY) {
            let clientY = event.clientY;

            let _trackVerticalBounding = this.trackVertical.getBoundingClientRect(),
                trackTop = _trackVerticalBounding.top;
            let thumbHeight = this.getThumbVerticalHeight();
            let clickPosition = thumbHeight - this.prevPageY;
            let offset = -trackTop + clientY - clickPosition;
            this.view.scrollTop = this.getScrollTopForOffset(offset);
        }
        return false;
    }

    handleDragEnd () {
        this.dragging = false;
        this.prevPageX = this.prevPageY = 0;
        this.teardownDragging();
        this.handleDragEndAutoHide();
    }

    handleDragEndAutoHide () {
        let autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.hideTracks();
    }

    handleTrackMouseEnter () {
        this.trackMouseOver = true;
        this.handleTrackMouseEnterAutoHide();
    }

    handleTrackMouseEnterAutoHide () {
        let autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.showTracks();
    }

    handleTrackMouseLeave () {
        this.trackMouseOver = false;
        this.handleTrackMouseLeaveAutoHide();
    }

    handleTrackMouseLeaveAutoHide () {
        let autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.hideTracks();
    }

    showTracks () {
        clearTimeout(this.hideTracksTimeout);
        utils.css(this.trackHorizontal, { opacity: 1 });
        utils.css(this.trackVertical, { opacity: 1 });
    }

    hideTracks () {
        if (this.dragging) return;
        if (this.scrolling) return;
        if (this.trackMouseOver) return;
        let autoHideTimeout = this.props.autoHideTimeout;
        let self = this;
        clearTimeout(this.hideTracksTimeout);
        this.hideTracksTimeout = setTimeout(function () {
            utils.css(self.trackHorizontal, { opacity: 0 });
            utils.css(self.trackVertical, { opacity: 0 });
        }, autoHideTimeout);
    }

    detectScrolling () {
        if (this.scrolling) return;
        let self = this;
        this.scrolling = true;
        this.handleScrollStart();
        this.detectScrollingInterval = setInterval(function () {
            if (self.lastViewScrollLeft === self.viewScrollLeft && self.lastViewScrollTop === self.viewScrollTop) {
                clearInterval(self.detectScrollingInterval);
                self.scrolling = false;
                self.handleScrollStop();
            }
            self.lastViewScrollLeft = self.viewScrollLeft;
            self.lastViewScrollTop = self.viewScrollTop;
        }, 100);
    }

    raf (callback) {
        let self = this;
        if (this.requestFrame) raf.cancel(this.requestFrame);
        this.requestFrame = raf(function () {
            self.requestFrame = undefined;
            callback();
        });
    }

    update (callback) {
        let self = this;
        this.raf(function () { self._update(callback) });
    }

    _update (callback) {
        let _props = this.props,
            onUpdate = _props.onUpdate,
            hideTracksWhenNotNeeded = _props.hideTracksWhenNotNeeded;

        let values = this.getValues();

        if (utils.getScrollbarWidth()) {
            let scrollLeft = values.scrollLeft,
                clientWidth = values.clientWidth,
                scrollWidth = values.scrollWidth;
            let trackHorizontalWidth = utils.getInnerWidth(this.trackHorizontal);
            let thumbHorizontalWidth = this.getThumbHorizontalWidth();
            let thumbHorizontalX = scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalWidth - thumbHorizontalWidth);
            let thumbHorizontalStyle = {
                width: thumbHorizontalWidth,
                transform: 'translateX(' + thumbHorizontalX + 'px)'
            };
            let scrollTop = values.scrollTop,
                clientHeight = values.clientHeight,
                scrollHeight = values.scrollHeight;
            let trackVerticalHeight = utils.getInnerHeight(this.trackVertical);
            let thumbVerticalHeight = this.getThumbVerticalHeight();
            let thumbVerticalY = scrollTop / (scrollHeight - clientHeight) * (trackVerticalHeight - thumbVerticalHeight);
            let thumbVerticalStyle = {
                height: thumbVerticalHeight,
                transform: 'translateY(' + thumbVerticalY + 'px)'
            };
            if (hideTracksWhenNotNeeded) {
                let trackHorizontalStyle = {
                    visibility: scrollWidth > clientWidth ? 'visible' : 'hidden'
                };
                let trackVerticalStyle = {
                    visibility: scrollHeight > clientHeight ? 'visible' : 'hidden'
                };
                utils.css(this.trackHorizontal, trackHorizontalStyle);
                utils.css(this.trackVertical, trackVerticalStyle);
            }
            utils.css(this.thumbHorizontal, thumbHorizontalStyle);
            utils.css(this.thumbVertical, thumbVerticalStyle);
        }
        if (onUpdate) onUpdate(values);
        if (typeof callback !== 'function') return;
        callback(values);
    }

    render () {
        let scrollbarWidth = utils.getScrollbarWidth();
        let self = this;
        let _props = this.props,
            onScroll = _props.onScroll,
            onScrollFrame = _props.onScrollFrame,
            onScrollStart = _props.onScrollStart,
            onScrollStop = _props.onScrollStop,
            onUpdate = _props.onUpdate,
            renderView = _props.renderView,
            renderTrackHorizontal = _props.renderTrackHorizontal,
            renderTrackVertical = _props.renderTrackVertical,
            renderThumbHorizontal = _props.renderThumbHorizontal,
            renderThumbVertical = _props.renderThumbVertical,
            tagName = _props.tagName,
            hideTracksWhenNotNeeded = _props.hideTracksWhenNotNeeded,
            autoHide = _props.autoHide,
            autoHideTimeout = _props.autoHideTimeout,
            autoHideDuration = _props.autoHideDuration,
            thumbSize = _props.thumbSize,
            thumbMinSize = _props.thumbMinSize,
            universal = _props.universal,
            autoHeight = _props.autoHeight,
            autoHeightMin = _props.autoHeightMin,
            autoHeightMax = _props.autoHeightMax,
            style = _props.style,
            children = _props.children,
            props = Helper.objectWithoutProperties(_props, ['onScroll', 'onScrollFrame', 'onScrollStart', 'onScrollStop', 'onUpdate', 'renderView', 'renderTrackHorizontal', 'renderTrackVertical', 'renderThumbHorizontal', 'renderThumbVertical', 'tagName', 'hideTracksWhenNotNeeded', 'autoHide', 'autoHideTimeout', 'autoHideDuration', 'thumbSize', 'thumbMinSize', 'universal', 'autoHeight', 'autoHeightMin', 'autoHeightMax', 'style', 'children']);


        let didMountUniversal = this.state.didMountUniversal;

        let containerStyle = Helper.extendObject({}, styles.containerStyleDefault, autoHeight && Helper.extendObject({}, styles.containerStyleAutoHeight, {
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }), style);

        let viewStyle = Helper.extendObject({}, styles.viewStyleDefault, {
            // Hide scrollbars by setting a negative margin
            marginRight: scrollbarWidth ? -scrollbarWidth : 0,
            marginBottom: scrollbarWidth ? -scrollbarWidth : 0
        }, autoHeight && Helper.extendObject({}, styles.viewStyleAutoHeight, {
            // Add scrollbarWidth to autoHeight in order to compensate negative margins
            minHeight: utils.isString(autoHeightMin) ? 'calc(' + autoHeightMin + ' + ' + scrollbarWidth + 'px)' : autoHeightMin + scrollbarWidth,
            maxHeight: utils.isString(autoHeightMax) ? 'calc(' + autoHeightMax + ' + ' + scrollbarWidth + 'px)' : autoHeightMax + scrollbarWidth
        }), autoHeight && universal && !didMountUniversal && {
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }, universal && !didMountUniversal && styles.viewStyleUniversalInitial);

        let trackAutoHeightStyle = {
            transition: 'opacity ' + autoHideDuration + 'ms',
            opacity: 0
        };

        let trackHorizontalStyle = Helper.extendObject({}, styles.trackHorizontalStyleDefault, autoHide && trackAutoHeightStyle, (!scrollbarWidth || universal && !didMountUniversal) && {
            display: 'none'
        });

        let trackVerticalStyle = Helper.extendObject({}, styles.trackVerticalStyleDefault, autoHide && trackAutoHeightStyle, (!scrollbarWidth || universal && !didMountUniversal) && {
            display: 'none'
        });

        return React.createElement(tagName, Helper.extendObject({className:"scroll-wrapper"}, props, {
            style: containerStyle, ref: function (_ref1) {
                self.container = _ref1;
            }
        }), [
            React.cloneElement(
                renderView({ style: viewStyle }),
                { key: 'view',className:"scroll-wrapper-view", ref: function (el) { self.view = el; } },
                children
            ),
            React.cloneElement(
                renderTrackHorizontal({ style: trackHorizontalStyle }),
                { key: 'trackHorizontal', ref: function (el) { self.trackHorizontal = el; } },
                React.cloneElement(
                    renderThumbHorizontal({ style: styles.thumbHorizontalStyleDefault }),
                    { ref: function (el) { self.thumbHorizontal = el; } }
                )
            ),
            React.cloneElement(
                renderTrackVertical({ style: trackVerticalStyle }),
                { key: 'trackVertical', ref: function (el) { self.trackVertical = el; } },
                React.cloneElement(
                    renderThumbVertical({ style: styles.thumbVerticalStyleDefault }),
                    { ref: function (el) { self.thumbVertical = el; } }
                )
            )
        ]);
    }
}

Scrollbars.defaultProps = {
    renderView: defaultRender.renderViewDefault,
    renderTrackHorizontal: defaultRender.renderTrackHorizontalDefault,
    renderTrackVertical: defaultRender.renderTrackVerticalDefault,
    renderThumbHorizontal: defaultRender.renderThumbHorizontalDefault,
    renderThumbVertical: defaultRender.renderThumbVerticalDefault,
    tagName: 'div',
    thumbMinSize: 30,
    hideTracksWhenNotNeeded: false,
    autoHide: false,
    autoHideTimeout: 1000,
    autoHideDuration: 200,
    autoHeight: false,
    autoHeightMin: 0,
    autoHeightMax: 200,
    universal: false,
};
Scrollbars.propTypes = {
    onScroll: PropTypes.func,
    onScrollFrame: PropTypes.func,
    onScrollStart: PropTypes.func,
    onScrollStop: PropTypes.func,
    onUpdate: PropTypes.func,
    renderView: PropTypes.func,
    renderTrackHorizontal: PropTypes.func,
    renderTrackVertical: PropTypes.func,
    renderThumbHorizontal: PropTypes.func,
    renderThumbVertical: PropTypes.func,
    tagName: PropTypes.string,
    thumbSize: PropTypes.number,
    thumbMinSize: PropTypes.number,
    hideTracksWhenNotNeeded: PropTypes.bool,
    autoHide: PropTypes.bool,
    autoHideTimeout: PropTypes.number,
    autoHideDuration: PropTypes.number,
    autoHeight: PropTypes.bool,
    autoHeightMin: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    autoHeightMax: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    universal: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node,
};

export default Scrollbars;