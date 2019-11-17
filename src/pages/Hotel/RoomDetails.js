import React, {PureComponent} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  Linking,
} from 'react-native';
import {Button, Text, Activity_Indicator} from '../../components';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
//import MapView from "react-native-maps";
import moment from 'moment';

class RoomDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _selectRadio: '1',
      selectedRoom: props.params.RoomDetails[0],
    };
  }

  _radioButton = item => () => {
    console.log(item);
    this.setState({
      _selectRadio: item.RoomIndex,
      selectedRoom: item,
    });
  };

  render() {
    const {_selectRadio} = this.state;
    const {width, height} = Dimensions.get('window');
    return (
      <View>
        <View style={{marginVertical: 20, flexDirection: 'row'}}>
          <Image
            style={{width: width / 4, height: width / 5, borderRadius: 5}}
            source={require('../../assets/imgs/Hotel-Img.png')}
          />
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: 10,
              flex: 1,
            }}>
            <TouchableOpacity
              style={{flex: 3, paddingEnd: 4}}
              onPress={this._radioButton(this.props.item)}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: '#000',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={this._radioButton(this.props.item)}>
                  {_selectRadio === this.props.item.RoomIndex && (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 6,
                        backgroundColor: '#000',
                      }}
                    />
                  )}
                </TouchableOpacity>
                <Text style={{fontSize: 16, marginStart: 5}}>
                  {this.props.item.RoomType}
                </Text>
              </View>
              <Text style={{fontSize: 16}}>Room Description</Text>
              <Text style={{color: '#717A81'}}>No room description here</Text>

              <Text style={{fontSize: 16}}>inclusions</Text>
              <Text style={{color: '#717A81'}}>No room inclusion here</Text>
            </TouchableOpacity>
            <View style={{flex: 2, paddingStart: 4, marginStart: 10}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                $ {this.props.item.RoomTotal}
              </Text>
              <Text style={{color: '#717A81'}}>
                {this.props.params.room}:Room(s),{this.props.params.Night}:night
              </Text>
              <Text style={{color: '#717A81'}}>
                {this.props.item.RefundRule ? this.props.item.RefundRule : ''}
              </Text>
              <Text style={{color: '#5B89F9', marginTop: 10}}>Fare Policy</Text>
            </View>
          </View>
        </View>
        <View style={{height: 1.35, backgroundColor: '#DDDDDD'}}></View>
      </View>
    );
  }
}

export default RoomDetails;
