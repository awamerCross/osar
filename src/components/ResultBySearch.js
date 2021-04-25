import React, {useEffect, useRef, useState} from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, I18nManager, FlatList} from "react-native";
import {Container, Content, Icon, Input} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import {useDispatch, useSelector} from "react-redux";
import {getProviders} from '../actions';
import Header from '../common/Header';
import COLORS from "../consts/colors";
import {useIsFocused} from "@react-navigation/native";
import StarRating from "react-native-star-rating";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import axios from "axios";
import MapView from 'react-native-maps';

const height = Dimensions.get('window').height;
const isIOS = Platform.OS === 'ios';
const latitudeDelta = 0.922;
const longitudeDelta = 0.521;

function ResultBySearch({navigation,route}) {

    const homeSearch = route.params.search;
    const [search, setSearch] = useState('');
    const [popInfo, setPopInfo] = useState(null);
    const [showAd, setShowAd] = useState(false);
    const [searchList, setSearchList] = useState('');
    const [active, setActive] = useState(0);
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const providers = useSelector(state => state.categories.providers);
    const [screenLoader , setScreenLoader ] = useState(true);
    let mapRef = useRef(null);

    const homeAds = [
        {id:'0' ,
            coordinates : {latitude: 31.2587 , longitude:32.2988} , price:'200',
            image :require('../../assets/images/provider.png') ,
            name:'مطعم',
            location:'السعوديةالرياض',
            rate:4,
            type:'original'
        },
        {id:'1' ,
            coordinates : {latitude: 33.2587 , longitude:32.2988} , price:'240',
            image :require('../../assets/images/provider.png') ,
            name:'مطعمll',
            location:'السعوديةالرياض',
            rate:4,
            type:'original'
        },
    ]

    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const [city, setCity] = useState('');

    const [mapRegion, setMapRegion] = useState({
        latitude: 31.2587 ,
        longitude:32.2988,
        latitudeDelta ,
        longitudeDelta
    });

    const [initMap, setInitMap] = useState(true);

    const fetchData = async () => {

        setActive(0);
        setShowAd(false);
        setScreenLoader(true)
        dispatch(getProviders(lang , null, false , null , null , homeSearch)).then(() => setScreenLoader(false));

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        let userLocation = {};
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            if (route.params && route.params.latitude){
                userLocation = { latitude: route.params.latitude, longitude:route.params.longitude , latitudeDelta , longitudeDelta};
                // dispatch(getHomeAds(lang , route.params.latitude ,route.params.longitude  , null , token))
                dispatch(getProviders(lang , null, false ,  route.params.latitude ,route.params.longitude , homeSearch)).then(() => setScreenLoader(false));

            } else {
                userLocation = { latitude, longitude , latitudeDelta  , longitudeDelta};
                dispatch(getProviders(lang , null, false , latitude ,longitude , homeSearch)).then(() => setScreenLoader(false));

            }
            setInitMap(false);
            setMapRegion(userLocation);
            isIOS ? mapRef.current.animateToRegion(userLocation, 1000) : false;
        }
        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity    += userLocation.latitude + ',' + userLocation.longitude;
        getCity    += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';
        console.log("getCity  " , getCity)
        // ReactotronConfig.log(getCity);
        try {
            const { data } = await axios.get(getCity);
            setCity(data.results[0].formatted_address)
        } catch (e) {
            console.log(e);
        }
    };

    const onSearchFilter = (keyword) => {
        setScreenLoader(true);
        setSearchList(keyword);
        if (keyword) {
            dispatch(getProviders(lang , null, false , null , null , keyword)).then(() => setScreenLoader(false));
        }else{
            dispatch(getProviders(lang , null, false , null , null , null)).then(() => setScreenLoader(false));
        }
    }

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused])

    const setSearchStatus = (value) => {
        setActive(value)
        setScreenLoader(true)
        // if(value === 0 ){
        //     dispatch(getProviders(lang , null, false , null , null , null)).then(() => setScreenLoader(false));
        // }else{
        //     dispatch(getProviders(lang , null, false , null , null , null)).then(() => setScreenLoader(false));
        // }
        dispatch(getProviders(lang , null, false , null , null , null)).then(() => setScreenLoader(false));
    }

    function showAdPop(markerInfo) {
        setShowAd(true)
        setPopInfo(markerInfo)
    }

    const setSearchText = (keyword) => {
        setSearch(keyword);
        if(keyword)
            dispatch(getProviders(lang , null, false ,  mapRegion.latitude ,mapRegion.longitude , keyword)).then(() => setScreenLoader(false));
        else
            dispatch(getProviders(lang , null, false ,  mapRegion.latitude ,mapRegion.longitude , null)).then(() => setScreenLoader(false));
    }

    async function getCurrentLocation() {
        let { status } = await Location.requestPermissionsAsync();

        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        } else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            let userLocation = { latitude, longitude, latitudeDelta, longitudeDelta };
            setMapRegion(userLocation);
            mapRef.current.animateToRegion(userLocation, 500)
        }
    }

    function Item({ name , image , location , rate , type , id , index }) {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('categoryDetails', {id , type})} style={[styles.borderGray,styles.marginBottom_20 , styles.directionRow , styles.Radius_5 , {flex:1 , padding:10}]}>
                <Image source={{uri:image}} style={[styles.icon50 , styles.Radius_7]} resizeMode={'cover'} />
                <View style={[{marginLeft:15 , flex:1}]}>
                    <View style={styles.directionRowSpace}>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_12]}>{ name.substr(0,20) }</Text>
                        <View style={[styles.directionRow]}>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                rating={rate}
                                fullStarColor={'#fec104'}
                                starSize={10}
                                starStyle={{ marginHorizontal: 2 }}
                            />
                        </View>
                    </View>
                    <View style={[styles.directionRow , styles.marginTop_5]}>
                        <Icon type={'MaterialIcons'} name={'location-on'} style={[styles.textSize_13 , styles.text_darkRed , {marginRight:5}]} />
                        <Text style={[styles.textRegular , styles.text_midGray , styles.textSize_12, {lineHeight:20}]}>{ location }</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
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
        if (providers && (providers).length <= 0) {
            return (
                <View style={[styles.directionColumnCenter , styles.Width_100,{height:height-200}]}>
                    <Image source={require('../../assets/images/note.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return null
    }


    return (
        <Container style={[styles.bg_darkRed]}>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.bg_darkRed]}>

                <Header navigation={navigation} title={ i18n.t('search') } />

                <View style={[styles.bgFullWidth ,styles.bg_White, styles.Width_100, {overflow:'hidden'}]}>

                    <View style={[styles.directionRowSpace , {borderBottomWidth:1 , borderBottomColor:'#ddd'}]}>
                        <TouchableOpacity onPress={() => setSearchStatus(0)} style={[styles.paddingVertical_15 , styles.paddingHorizontal_15 , {borderBottomWidth:2 , borderBottomColor:active === 0 ? COLORS.darkRed : 'transparent' , flex:1}]}>
                            <Text style={[styles.textBold , styles.text_gray , styles.textCenter , styles.textSize_13]}>{ i18n.t('searchByList') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSearchStatus(1)} style={[styles.paddingVertical_15 , styles.paddingHorizontal_15 , {borderBottomWidth:2 , borderBottomColor:active === 1 ? COLORS.darkRed : 'transparent' , flex:1}]}>
                            <Text style={[styles.textBold , styles.text_gray , styles.textCenter , styles.textSize_13]}>{ i18n.t('searchByMap') }</Text>
                        </TouchableOpacity>
                    </View>

                        {
                            active === 0 ?
                                    <View style={[styles.paddingHorizontal_20,styles.marginTop_20 , styles.marginBottom_60]}>

                                        <View style={[styles.Width_100,styles.SelfCenter , styles.marginBottom_20 , styles.marginTop_5 , {zIndex:-1}]}>
                                            <Input style={[styles.inputSearch , styles.Width_100 , {flex:0 , color: COLORS.midGray , backgroundColor: '#f0f0f0' , paddingRight:40}]}
                                                   placeholder={i18n.t('search')}
                                                   placeholderTextColor={COLORS.midGray}
                                                   onChangeText={(searchList) => onSearchFilter(searchList)}
                                                   value={searchList}
                                            />

                                            <Image source={require("../../assets/images/search.png")} style={[styles.icon17, {position:'absolute' , right:15 , top:13}]} resizeMode={'cover'} />

                                        </View>
                                        {
                                            providers && (providers).length > 0?
                                                <FlatList
                                                    data={providers}
                                                    horizontal={false}
                                                    showsVerticalScrollIndicator={false}
                                                    renderItem={({ item , index}) => <Item
                                                        id={item.id}
                                                        name={item.name}
                                                        image={item.avatar}
                                                        location={item.address}
                                                        rate={item.rate}
                                                        type={item.type}
                                                        index={index}
                                                    />}
                                                    keyExtractor={item => item.id}
                                                />
                                                :
                                                renderNoData()
                                        }

                                    </View>
                                :
                                <View style={[styles.bgFullWidth ,styles.bg_White,
                                    styles.Width_100, {overflow:'hidden' , height:height-200}]}>
                                    <View style={[styles.Width_90,styles.SelfCenter , styles.marginBottom_20 , styles.marginTop_5 , {position:'absolute' , top:10,zIndex:1}]}>
                                        <Input style={[styles.inputSearch , styles.Width_100 , styles.Radius_5 , styles.boxShadow , {flex:0 , color: COLORS.midGray , paddingRight:20 , backgroundColor: '#fff'}]}
                                               placeholder={i18n.t('search')}
                                               placeholderTextColor={COLORS.midGray}
                                               onChangeText={(search) => setSearchText(search)}
                                               value={search}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => getCurrentLocation()}
                                                      style={[styles.flexCenter,styles.Radius_5, styles.icon40, styles.bg_gray ,
                                                          { padding: 10 , position:'absolute' , bottom:20 , left:15 , zIndex:1}]}>
                                        <Icon type='Ionicons' name='locate' style={{ color: '#fff', fontSize: 22 }} />
                                    </TouchableOpacity>

                                    {
                                        !initMap && mapRegion.latitude != null? (
                                            <MapView
                                                ref={mapRef}
                                                style={{ width: '100%', height: '100%' , flex:1 }}
                                                // onRegionChange={() => mapMarkerRef.current.showCallout()}
                                                initialRegion={mapRegion}>
                                                <MapView.Marker
                                                    coordinate={mapRegion}
                                                    // title={city}
                                                    // description={'my location'}
                                                >
                                                    <Image source={require('../../assets/images/blue_circle.png')} resizeMode={'contain'} style={[styles.icon35]}/>

                                                </MapView.Marker>


                                                {
                                                    providers ?
                                                        providers.map((marker,i) => (
                                                            <MapView.Marker
                                                                // ref={mapMarkerRef}
                                                                key={marker.id}
                                                                coordinate={marker.coordinates}
                                                                // title={marker.title}
                                                                onPress={() => showAdPop(marker)}
                                                            >
                                                                <Image source={require('../../assets/images/red_location.png')} resizeMode={'contain'} style={[styles.icon20]}/>
                                                                {/*<MapView.Callout tooltip={true} style={[styles.flexCenter]} >*/}
                                                                {/*    <View style={[styles.Radius_15,styles.flexCenter ,styles.bg_gray ,styles.paddingVertical_5 , styles.paddingHorizontal_5,{minWidth:80}]}>*/}
                                                                {/*        <Text style={[styles.textRegular , styles.text_White , styles.textSize_11]}>{marker.price}</Text>*/}
                                                                {/*    </View>*/}
                                                                {/*    <View style={[styles.talkBubbleTriangle]}/>*/}
                                                                {/*</MapView.Callout>*/}
                                                            </MapView.Marker>
                                                        ))
                                                        :
                                                        null
                                                }

                                            </MapView>
                                        ) : (<View />)
                                    }

                                    {
                                        showAd && popInfo?
                                            <View style={[styles.paddingHorizontal_15, styles.Width_100 , {position:'absolute' , bottom:45 , zIndex:1}]}>
                                                <TouchableOpacity onPress={() => setShowAd(false)} style={[styles.bg_gray,styles.centerContext , styles.Radius_50,styles.alignEnd,styles.icon25]}>
                                                    <Image source={require("../../assets/images/cancel.png")} style={[styles.icon10]} resizeMode={'contain'} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => navigation.navigate('categoryDetails', {id:popInfo.id , type:popInfo.type})} style={[styles.borderGray,styles.marginBottom_20 , styles.directionRow, styles.bg_White , styles.Radius_5 , {flex:1 , padding:10}]}>
                                                    <Image source={{uri:popInfo.avatar}}  style={[styles.icon50 , styles.Radius_7]} resizeMode={'cover'} />
                                                    <View style={[{marginLeft:15 , flex:1}]}>
                                                        <View style={styles.directionRowSpace}>
                                                            <Text style={[styles.textRegular , styles.text_gray , styles.textSize_12]}>{ popInfo.name.substr(0,20) }</Text>
                                                            <View style={[styles.directionRow]}>
                                                                <StarRating
                                                                    disabled={false}
                                                                    maxStars={5}
                                                                    rating={popInfo.rate}
                                                                    fullStarColor={'#fec104'}
                                                                    starSize={10}
                                                                    starStyle={{ marginHorizontal: 2 }}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View style={[styles.directionRow , styles.marginTop_5 , {flex:1}]}>
                                                            <Icon type={'MaterialIcons'} name={'location-on'} style={[styles.textSize_13 , styles.text_darkRed , {marginRight:5}]} />
                                                            <Text style={[styles.textRegular , styles.text_midGray , styles.textSize_12, {lineHeight:20 , flex:1}]}>{ popInfo.address }</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={[styles.talkTriangle]}/>

                                            </View>
                                            :
                                            null
                                    }
                                </View>
                        }

                </View>

            </Content>
        </Container>
    );
}

export default ResultBySearch;


