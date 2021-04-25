import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    I18nManager,
    KeyboardAvoidingView
} from "react-native";
import {Container, Content, Form, Icon, Input, Item} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import Header from './Header';
import COLORS from "../consts/colors";
import {useSelector, useDispatch} from 'react-redux';
import {getWallet, sendTrans, withdraw} from '../actions';

const height = Dimensions.get('window').height;
const isIOS = Platform.OS === 'ios';

function TransferToFriend({navigation,route}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const wallet = useSelector(state => state.wallet.wallet)
    const loader = useSelector(state => state.wallet.loader)
    const user = useSelector(state =>  state.auth.user != null ? state.auth.user.data : null );
    const [phone, setPhone] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const dispatch = useDispatch()

    function fetchData(){
        dispatch(getWallet(lang , token))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation , loader]);

    function renderLoader(){
        if (loader === false){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }


    function renderSubmit() {

        if (isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginTop_40, styles.marginBottom_20]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        if (phone == '' || transferAmount == '' ) {
            return (
                <View
                    style={[styles.mstrdaBtn , styles.Width_100  , styles.marginBottom_20 , styles.marginTop_40 , styles.Radius_5 , {
                        backgroundColor:'#ddd'
                    }]}
                >
                    <Text style={[styles.textBold , styles.text_gray , styles.textSize_14]}>{ i18n.t('send') }</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => onConfirm()} style={[styles.mstrdaBtn , styles.Width_100 , styles.marginBottom_20 , styles.marginTop_40 , styles.Radius_5 ]}>
                <Text style={[styles.textBold , styles.text_White , styles.textSize_14]}>{ i18n.t('send') }</Text>
            </TouchableOpacity>
        );
    }

    function onConfirm() {
        setIsSubmitted(true);
        navigation.navigate('balanceSentSuccessfully')
        // dispatch(withdraw(lang , accNum , bankName , accHolderName , amountToBeCharged , token, navigation)).then(() => {setIsSubmitted(false)});
    }


    return (
        <Container style={[styles.bg_darkRed]}>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.bg_darkRed]}>

                <Header navigation={navigation} title={ i18n.t('balanceTransfer') } />

                <View style={[styles.bgFullWidth ,styles.bg_White, styles.Width_100,styles.paddingHorizontal_20 , styles.alignCenter, {overflow:'hidden'}]}>

                    <Image source={require("../../assets/images/money_give.png")} style={[styles.icon100 , styles.marginVertical_45]} resizeMode={'contain'}/>

                    <Text style={[styles.textBold , styles.text_darkRed , styles.textSize_22, styles.textCenter ]}>{ i18n.t('currentBalance') }</Text>

                    {
                        wallet ?
                            <View style={[styles.width_180 , styles.height_100 , styles.bg_light_gray , styles.marginTop_55 , styles.Radius_15 , styles.centerContext]}>
                                <Text style={[styles.textBold , styles.text_darkRed , styles.textSize_24, styles.textCenter ]}>{wallet.amount} { i18n.t('RS') }</Text>
                            </View>
                            :
                            null
                    }

                    <KeyboardAvoidingView style={[styles.Width_100 , styles.marginTop_20 , styles.marginBottom_10]}>
                        <Form style={[styles.Width_100 , styles.flexCenter]}>
                            <Item style={[styles.item , {marginBottom:0}]}>
                                <Input style={[styles.input  , { borderTopLeftRadius:20 ,borderTopRightRadius:20 ,
                                    borderColor:phone ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:phone ? '#fff' : '#eee'}]}
                                       placeholder={ i18n.t('phone') }
                                       placeholderTextColor={COLORS.midGray}
                                       onChangeText={(phone) => setPhone(phone)}
                                       value={phone}
                                       keyboardType={'number-pad'}
                                />
                            </Item>

                            <Item style={[styles.item , {marginBottom:0}]}>
                                <Input style={[styles.input  , {borderTopLeftRadius:20 ,borderTopRightRadius:20 ,
                                    borderColor:transferAmount ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:transferAmount ? '#fff' : '#eee'}]}
                                       placeholder={ i18n.t('transferAmount') }
                                       placeholderTextColor={COLORS.midGray}
                                       onChangeText={(transferAmount) => setTransferAmount(transferAmount)}
                                       value={transferAmount}
                                       keyboardType={'number-pad'}
                                />
                            </Item>

                            {renderSubmit()}

                        </Form>
                    </KeyboardAvoidingView>

                </View>

            </Content>
        </Container>
    );
}

export default TransferToFriend;


