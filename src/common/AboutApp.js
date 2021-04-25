import React, {useEffect, useRef, useState} from "react";
import {View, Text, Image, ActivityIndicator, Dimensions, FlatList, I18nManager} from "react-native";
import {Container, Content, Icon, Input} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import Header from './Header';
import COLORS from "../consts/colors";
import {useSelector, useDispatch} from 'react-redux';
import {getAbout} from '../actions';

const height = Dimensions.get('window').height;
const isIOS = Platform.OS === 'ios';

function AboutApp({navigation,route}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const about = useSelector(state => state.about.about)
    const loader = useSelector(state => state.about.loader)

    const dispatch = useDispatch()

    function fetchData(){
        dispatch(getAbout(lang))
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


    return (
        <Container style={[styles.bg_darkRed]}>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.bg_darkRed]}>

                <Header navigation={navigation} title={ i18n.t('aboutApp') } />

                <View style={[styles.bgFullWidth ,styles.bg_White, styles.Width_100,styles.paddingHorizontal_20, {overflow:'hidden'}]}>

                    <Image source={require('../../assets/images/logo.png')} style={[styles.icon80 ,styles.SelfCenter , styles.marginVertical_25 ]} resizeMode={'contain'} />

                    {
                        about ?
                            <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14 ,styles.SelfCenter , styles.textCenter , styles.marginBottom_25 , {lineHeight:24}]}>
                                {about.page}
                            </Text>
                            :
                            null
                    }

                </View>

            </Content>
        </Container>
    );
}

export default AboutApp;


