import React, {Fragment} from 'react'
import './css.css'
import CardImage from '../common/cardImage'

export default class NewsInHome extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            items: [
                {
                    name: 'Indonesia',
                    url: 'https://a0.muscache.com/im/pictures/45dc57ae-6bfe-42c1-961e-1291d216cc01.jpg?aki_policy=poster',
                    sub_info: 'Jungle retreat camping in Bali',
                    price_info: 'Từ $137/người -  2 ngày'
                },
                {
                    name: 'Tanzania, United Republic of',
                    url: 'https://a0.muscache.com/im/pictures/bb26510b-c56a-4811-9a50-e2357d96a936.jpg?aki_policy=poster',
                    sub_info: '10 Days Bush to Beach Selous+Zanzibar',
                    price_info: 'Từ $2.400/người -  12 ngày'
                },
                {
                    name: 'Na Uy',
                    url: 'https://a0.muscache.com/im/pictures/lombard/MtTemplate-884613-media_library/original/b33f6239-b565-4fdf-acc7-fac480b4112b.jpeg?aki_policy=poster',
                    sub_info: '2 Nights PACKAGE All Inclusive',
                    price_info: 'Từ $624/người -  3 ngày'
                },
                {
                    name: 'Ecuador',
                    url: 'https://a0.muscache.com/im/pictures/70261afa-61b1-435f-8d91-d55c0bc25022.jpg?aki_policy=poster',
                    sub_info: '4 Day Galapagos Island Hopping Budget',
                    price_info: 'Từ $137/người -  2 ngày'
                },
            ],
            imageSubNew: 'https://a0.muscache.com/4ea/air/v2/pictures/ea6285d9-5352-4447-b13d-b39bfc92dfe5.jpg?t=c:w1131-h343,r:w1131-h343-sfit,e:fjpg-c75',
        }
    }
    render(){
        return(
            <Fragment>
            <div className="introduce">
                <h2>Giới thiệu Chuyến phiêu lưu Airbnb</h2>
                <div className="sub-introduce">Các chuyến đi nhiều ngày do chuyên gia địa phương dẫn dắt – đã bao gồm các hoạt động, bữa ăn và chỗ ở.</div>
                <div className="introduce-all-place">
                    {
                        this.state.items.map(el=>{
                            return(
                                <CardImage item={el}/>
                            )
                        })
                    }
                </div>
            </div>


            </Fragment>
        )
    }
}