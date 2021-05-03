import React, {Component} from 'react';
import {View, Text} from 'react-native'

class OfferView extends Component {
    constructor(props){
        super(props);

        this.state={
            offers: []
        }
    }

    render(){
        return(
            <View style={{height: '100%', width: '100%', justifyContent: 'center'}}>
            {this.state.offers.length === 0 ? <NoOfferView/> : 'Waiting'}
            </View>
        )
    }
}

const NoOfferView = () => {
    return(
        <View style={{height: '100%', width: '100%', justifyContent: 'center'}}>
            <Text style={{width: '80%', textAlign: 'center', alignSelf: 'center', fontSize: 23, color: '#0074ff', fontWeight: 'bold'}}>
                Don't worry, we'll find you an offer!
            </Text>
            <Text style={{marginTop: 10, width: '80%', textAlign: 'center', alignSelf: 'center', fontSize: 18}}>
                Sorry, but we don't have an offer for you yet. We will notify you as soon as we have any exciting offer for you!
            </Text>
            </View>
    )
}

export default OfferView;