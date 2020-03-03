

import React  from 'react'
import Scrollbar from '../scrollbar/'
import '../style/css.css'
import Proptypes from 'prop-types'

var Item = function(props) {
    var item = props.item;
    return (
        <div className={props.className? "jsx-suggest-item "+props.className:"jsx-suggest-item"} onClick={props.onClick.bind(this,item)}>
            {typeof item.avatar != 'undefined' ? <div className="avatar">
                {(function() {
                    if (item.avatar) return (
                        <div style={{
                            background: 'url("' + item.avatar + '") center center / cover no-repeat',
                            width: '100%', height: '100%'
                        }}></div>
                    );
                })()}
            </div>: null}
            <div className="info tooltip" title={item.name + (item.ParentName? " (" + item.ParentName + ")" : '')}>
                <div className="title">{item.name || ''}{item.ParentName? <span className="parent-name"> ({item.ParentName})</span> : ''}</div>
                <div className="description">{item.description || ''}</div>
            </div>
        </div>
    );
};

export default class SuggestPanel extends React.Component{
    static defaultProps = {
            suggestions: [],
            onChoose: function(item) {},
            showSuggestions: false,
            className: '',
            itemClassName:'',
            onClickOutside: function() {},
            isLoading: false,
            onEmptyShowComponent: null,
            onLoadingShowComponent: null,
            footerComponent: null,
            maxHeight: 350,
            panelMarginTop: 80,
            panelMarginBottom: 80,
            parentContainer: function() {return null;}
    }
    constructor(props){
        super(props)
        this.state={}
    }

    componentDidMount() {
        window.addEventListener('click', this.windowOnClick);
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.windowOnClick);
    }
    windowOnClick =(e)=> {
        // this.setScrollbarDimension();
        if (this.suggestPanel.contains(e.target)) return;
        this.props.onClickOutside && this.props.onClickOutside();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.suggestions.length !== nextProps.suggestions.length ||
            (this.props.suggestions && this.props.showSuggestions !== nextProps.showSuggestions) ||
            this.props.isLoading !== nextProps.isLoading) {
            this.setScrollbarDimension();
        }
        this.setScrollbarDimension();
    }
    calculateAvailableSpace =(inputWrapperRef, rawHeight, parentContainer, callback) =>{
        var PADDING_TOP = isNaN(parseInt(this.props.panelMarginTop)) ? (80 + 40) : parseInt(this.props.panelMarginTop);
        var PADDING_BOTTOM = isNaN(parseInt(this.props.panelMarginBottom)) ? 80 : parseInt(this.props.panelMarginBottom);
        var MAX_HEIGHT = isNaN(parseInt(this.props.maxHeight)) ? 350 : parseInt(this.props.maxHeight);
        try {
            var inputRect = inputWrapperRef.getBoundingClientRect();
            var top = 0 + PADDING_TOP;
            var bottom = window.innerHeight - PADDING_BOTTOM;
            if (parentContainer) {
                top = parentContainer.getBoundingClientRect().top + 5;
                bottom = parentContainer.getBoundingClientRect().bottom - 5;
            }
        } catch (err) {}
        var topSpace = inputRect.top - top;
        var bottomSpace = bottom - inputRect.bottom;
        // prefer down direction if enough space
        if (bottomSpace >= rawHeight) {
            var shouldBeUp = false;
            var availableHeight = MAX_HEIGHT;
        } else {
            var shouldBeUp = topSpace - bottomSpace > 0;
            var availableHeight = topSpace > bottomSpace ? topSpace : bottomSpace;
            // availableHeight -= shouldBeUp ? PADDING_TOP : PADDING_BOTTOM;
            if (availableHeight < 0) availableHeight = 0;
            if (availableHeight > MAX_HEIGHT) availableHeight = MAX_HEIGHT;
        }
        callback(shouldBeUp, availableHeight);
    }
    setScrollbarDimension =()=> {
        var self = this;
        clearTimeout(self.timeout);
        self.timeout = setTimeout(function() {
            try {
                self.calculateAvailableSpace(
                    self.suggestPanel,
                    self.suggestionsPanel.offsetHeight,
                    self.props.parentContainer(),
                    function(shouldBeUp, maxHeight) {
                        var height = self.suggestionsPanel.offsetHeight + 2;
                        if (height > maxHeight) height = maxHeight;
                        if (height === self.state.scrollbarHeight && !!shouldBeUp === !!self.state.directionIsUp) return;
                        self.setState({ scrollbarHeight: height, directionIsUp: !!shouldBeUp });
                    }
                );
            } catch (err) {}
        }, 0);
    }

    loadMore =()=> {
        if(typeof this.props.callback == "function"){
            this.props.callback();
        }
    }
    render(){
        var self = this;
        return (
            <div
                className={(function() {
                    var classes = ['jsx-suggest-panel'];
                    if (self.props.className) classes.push(self.props.className);
                    if (self.state.directionIsUp) classes.push('upside-down');
                    return classes.join(' ');
                })()}
                ref={function(e) { self.suggestPanel = e; }}
            >

                {self.props.children}

                <div className={"jsx-suggest-wrapper" + (self.props.showSuggestions ? '' : ' invisible')}
                     style={self.state.directionIsUp ? { bottom: '100%' } : null}>
                    {(function() {
                        if (self.props.isLoading) {
                            if (self.props.onLoadingShowComponent) return self.props.onLoadingShowComponent;
                            return (
                                <pre className="suggestion-empty">
                                    Đang tìm kiếm <i className="fi fi-cog fa-spin"></i>
                                </pre>
                            );
                        }
                        return (
                            // <div>scroll hrerer</div>
                            <Scrollbar className="jsx-suggest-scrollbar" style={{ height: self.state.scrollbarHeight }} ref={function(e) { self.elementParent = e; }}>
                                <div ref={function(e) { self.suggestionsPanel = e; }} className="jsx-suggest-suggestions">
                                    {(function(suggestions) {
                                        if (!suggestions.length) {
                                            if (self.props.onEmptyShowComponent) return self.props.onEmptyShowComponent;
                                            return <pre className="suggestion-empty">Không có kết quả</pre>;
                                        }
                                        return suggestions.map(function(item, index) {
                                            return <Item key={index} item={item} onClick={self.props.onChoose} className={self.props.itemClassName}></Item>;
                                        });
                                    })(self.props.suggestions)}
                                </div>
                                {
                                    self.props.loadMore &&
                                    <div className="btn-load-more">
                                        <span onClick={self.loadMore}>Xem thêm</span>
                                    </div>
                                }
                            </Scrollbar>
                        );
                    })()}

                    {self.props.footerComponent}

                </div>
                <span className={"jsx-arrow" + (self.props.showSuggestions ? '' : ' invisible')}></span>
                <span className={"jsx-arrow jsx-arrow-border" + (self.props.showSuggestions ? '' : ' invisible')}></span>
            </div>
        );
    }
    
}

