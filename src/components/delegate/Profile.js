import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView, ActivityIndicator,FlatList
} from "react-native";
import {Container, Content, Form, Icon, Input, Item, Label , Toast} from 'native-base'
import styles from '../../../assets/styles'
import i18n from "../../../locale/i18n";
import Header from '../../common/Header';
import COLORS from "../../consts/colors";
import  Modal  from "react-native-modal";
import {useSelector, useDispatch} from "react-redux";
import {profile, changePass, updateProfile, getProviders} from "../../actions";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import StarRating from "react-native-star-rating";

const height = Dimensions.get('window').height;
const isIOS = Platform.OS === 'ios';

function Profile({navigation,route}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const user = useSelector(state =>  state.auth.user ? state.auth.user.data : {});
    const [active, setActive] = useState(0);

    const userData = useSelector(state => state.profile.user);
    const userDataLoader = useSelector(state => state.profile.loader);
    const [screenLoader , setScreenLoader ] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [base64, setBase64] = useState(null);
    const [userImage, setUserImage] = useState("");

    const [username, setUsername] = useState(user.name);
    const [editName, setEditName] = useState(false);

    const [phone, setPhone] = useState(user.phone);
    const [editPhone, setEditPhone] = useState(false);

    const [mail, setMail] = useState(user.email);
    const [editMail, setEditMail] = useState(false);

    const [idNum, setIdNum] = useState('');

    const [manufacturingYear, setManufacturingYear] = useState('');

    const [carType, setCarType] = useState('');

    const [carNumber, setCarNumber] = useState('');

    const [carChars, setCarChars] = useState('');

    const [area, setArea] = useState('');

    const [city, setCity] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [attachShowModal, setAttachShowModal] = useState(false);


    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [newpass, setNewpass] = useState('');
    const [showNewPass, setShowNewPass] = useState(false);
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [showConPass, setShowConPass] = useState(false);

    const comments = [
        {id:'0' , image :require('../../../assets/images/provider.png') , name : 'اماني قاسم' , rate:3 , desc:'وصف وصف وصف وصف وصف وصف'},
        {id:'1' , image :require('../../../assets/images/provider.png') , name : 'اماني قاسم' , rate:4 , desc:'وصف وصف وصف وصف وصف وصف'},
    ]

    const dispatch = useDispatch();

    function fetchData(){
        setActive(0);
        setScreenLoader(true);
        dispatch(profile(lang, token)).then(() => {setScreenLoader(false)});
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation , userDataLoader]);

    useEffect(() => {
        setScreenLoader(false)
    }, [userData]);

    const setActiveStatus = (value) => {
        setActive(value)
        setScreenLoader(true)
        if(value === 0 ){
            dispatch(profile(lang, token)).then(() => {setScreenLoader(false)});
        }else{
            setScreenLoader(false)
        }
    }


    function toggleModal () {
        setShowModal(!showModal);
    };

    function renderLoader(){
        if (screenLoader){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }


    const askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    const _pickImage = async () => {

        askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true
        });

        if (!result.cancelled) {
            setUserImage(result.uri);
            setBase64(result.base64);
        }
    };


    function attachToggleModal () {
        setAttachShowModal(!attachShowModal);
    };


    function renderSubmit() {
        if (phone == '' || username == '' || mail == '') {
            return (
                <View
                    style={[styles.mstrdaBtn , styles.Width_100  , styles.marginBottom_20 , {
                        backgroundColor:'#ddd'
                    }]}
                >
                    <Text style={[styles.textBold , styles.text_gray , styles.textSize_15]}>{ i18n.t('editProfile') }</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => onConfirm()} style={[styles.mstrdaBtn , styles.Width_100 , styles.marginBottom_20 ]}>
                <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('editProfile') }</Text>
            </TouchableOpacity>
        );
    }

    function onConfirm() {
        setScreenLoader(true);
        dispatch(updateProfile(lang , username , phone ,mail , base64 , token)).then(() => {setScreenLoader(false) ; setUserImage(null)});
    }

    function renderSubmitPass() {

        if (isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginTop_10, styles.marginBottom_10]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        if (password == '' || newpass == '' || confirmNewPass == '') {
            return (
                <View
                    style={[styles.mstrdaBtn , styles.Width_100  , styles.marginTop_10 , styles.marginBottom_10 , {
                        backgroundColor:'#ddd'
                    }]}
                >
                    <Text style={[styles.textBold , styles.text_gray , styles.textSize_15]}>{ i18n.t('confirm') }</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => onConfirmPass()} style={[styles.mstrdaBtn , styles.Width_100 , styles.marginTop_10 , styles.marginBottom_10 ]}>
                <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('confirm') }</Text>
            </TouchableOpacity>
        );
    }

    function onConfirmPass() {

        if (newpass.length < 6){
            Toast.show({
                text        : i18n.t('passreq'),
                type        : "danger",
                duration    : 3000,
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'flatRegular',
                    textAlign   : 'center'
                }
            });
            return false
        }else if(newpass !== confirmNewPass){
            Toast.show({
                text        : i18n.t('passError'),
                type        : "danger",
                duration    : 3000,
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'flatRegular',
                    textAlign   : 'center'
                }
            });
            return false
        } else {
            setIsSubmitted(true);
            dispatch(changePass(lang , password , newpass , token)).then(() => {setIsSubmitted(false) ; setShowModal(false)});
        }

    }


    function CommentItem({ name , image , desc , rate , id , index }) {
        return (
            <View style={[styles.directionRow , styles.Radius_5 , styles.paddingVertical_20 , {flex:1 , borderBottomWidth:1 , borderColor:'#ddd'}]}>
                <View style={[styles.icon40 , styles.Radius_50 , styles.borderGray , styles.marginBottom_7 ,{ padding: 3 }]}>
                    <Image source={image} style={[styles.Width_100 , styles.heightFull , styles.Radius_50]} resizeMode={'cover'} />
                </View>
                <View style={[{marginLeft:15 , flex:1}]}>
                    <View style={styles.directionRowSpace}>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_12]}>{ name.substr(0,20) }</Text>
                        <View style={[styles.directionRow , {flex:1 , marginLeft:30}]}>
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
                    <Text style={[styles.textRegular , styles.text_midGray , styles.marginTop_5, styles.textSize_12 , styles.writingDir, {lineHeight:20}]}>{ desc }</Text>
                </View>
            </View>
        );
    }

    // function renderNoData() {
    //     if (providers && (providers).length <= 0) {
    //         return (
    //             <View style={[styles.directionColumnCenter , styles.Width_100,{height:height-200}]}>
    //                 <Image source={require('../../assets/images/note.png')} resizeMode={'contain'}
    //                        style={{alignSelf: 'center', width: 200, height: 200}}/>
    //             </View>
    //         );
    //     }
    //
    //     return null
    // }


    return (
        <Container style={[styles.bg_darkRed]}>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.bg_darkRed]}>

                <Header navigation={navigation} title={ i18n.t('profile') } />
                <View style={[styles.bgFullWidth ,styles.bg_White, styles.Width_100, {overflow:'hidden' , paddingBottom:70}]}>

                    <View style={[styles.directionRowSpace , {borderBottomWidth:1 , borderBottomColor:'#ddd'}]}>
                        <TouchableOpacity onPress={() => setActiveStatus(0)} style={[styles.paddingVertical_15 , styles.paddingHorizontal_15 , {borderBottomWidth:2 , borderBottomColor:active === 0 ? COLORS.darkRed : 'transparent' , flex:1}]}>
                            <Text style={[styles.textBold , styles.text_gray , styles.textCenter , styles.textSize_13]}>{ i18n.t('profile') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveStatus(1)} style={[styles.paddingVertical_15 , styles.paddingHorizontal_15 , {borderBottomWidth:2 , borderBottomColor:active === 1 ? COLORS.darkRed : 'transparent' , flex:1}]}>
                            <Text style={[styles.textBold , styles.text_gray , styles.textCenter , styles.textSize_13]}>{ i18n.t('clientsComments') }</Text>
                        </TouchableOpacity>
                    </View>


                    {
                        active === 0 ?
                            userData ?
                                <View style={[styles.Width_100 , styles.paddingHorizontal_20]}>

                                    <View style={[styles.directionColumnCenter , styles.marginTop_35]}>
                                        <View style={[styles.icon70 , styles.Radius_50 , styles.borderGray , styles.marginBottom_7 ,{ padding: 7 }]}>
                                            <Image source= {userImage? {uri:userImage} : {uri:userData.avatar}} style={[styles.Width_100 , styles.heightFull , styles.Radius_50]} resizeMode='cover' />
                                            <TouchableOpacity onPress={_pickImage} style={{position:'absolute' , bottom:0 , zIndex:1 , right:0}}>
                                                <Image source={require('../../../assets/images/camera.png')} style={[styles.icon25]} resizeMode='contain' />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={[styles.textRegular , styles.text_darkRed , styles.textSize_15 , styles.marginBottom_5]}>{username}</Text>
                                    </View>

                                    <KeyboardAvoidingView style={[styles.Width_100 , styles.marginTop_35 , styles.marginBottom_25]}>
                                        <Form style={[styles.Width_100 , styles.flexCenter]}>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('delegateName') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:username ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:username ? '#fff' : '#eee'}]}
                                                       onChangeText={(username) => setUsername(username)}
                                                       value={username}
                                                       editable={editName}
                                                />
                                                <TouchableOpacity onPress={() =>setEditName(!editName)} style={{position:'absolute' , right:10 , bottom:10}}>
                                                    <Image source={require('../../../assets/images/edit_orange.png')} style={[styles.icon25]} resizeMode='contain' />
                                                </TouchableOpacity>
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('phone') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:phone ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:phone ? '#fff' : '#eee'}]}
                                                       onChangeText={(phone) => setPhone(phone)}
                                                       value={phone}
                                                       keyboardType={'number-pad'}
                                                       editable={editPhone}
                                                />
                                                <TouchableOpacity onPress={() =>setEditPhone(!editPhone)} style={{position:'absolute' , right:10 , bottom:10}}>
                                                    <Image source={require('../../../assets/images/edit_orange.png')} style={[styles.icon25]} resizeMode='contain' />
                                                </TouchableOpacity>
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('mail') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:mail ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:mail ? '#fff' : '#eee'}]}
                                                       onChangeText={(mail) => setMail(mail)}
                                                       value={mail}
                                                       keyboardType={'email-address'}
                                                       editable={editMail}
                                                />
                                                <TouchableOpacity onPress={() =>setEditMail(!editMail)} style={{position:'absolute' , right:10 , bottom:10}}>
                                                    <Image source={require('../../../assets/images/edit_orange.png')} style={[styles.icon25]} resizeMode='contain' />
                                                </TouchableOpacity>
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('idNum') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:idNum ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:idNum ? '#fff' : '#eee'}]}
                                                       onChangeText={(idNum) => setIdNum(idNum)}
                                                       value={userData && userData.delegate && userData.delegate.identity ? userData.delegate.identity : ''}
                                                       editable={false}
                                                />
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('manufacturingYear') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:manufacturingYear ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:manufacturingYear ? '#fff' : '#eee'}]}
                                                       onChangeText={(manufacturingYear) => setManufacturingYear(manufacturingYear)}
                                                       value={userData && userData.delegate && userData.delegate.year ? userData.delegate.year.toString() : ''}
                                                       keyboardType={'number-pad'}
                                                       editable={false}
                                                />
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('carType') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:carType ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:carType ? '#fff' : '#eee'}]}
                                                       onChangeText={(carType) => setCarType(carType)}
                                                       value={userData && userData.delegate && userData.delegate.car_model ? userData.delegate.car_model : ''}
                                                       editable={false}
                                                />
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('carNumber') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:carNumber ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:carNumber ? '#fff' : '#eee'}]}
                                                       onChangeText={(carNumber) => setCarNumber(carNumber)}
                                                       value={userData && userData.delegate && userData.delegate.car_plate_number ? userData.delegate.car_plate_number : ''}
                                                       keyboardType={'number-pad'}
                                                       editable={false}
                                                />
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('carChars') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:carChars ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:carChars ? '#fff' : '#eee'}]}
                                                       onChangeText={(carChars) => setCarChars(carChars)}
                                                       value={userData && userData.delegate && userData.delegate.car_plate_letters ? userData.delegate.car_plate_letters : ''}
                                                       editable={false}
                                                />
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('area') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:area ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:area ? '#fff' : '#eee'}]}
                                                       onChangeText={(area) => setArea(area)}
                                                       value={userData && userData.address ? userData.address : ''}
                                                       editable={false}
                                                />
                                            </Item>

                                            <Item style={[styles.item]}>
                                                <Label style={[styles.label]}>{ i18n.t('city') }</Label>
                                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:city ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:city ? '#fff' : '#eee'}]}
                                                       onChangeText={(city) => setCity(city)}
                                                       value={userData && userData.delegate && userData.delegate.city ? userData.delegate.city : ''}
                                                       editable={false}
                                                />
                                            </Item>

                                            {
                                                userData && userData.delegate.attachments ?
                                                    <TouchableOpacity onPress={attachToggleModal} style={[styles.alignStart]}>
                                                        <Text style={[styles.textRegular , styles.text_darkRed , styles.textSize_15 , styles.marginBottom_5]}>{ i18n.t('attachment') }</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    null
                                            }



                                        </Form>
                                    </KeyboardAvoidingView>

                                    <TouchableOpacity onPress={toggleModal} style={[styles.mstrdaBtn , styles.Width_100 , styles.marginBottom_10 ]}>
                                        <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('changePass') }</Text>
                                    </TouchableOpacity>

                                    {renderSubmit()}

                                    {/*<TouchableOpacity style={[styles.mstrdaBtn , styles.Width_100 , styles.marginBottom_20 ]}>*/}
                                    {/*    <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('editProfile') }</Text>*/}
                                    {/*</TouchableOpacity>*/}

                                </View>
                                :
                                null
                            :

                                // providers && (providers).length > 0?
                                <View style={[styles.paddingHorizontal_20]}>
                                    <FlatList
                                        data={comments}
                                        horizontal={false}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item , index}) => <CommentItem
                                            id={item.id}
                                            name={item.name}
                                            image={item.image}
                                            desc={item.desc}
                                            rate={item.rate}
                                            index={index}
                                        />}
                                        keyExtractor={item => item.id}
                                    />
                                </View>
                                // :
                                // renderNoData()
                    }
                </View>

                <Modal
                    onBackdropPress                 ={toggleModal}
                    onBackButtonPress               = {toggleModal}
                    isVisible                       = {showModal}
                    style                           = {styles.bgModel}
                    avoidKeyboard                    = {true}
                >

                    <View style={[styles.bg_White, styles.overHidden, styles.Width_100, styles.flexCenter , {borderTopStartRadius:5 , borderTopEndRadius:5}]}>

                        <View style={[styles.bg_darkRed , styles.Width_100 , styles.paddingVertical_15 , styles.centerContext]}>
                            <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('changePass') }</Text>
                        </View>

                        <Form style={[styles.Width_100 , styles.paddingVertical_25 , styles.paddingHorizontal_15 , styles.flexCenter]}>

                            <Item style={[styles.item , styles.height_80]}>
                                <Label style={[styles.label]}>{ i18n.t('currentPassword') }</Label>
                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25, borderColor:password ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:password ? '#fff' : '#eee'}]}
                                       onChangeText={(password) => setPassword(password)}
                                       value={password}
                                       secureTextEntry={!showPass}
                                />
                                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={[{position:'absolute' , right:10  , bottom:13}]}>
                                    <Icon type={'FontAwesome'} name={showPass ? "eye-slash" : "eye"}
                                          style={[styles.textSize_18,styles.text_gray]} />
                                </TouchableOpacity>
                            </Item>

                            <Item style={[styles.item , styles.height_80]}>
                                <Label style={[styles.label]}>{ i18n.t('newpass') }</Label>
                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25, borderColor:newpass ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:newpass ? '#fff' : '#eee'}]}
                                       onChangeText={(newpass) => setNewpass(newpass)}
                                       value={newpass}
                                       secureTextEntry={!showNewPass}
                                />
                                <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)} style={[{position:'absolute' , right:10  , bottom:13}]}>
                                    <Icon type={'FontAwesome'} name={showNewPass ? "eye-slash" : "eye"}
                                          style={[styles.textSize_18,styles.text_gray]} />
                                </TouchableOpacity>
                            </Item>

                            <Item style={[styles.item , styles.height_80]}>
                                <Label style={[styles.label]}>{ i18n.t('confirmNewPass') }</Label>
                                <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25, borderColor:confirmNewPass ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:confirmNewPass ? '#fff' : '#eee'}]}
                                       onChangeText={(confirmNewPass) => setConfirmNewPass(confirmNewPass)}
                                       value={confirmNewPass}
                                       secureTextEntry={!showConPass}
                                />
                                <TouchableOpacity onPress={() => setShowConPass(!showConPass)} style={[{position:'absolute' , right:10  , bottom:13}]}>
                                    <Icon type={'FontAwesome'} name={showConPass ? "eye-slash" : "eye"}
                                          style={[styles.textSize_18,styles.text_gray]} />
                                </TouchableOpacity>
                            </Item>

                            {renderSubmitPass()}

                        </Form>

                    </View>

                </Modal>

                <Modal
                    onBackdropPress                 ={attachToggleModal}
                    onBackButtonPress               = {attachToggleModal}
                    isVisible                       = {attachShowModal}
                    style                           = {styles.bgModel}
                    avoidKeyboard                    = {true}
                >

                    <View style={[styles.bg_White, styles.overHidden, styles.Width_100, styles.flexCenter , {borderTopStartRadius:5 , borderTopEndRadius:5 , height:height-200}]}>

                        <View style={[styles.bg_darkRed , styles.Width_100 , styles.paddingVertical_15 , styles.centerContext]}>
                            <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('attachment') }</Text>
                        </View>

                        {
                            userData && userData.delegate.attachments ?
                                <ScrollView horizontal={false} style={[styles.Width_100 , styles.paddingVertical_15 , styles.paddingHorizontal_15 , styles.marginBottom_15 ]}>

                                    <Text style={[styles.textBold , styles.text_gray , styles.textSize_14 , styles.marginBottom_10]}>{ i18n.t('licenseImg') }</Text>
                                    <Image source={{uri:userData.delegate.attachments.identity_img}} style={[styles.Width_100 , styles.height_120 , styles.Radius_5 , styles.marginBottom_25]} resizeMode='cover' />

                                    <Text style={[styles.textBold , styles.text_gray , styles.textSize_14 , styles.marginBottom_10]}>{ i18n.t('carFrontImg') }</Text>
                                    <Image source={{uri:userData.delegate.attachments.car_plate_front_img}} style={[styles.Width_100 , styles.height_120 , styles.Radius_5 , styles.marginBottom_25]} resizeMode='cover' />

                                    <Text style={[styles.textBold , styles.text_gray , styles.textSize_14 , styles.marginBottom_10]}>{ i18n.t('carBackImg') }</Text>
                                    <Image source={{uri:userData.delegate.attachments.car_plate_end_img}} style={[styles.Width_100 , styles.height_120 , styles.Radius_5 , styles.marginBottom_25]} resizeMode='cover' />

                                    <Text style={[styles.textBold , styles.text_gray , styles.textSize_14 , styles.marginBottom_10]}>{ i18n.t('carNumbers') }</Text>
                                    <Image source={{uri:userData.delegate.attachments.car_plate_img}} style={[styles.Width_100 , styles.height_120 , styles.Radius_5 , styles.marginBottom_25]} resizeMode='cover' />

                                </ScrollView>
                                :
                                null
                        }



                    </View>

                </Modal>
            </Content>
        </Container>
    );
}

export default Profile;


