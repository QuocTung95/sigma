import React  from 'react'
import PropTypes from 'prop-types'
import hepler from '../helper'
var getUniqueString = (function () {
    var i = 470000;
    return function () {
        return (i++).toString(36); // convert number to base36
    };
})();

export default class Input extends React.Component{

    static propTypes ={
        id: PropTypes.string,
        name: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
        inputRef: PropTypes.func,
        placeholder: PropTypes.string,
        autoComplete: PropTypes.oneOf(['on','off']),
        readOnly: PropTypes.bool,
        allowHtml: PropTypes.bool,
        value: PropTypes.string,
        className: PropTypes.string,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur:PropTypes.func,
        maxLength: PropTypes.number
    }
    static defaultProps = {
        id: "",
        type: 'text',
        name: '',
        placeholder: '',
        autoComplete: "off",
        autoFocus: false,
        readOnly: false,
        style: {},
        allowHtml: false,
        onChange: function (newVal) { },
        onFocus: function () { },
        onBlur: function () { },
        inputRef: function (e) { },
    }
    constructor(props){
        super(props)
        var id = this.props.id || 'input_' + getUniqueString();
        var _value="";
        if(typeof this.props.value !== "undefined" && this.props.value){
            _value = this.props.value;
        }
        else if(typeof this.props.defaultValue !== "undefined" && this.props.defaultValue){
            _value = this.props.defaultValue;
        }

        this.state = {
            id: id,
            invalidMessage: '',
            characters: _value.length
        }
    }
    componentWillReceiveProps(nextProps) {
        if(typeof this.props.value !== "undefined" && typeof nextProps.value !== "undefined" && this.props.value !== nextProps.value){
            this.setState({characters: nextProps.value.length});
        }
        else if(typeof this.props.defaultValue !== "undefined" && typeof nextProps.defaultValue !== "undefined" && this.props.defaultValue !== nextProps.defaultValue){
            this.setState({characters: nextProps.defaultValue.length});
        }
    }

    handleOnChange = (e) => {
        var value = e.target.value;
        if (!this.props.allowHtml && hepler.isHTMLContent(value)) {
            this.setState({invalidMessage: 'Vui lòng không nhập mã HTML.',characters: value.length});
            return;
        }
        if(e.target.hasAttribute('required') && e.target.value !== ""){
            e.target.removeClass('invalid');
        }
        this.props.onChange(value, e);
        this.setState({invalidMessage: "",characters: value.length});
    }

    onBlur = (e) => {
        if(e.target){
            if(e.target && e.target.hasAttribute('required') && e.target.value == ""){
                e.target.addClass('invalid');
                //e.target.focus();
                this.setState({invalidMessage: this.props.invalidMessage ? this.props.invalidMessage : "Vui lòng nhập trường này."});
            }
            else{
                // console.log('e.target :', e.target);
                // e.target.removeClass('invalid');
            }
        }

        
        if (typeof this.props.onBlur == 'function') {
            this.props.onBlur(e);
        }
    }

    onKeyPress =(e) =>{
        var val = e.target.value;
        if (e.key === 'Enter' && typeof this.props.onEnter == "function"){
            this.props.onEnter(val,e);
        }
        else if(typeof this.props.onKeyPress == "function"){
            this.props.onKeyPress(e);
        }
    }

    onKeyUp =(e) =>{
        if(typeof this.props.onKeyUp == "function"){
            this.props.onKeyUp(e);
        }
    }

    onKeyDown =(e)=>{
        if(typeof this.props.onKeyDown == "function"){
            this.props.onKeyDown(e);
        }
    }

    render () {
        var cssClass = ["ims-input"];
        var _inputProps = {
            id:this.state.id,
            type:this.props.type,
            name:this.props.name,
            placeholder:this.props.placeholder,
            onChange:this.handleOnChange,
            autoComplete:this.props.autoComplete,
            readOnly:this.props.readOnly,
            onFocus:this.props.onFocus,
            onBlur:this.onBlur,
            ref:this.refFn,
            style:this.props.style,
            onKeyPress:this.onKeyPress,
            onKeyUp:this.onKeyUp,
            onKeyDown:this.onKeyDown,
            autoFocus:!!this.props.autoFocus
        };

        if(typeof this.props.value !== "undefined"){
            _inputProps["value"] = this.props.value;
        }

        if(typeof this.props.defaultValue !== "undefined"){
            _inputProps["defaultValue"] = this.props.defaultValue;
        }

        if(typeof this.props.required !== "undefined"){
            _inputProps["required"] = this.props.required;
            cssClass.push("required");
        }

        if(typeof this.props.readOnly !== "undefined" && this.props.readOnly){
            cssClass.push("readonly");
        }

        if(typeof this.props.disabled !== "undefined" && this.props.disabled){
            _inputProps["disabled"] = this.props.disabled;
            cssClass.push("disabled");
        }        

        if(typeof this.props.inputRef !== "undefined"){
            _inputProps["ref"] = this.props.inputRef;
        }

        if(typeof this.props.title !== "undefined" && this.props.title !== ""){
            _inputProps["title"] = this.props.title;
        }

        if(typeof this.props.maxLength !== "undefined" && this.props.maxLength > 0){
            _inputProps["maxLength"] = this.props.maxLength;
            cssClass.push("required-length");
        }

        if(typeof this.props.className !== "undefined" && this.props.className !== ""){
            cssClass.push(this.props.className);
        }

        return (
            React.createElement("span",{className:cssClass.join(" ")},
                React.createElement("input",_inputProps),
                typeof _inputProps["maxLength"] !== "undefined" && React.createElement("span", {className:"maxlength-counter",title:("Tối đa "+this.props.maxLength+" ký tự")},(this.state.characters+"/"+this.props.maxLength)),
                this.state.invalidMessage !== "" && React.createElement("span", {className:"input-invalid-message"},this.state.invalidMessage)
            )
        );
    }
}