import React, {Fragment} from 'react'
import './css.css'


export default class NewsInHome extends React.Component{

    constructor(props){
        super(props)
        this.state = {

        }
    }
    render(){
        var item = this.props.item
        return(
            <div className="card-image-info">
                <div className="image">
                    <img src={item.url || ''} alt={item.url}/>
                </div>
                <div className="sub-info">
                    {item.sub_info || ''}
                </div>
                <div className="price-info">
                    {item.price_info || ''}
                </div>

            </div>
        )
    }
}