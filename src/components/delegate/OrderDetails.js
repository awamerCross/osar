import React, {useEffect, useRef, useState} from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, FlatList, I18nManager, ActivityIndicator} from "react-native";
import {Container, Content, Icon, Input} from 'native-base'
import styles from '../../../assets/styles'
import i18n from "../../../locale/i18n";
import {useDispatch, useSelector} from "react-redux";
import {getOrderDetails, updateOrder} from '../../actions';
import Header from '../../common/Header';
import COLORS from "../../consts/colors";
import Communications from 'react-native-communications';
import {useIsFocused} from "@react-navigation/native";


function OrderDetails({navigation,route}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const orderDetails = useSelector(state => state.orders.orderDetails);
    const [screenLoader , setScreenLoader ] = useState(false);
    const [isUpdateSubmitted, setIsUpdateSubmitted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const id = route.params.id;

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    function fetchData(){
        setScreenLoader(true)
        dispatch(getOrderDetails(lang , id, token)).then(() => setScreenLoader(false))
    }

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused])

    const [showDetails, setShowDetails] = useState(false);
    const [showClientDetails, setShowClientDetails] = useState(false);


    function renderLoader(){
        if (screenLoader){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }


    function checkOrderStatus(orderStatus, currentStatus){
        if (currentStatus === 'PROGRESS'){
            if (orderStatus === 'PROGRESS'
                || orderStatus === 'READY'
                || orderStatus === 'DELEGATEACCEPT'
                || orderStatus === 'DELEGATEARRIVED'
                || orderStatus === 'DELIVEREDTODELEGATE'
                || orderStatus === 'ONWAY'
                || orderStatus === 'ARRIVED'
                || orderStatus === 'DELIVER'
                || orderStatus === 'DELIVERED' ){
                return true
            }
        }  else if(currentStatus === 'READY'){
            if (orderStatus === 'READY'
                || orderStatus === 'DELEGATEACCEPT'
                || orderStatus === 'DELEGATEARRIVED'
                || orderStatus === 'DELIVEREDTODELEGATE'
                || orderStatus === 'ONWAY'
                || orderStatus === 'ARRIVED'
                || orderStatus === 'DELIVER'
                || orderStatus === 'DELIVERED' ){
                return true
            }
        } else if(currentStatus === 'DELEGATEACCEPT'){
            if (orderStatus === 'DELEGATEACCEPT'
                || orderStatus === 'DELEGATEARRIVED'
                || orderStatus === 'DELIVEREDTODELEGATE'
                || orderStatus === 'ONWAY'
                || orderStatus === 'ARRIVED'
                || orderStatus === 'DELIVER'
                || orderStatus === 'DELIVERED' ){
                return true
            }
        } else if(currentStatus === 'DELEGATEARRIVED'){
            if (orderStatus === 'DELEGATEARRIVED'
                || orderStatus === 'DELIVEREDTODELEGATE'
                || orderStatus === 'ONWAY'
                || orderStatus === 'ARRIVED'
                || orderStatus === 'DELIVER'
                || orderStatus === 'DELIVERED' ){
                return true
            }
        }
    }


    function renderUpdateOrder(){
        if (isUpdateSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' }  ,  styles.marginTop_35 , styles.flexCenter , styles.Width_90]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' , marginBottom:20 }} />
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={onUpdate} style={[styles.mstrdaBtn , styles.marginVertical_35 , styles.flexCenter , styles.Width_90]}>
                <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('orderHasDelivered') }</Text>
            </TouchableOpacity>
        );

    }

    const onUpdate = () => {
        setIsUpdateSubmitted(true);
        dispatch(updateOrder(lang , id , token , navigation , 'DELEGATEACCEPT')).then(() => {dispatch(getOrderDetails(lang , id, token)) ; setIsUpdateSubmitted(false)});
    }


    function renderFinishOrder(){
        if (isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' }  ,  styles.marginTop_35, styles.marginBottom_10  , styles.flexCenter , styles.Width_90]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' , marginBottom:20 }} />
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={onFinish} style={[styles.mstrdaBtn , styles.marginTop_35 , styles.marginBottom_10 , styles.flexCenter , styles.Width_90]}>
                <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('finish') }</Text>
            </TouchableOpacity>
        );

    }

    const onFinish = () => {
        setIsSubmitted(true);
        dispatch(updateOrder(lang , id , token , navigation , 'DELEGATEARRIVED')).then(() => {setIsSubmitted(false)});
    }


    return (
        <Container style={[styles.bg_darkRed]}>
            <Content contentContainerStyle={[styles.bgFullWidth , styles.bg_darkRed]}>

                <Header navigation={navigation} title={ i18n.t('orderDetails') } />

                {
                    orderDetails ?
                        <View style={[styles.bgFullWidth ,styles.bg_White, styles.Width_100, {overflow:'hidden'}]}>

                            <View style={[styles.marginTop_10,styles.paddingHorizontal_20]}>
                            {
                                orderDetails.provider ?
                                        <View style={[styles.borderGray,styles.marginBottom_20 , styles.directionRow , styles.Radius_5 , styles.paddingVertical_10 , {flex:1}]}>
                                            <View style={[styles.directionRow , styles.paddingHorizontal_10 , {flex:1}]}>
                                                <Image source={{uri:orderDetails.provider.avatar}} style={[styles.icon70 , styles.Radius_7]} resizeMode={'cover'} />
                                                <View style={[styles.paddingHorizontal_10 , {flex:1}]}>
                                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_12 , styles.alignStart , styles.marginBottom_5 , {lineHeight:20}]}>{orderDetails.provider.name}</Text>
                                                    <View style={[styles.directionRow , styles.marginBottom_5 , {flex:1}]}>
                                                        <Icon type={'MaterialIcons'} name={'location-on'} style={[styles.textSize_12 , styles.text_darkRed , {marginRight:5}]} />
                                                        <Text style={[styles.textRegular , styles.text_midGray , styles.textSize_12 , styles.writingDir, {lineHeight:20}]}>{orderDetails.provider.address}</Text>
                                                    </View>
                                                    <Text style={[styles.textRegular , styles.text_midGray , styles.textSize_12 , styles.alignStart]}>{orderDetails.provider.phone}</Text>
                                                </View>
                                            </View>
                                            <View style={[{borderLeftWidth:1 , borderLeftColor:'#ddd'} , styles.heightFull , styles.paddingHorizontal_10 , styles.centerContext]}>
                                                <Text style={[styles.textRegular , styles.text_darkRed , styles.textSize_12 , styles.marginBottom_5]}>{i18n.t('orderNum') }</Text>
                                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_12]}>{id}</Text>
                                            </View>
                                        </View>
                                    :
                                    null
                            }
                            </View>


                            <View style={[styles.bg_light_gray ,styles.paddingHorizontal_20 ,  styles.directionRow  , styles.height_45]}>
                                <Text style={[styles.textBold , styles.text_darkRed , styles.textSize_14]}>{i18n.t('followOrder') }</Text>
                            </View>


                            <View style={[styles.marginTop_20,styles.paddingHorizontal_20 , styles.Width_100]}>
                                <View style={styles.followStep}>
                                    <View style={[styles.skyCircle ,
                                        {backgroundColor: checkOrderStatus(orderDetails.status, 'PROGRESS')  ? COLORS.darkRed : '#fff',
                                            borderColor:  checkOrderStatus(orderDetails.status, 'PROGRESS')  ? COLORS.darkRed : COLORS.gray}]}>
                                        <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                    </View>
                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14]}>{i18n.t('orderHasReceived')}</Text>
                                    <View style={[styles.stepLine ,
                                        {backgroundColor: checkOrderStatus(orderDetails.status, 'PROGRESS') ? COLORS.darkRed :COLORS.gray,}]}/>
                                </View>

                                <View style={[styles.followStep ]}>
                                    <View style={[styles.skyCircle ,
                                        {backgroundColor:checkOrderStatus(orderDetails.status, 'READY') ? COLORS.darkRed :'#fff',
                                            borderColor:checkOrderStatus(orderDetails.status, 'READY') ? COLORS.darkRed :COLORS.gray}]}>
                                        <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                    </View>
                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14]}>{i18n.t('prepCompleted')}</Text>
                                    <View style={[styles.stepLine ,
                                        {backgroundColor:checkOrderStatus(orderDetails.status, 'READY')? COLORS.darkRed :COLORS.gray,}]}/>
                                </View>

                                <View style={[styles.followStep ]}>
                                    <View style={[styles.skyCircle ,
                                        {backgroundColor:checkOrderStatus(orderDetails.status, 'DELEGATEACCEPT') ? COLORS.darkRed : '#fff',
                                            borderColor:checkOrderStatus(orderDetails.status, 'DELEGATEACCEPT')   ? COLORS.darkRed : COLORS.gray}]}>
                                        <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                    </View>
                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14]}>{i18n.t('orderDelegate')}</Text>
                                    <View style={[styles.stepLine ,
                                        {backgroundColor:checkOrderStatus(orderDetails.status, 'DELEGATEACCEPT') ? COLORS.darkRed :COLORS.gray,}]}/>
                                </View>

                                <View style={[styles.followStep ]}>
                                    <View style={[styles.skyCircle ,
                                        {backgroundColor:checkOrderStatus(orderDetails.status, 'DELEGATEARRIVED')? COLORS.darkRed : '#fff',
                                            borderColor:checkOrderStatus(orderDetails.status, 'DELEGATEARRIVED')? COLORS.darkRed : COLORS.gray}]}>
                                        <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                    </View>
                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14]}>{i18n.t('orderSentToClient')}</Text>
                                </View>
                            </View>


                            <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={[styles.marginTop_20 , styles.bg_light_gray , styles.directionRowSpace ,styles.paddingHorizontal_20 , styles.height_45]}>
                                <Text style={[styles.textBold , showDetails ? styles.text_darkRed : styles.text_gray , styles.textSize_14 ]}>{i18n.t('orderDetails') }</Text>
                                <Icon type={'AntDesign'} name={showDetails ?  'caretup' : 'caretdown'} style={[styles.textSize_12 , showDetails ? styles.text_darkRed : styles.text_gray]} />
                            </TouchableOpacity>

                            {
                                showDetails?
                                    <View style={[styles.marginTop_5]}>

                                        {
                                            orderDetails.type === 'special' && orderDetails.special_details ?
                                                <Text style={[styles.textRegular , styles.text_midGray , styles.paddingHorizontal_20 , styles.textSize_13 , styles.marginTop_15 , styles.alignStart , styles.writingDir , {lineHeight:24}]}>
                                                    {orderDetails.special_details.details}
                                                </Text>
                                                :
                                                orderDetails.products ?
                                                    orderDetails.products.map((pro, i) => {
                                                        return (
                                                            <View key={i} style={[styles.borderGray ,styles.paddingHorizontal_20 , styles.paddingVertical_10 , styles.marginBottom_5 , styles.directionRowSpace]}>
                                                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13 , styles.writingDir , {flex:1}]}>{pro.name}</Text>
                                                                <View style={{borderLeftWidth:1 , borderColor:'#ddd' , paddingLeft:10 , marginLeft:10 }}>
                                                                    <Text style={[styles.textRegular , styles.text_darkRed , styles.textSize_13]}>{pro.price} {i18n.t('RS') }</Text>
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                    :
                                                    null
                                        }

                                        <View style={[styles.marginTop_20 , styles.bg_light_gray ,styles.paddingHorizontal_20 , styles.directionRow  , styles.height_45]}>
                                            <Text style={[styles.textBold , styles.text_gray , styles.textSize_14]}>{i18n.t('payMethod') }</Text>
                                        </View>
                                        <Text style={[styles.textRegular,styles.paddingHorizontal_20 , styles.marginVertical_15 , styles.text_gray , styles.textSize_14 ,styles.alignStart]}>{orderDetails.payment_text}</Text>

                                        <View style={[ styles.bg_light_gray ,styles.paddingHorizontal_20 , styles.directionRow  , styles.height_45]}>
                                            <Text style={[styles.textBold , styles.text_gray , styles.textSize_14]}>{i18n.t('deliverWay') }</Text>
                                        </View>
                                        <Text style={[styles.textRegular,styles.paddingHorizontal_20 , styles.marginVertical_15 , styles.text_gray , styles.textSize_14 ,styles.alignStart]}>{orderDetails.way_to_deliver_text}</Text>

                                        {
                                            orderDetails.friend_name ?
                                                <>
                                                    <View style={[ styles.bg_light_gray ,styles.paddingHorizontal_20 , styles.directionRow  , styles.height_45]}>
                                                        <Text style={[styles.textBold , styles.text_gray , styles.textSize_14]}>{i18n.t('friendName') }</Text>
                                                    </View>
                                                    <Text style={[styles.textRegular,styles.paddingHorizontal_20 , styles.marginVertical_15 , styles.text_gray , styles.textSize_14 ,styles.alignStart]}>{orderDetails.friend_name}</Text>
                                                </>
                                                :
                                                null
                                        }

                                        {
                                            orderDetails.friend_phone ?
                                                <>
                                                    <View style={[ styles.bg_light_gray ,styles.paddingHorizontal_20 , styles.directionRow  , styles.height_45]}>
                                                        <Text style={[styles.textBold , styles.text_gray , styles.textSize_14]}>{i18n.t('friendPhone') }</Text>
                                                    </View>
                                                    <Text style={[styles.textRegular,styles.paddingHorizontal_20 , styles.marginVertical_15 , styles.text_gray , styles.textSize_14 ,styles.alignStart]}>{orderDetails.friend_phone}</Text>
                                                </>
                                                :
                                                null
                                        }

                                        <View style={[styles.bg_light_gray ,styles.paddingHorizontal_20 ,  styles.directionRow  , styles.height_45]}>
                                            <Text style={[styles.textBold , styles.text_gray , styles.textSize_14]}>{i18n.t('deliveryDetails') }</Text>
                                        </View>
                                        <Text style={[styles.textRegular,styles.paddingHorizontal_20 , styles.marginVertical_15 , styles.text_gray , styles.textSize_14 , styles.alignStart]}>{i18n.t('orderLocation') }</Text>

                                        {
                                            orderDetails.address ?
                                                <View style={[styles.directionRow,styles.paddingHorizontal_20 , styles.marginBottom_25 , {flexWrap:'wrap'}]}>
                                                    <Icon type={'MaterialIcons'} name={'location-on'} style={[styles.textSize_14 , styles.text_darkRed , {marginRight:5}]} />
                                                    <Text style={[styles.textRegular , styles.text_midGray , styles.textSize_13]}>{orderDetails.address.address_from}</Text>
                                                    <TouchableOpacity onPress={() =>  navigation.navigate('getLocation' , {pathName:'orderDetails' , latitude:orderDetails.address.latitude_from , longitude : orderDetails.address.longitude_from})} style={{marginLeft:5}}>
                                                        <Text style={[styles.textRegular , styles.text_darkRed , styles.textSize_13]}>( { i18n.t('seeLocation') } )</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                null
                                        }



                                        <Text style={[styles.textRegular,styles.paddingHorizontal_20 , styles.marginBottom_15 , styles.text_gray , styles.textSize_14 , styles.alignStart]}>{i18n.t('desiredPlace') }</Text>

                                        {
                                            orderDetails.address ?
                                                <View style={[styles.directionRow,styles.paddingHorizontal_20 , styles.marginBottom_25 , {flexWrap:'wrap'}]}>
                                                    <Icon type={'MaterialIcons'} name={'location-on'} style={[styles.textSize_14 , styles.text_darkRed , {marginRight:5}]} />
                                                    <Text style={[styles.textRegular , styles.text_midGray , styles.textSize_13]}>{orderDetails.address.address_to}</Text>
                                                    <TouchableOpacity onPress={() =>  navigation.navigate('getLocation' , {pathName:'orderDetails' , latitude:orderDetails.address.latitude_to , longitude : orderDetails.address.longitude_to})} style={{marginLeft:5}}>
                                                        <Text style={[styles.textRegular , styles.text_darkRed , styles.textSize_13]}>( { i18n.t('seeLocation') } )</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                null
                                        }

                                    </View>
                                    :
                                    null
                            }


                            <TouchableOpacity onPress={() => setShowClientDetails(!showClientDetails)} style={[styles.marginTop_20 , styles.bg_light_gray , styles.directionRowSpace ,styles.paddingHorizontal_20 , styles.height_45]}>
                                <Text style={[styles.textBold , showClientDetails ? styles.text_darkRed : styles.text_gray , styles.textSize_14 ]}>{i18n.t('clientInfo') }</Text>
                                <Icon type={'AntDesign'} name={showClientDetails ?  'caretup' : 'caretdown'} style={[styles.textSize_12 , showClientDetails ? styles.text_darkRed : styles.text_gray]} />
                            </TouchableOpacity>

                            {
                                showClientDetails && orderDetails.user?
                                    <View style={[styles.marginTop_5 ,styles.marginBottom_25]}>

                                        <Text style={[styles.textRegular,styles.paddingHorizontal_20 , styles.marginVertical_15 , styles.text_gray , styles.textSize_14 ,styles.alignStart]}>{i18n.t('clientName') }</Text>

                                        <View style={[styles.marginTop_5 ,styles.flexCenter , styles.bg_light_gray , styles.Width_90 ,styles.paddingHorizontal_20 , styles.directionRowSpace  , styles.height_45]}>
                                            <Text style={[styles.textRegular , styles.text_gray , styles.textSize_12]}>{orderDetails.user.name}</Text>
                                            <TouchableOpacity onPress={() => Communications.phonecall(orderDetails.user.phone, true)}>
                                                <Image source={require("../../../assets/images/phone-ringing.png")} style={[styles.icon17]} resizeMode={'contain'} />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    :
                                    null
                            }


                            {
                                orderDetails.status === 'DELEGATEACCEPT' ?
                                    renderUpdateOrder()
                                    :
                                    orderDetails.status === 'DELEGATEARRIVED' ?
                                        <View style={[styles.Width_100]}>
                                            {renderFinishOrder()}

                                            <TouchableOpacity onPress={() => navigation.navigate('home')} style={[styles.mstrdaBtn , styles.bg_gray , styles.marginBottom_35 , styles.flexCenter , styles.Width_90]}>
                                                <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('home') }</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        null
                            }

                        </View>
                        :
                        null
                }


            </Content>


        </Container>
    );
}

export default OrderDetails;


