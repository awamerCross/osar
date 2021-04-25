import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    I18nManager,
    ScrollView,
    ActivityIndicator
} from "react-native";
import {Container, Content, Icon, Input} from 'native-base'
import styles from '../../../assets/styles'
import i18n from "../../../locale/i18n";
import {useDispatch, useSelector} from "react-redux";
import {getOrders} from '../../actions';
import Header from '../../common/Header';
import COLORS from "../../consts/colors";
import {useIsFocused} from "@react-navigation/native";
const height = Dimensions.get('window').height;
const isIOS = Platform.OS === 'ios';

function Orders({navigation,route}) {


    const [active, setActive] = useState(0);
    const [status, setStatus] = useState('RUNNING');

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const orders = useSelector(state => state.orders.orders);
    const [screenLoader , setScreenLoader ] = useState(false);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    function fetchData(){
        setStatus('RUNNING');
        setActive(0);
        setScreenLoader(true);
        dispatch(getOrders(lang , 'RUNNING', token)).then(() => setScreenLoader(false))
    }

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused])

    const setOrderStatus = (value, newStatus) => {
        setActive(value)
        setStatus(newStatus)
        setScreenLoader(true)
        dispatch(getOrders(lang , newStatus, token)).then(() => setScreenLoader(false))
    }

    function renderLoader(){
        if (screenLoader){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    function renderNoData() {
        if (orders && (orders).length <= 0) {
            return (
                <View style={[styles.directionColumnCenter , styles.Width_100, {height:height-200}]}>
                    <Image source={require('../../../assets/images/note.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return null
    }

    function Item({ name , image , date , orderNum , type , index }) {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('orderDetails' , {id:orderNum})} style={[styles.borderGray,styles.marginBottom_20 , styles.directionRow , styles.Radius_5 , {flex:1 , padding:10}]}>
                <View style={[styles.directionRow , {flex:1}]}>
                    <Image source={{uri:image}} style={[styles.icon60 , styles.Radius_7]} resizeMode={'cover'} />
                    <View style={[styles.paddingHorizontal_10 , {flex:1}]}>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14 , styles.marginBottom_5 , styles.alignStart , {lineHeight:20}]}>{name}</Text>
                        <Text style={[styles.textRegular , styles.text_midGray , styles.textSize_14 , styles.alignStart]}>{ date }</Text>
                    </View>
                </View>
                <View style={[{borderLeftWidth:1 , borderLeftColor:'#ddd' , paddingLeft:15} , styles.heightFull , styles.centerContext]}>
                    <Text style={[styles.textRegular , styles.text_darkRed , styles.textSize_14 , styles.marginBottom_5]}>{ i18n.t('orderNum') }</Text>
                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14 ]}>{ orderNum }</Text>
                </View>
            </TouchableOpacity>
        );
    }



    return (
        <Container style={[styles.bg_darkRed]}>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.bg_darkRed]}>

                <Header navigation={navigation} title={ i18n.t('myOrders') } />

                <View style={[styles.bgFullWidth ,styles.bg_White, styles.Width_100, {overflow:'hidden'}]}>

                    <View style={[styles.directionRowSpace , styles.paddingHorizontal_15, {borderBottomWidth:1 , borderBottomColor:'#ddd'}]}>
                        <TouchableOpacity onPress={() => setOrderStatus(0, "RUNNING")} style={[styles.paddingVertical_15 , styles.paddingHorizontal_15 , {borderBottomWidth:2 , borderBottomColor:active === 0 ? COLORS.darkRed : 'transparent' , flex:1}]}>
                            <Text style={[styles.textBold , styles.text_gray , styles.textCenter , styles.textSize_13]}>{ i18n.t('orderInProgress') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderStatus(1, "DELIVERED")} style={[styles.paddingVertical_15 , styles.paddingHorizontal_15 , {borderBottomWidth:2 , borderBottomColor:active === 1 ? COLORS.darkRed : 'transparent' , flex:1}]}>
                            <Text style={[styles.textBold , styles.text_gray , styles.textCenter , styles.textSize_13]}>{ i18n.t('finishedOrders') }</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.paddingHorizontal_20 , styles.marginTop_20 , styles.marginBottom_60]}>

                        {
                            orders && (orders).length > 0?
                                <FlatList
                                    data={orders}
                                    horizontal={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item , index}) => <Item
                                        id={item.order_id}
                                        name={item.provider.name}
                                        image={item.provider.avatar}
                                        date={item.date}
                                        orderNum={item.order_id}
                                        type={item.type}
                                    />}
                                    keyExtractor={item => item.id}
                                />
                                :
                                renderNoData()
                        }

                    </View>

                </View>

            </Content>
        </Container>
    );
}

export default Orders;


