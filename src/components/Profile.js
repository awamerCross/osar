import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    I18nManager,
    KeyboardAvoidingView, ActivityIndicator
} from "react-native";
import {Container, Content, Form, Icon, Input, Item, Label , Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import Header from '../common/Header';
import COLORS from "../consts/colors";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import  Modal  from "react-native-modal";
import {useSelector, useDispatch} from "react-redux";
import {profile, updateProfile , changePass} from "../actions";

const height = Dimensions.get('window').height;
const isIOS = Platform.OS === 'ios';

function Profile({navigation,route}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const user = useSelector(state =>  state.auth.user ? state.auth.user.data : {});

    const userData = useSelector(state => state.profile.user);
    const userDataLoader = useSelector(state => state.profile.loader);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [screenLoader , setScreenLoader ] = useState(true);

    const [base64, setBase64] = useState(null);
    const [userImage, setUserImage] = useState("");

    const [username, setUsername] = useState(user.name);
    const [editName, setEditName] = useState(false);

    const [phone, setPhone] = useState(user.phone);
    const [editPhone, setEditPhone] = useState(false);

    const [mail, setMail] = useState(user.email);
    const [editMail, setEditMail] = useState(false);

    const [showModal, setShowModal] = useState(false);


    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [newpass, setNewpass] = useState('');
    const [showNewPass, setShowNewPass] = useState(false);
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [showConPass, setShowConPass] = useState(false);


    const dispatch = useDispatch();

    function fetchData(){
        setScreenLoader(true)
        dispatch(profile(lang, token)).then(() => {setScreenLoader(false)});
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation , userDataLoader]);


    function renderLoader(){
        if (screenLoader){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.darkRed} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    function toggleModal () {
        setShowModal(!showModal);
    };

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

    function renderSubmit() {
        if (phone == '' || username == '' || mail == '') {
            return (
                <View
                    style={[styles.mstrdaBtn , styles.Width_100  , styles.marginBottom_20 , {
                        backgroundColor:'#ddd'
                    }]}
                >
                    <Text style={[styles.textBold , styles.text_gray , styles.textSize_15]}>{ i18n.t('confirm') }</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => onConfirm()} style={[styles.mstrdaBtn , styles.Width_100 , styles.marginBottom_20 ]}>
                <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('confirm') }</Text>
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

    return (
        <Container style={[styles.bg_darkRed]}>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.bg_darkRed]}>

                <Header navigation={navigation} title={ i18n.t('profile') } />

                {
                    userData ?
                        <View style={[styles.bgFullWidth ,styles.bg_White, styles.Width_100,styles.paddingHorizontal_20, {overflow:'hidden' , paddingBottom:70}]}>

                            <View style={[styles.directionColumnCenter , styles.marginTop_35]}>
                                <View style={[styles.icon70 , styles.Radius_50 , styles.borderGray , styles.marginBottom_7 ,{ padding: 7 }]}>
                                    <Image source= {userImage? {uri:userImage} : {uri:userData.avatar}} style={[styles.Width_100 , styles.heightFull , styles.Radius_50]} resizeMode='cover' />
                                    <TouchableOpacity onPress={_pickImage} style={{position:'absolute' , bottom:0 , zIndex:1 , right:0}}>
                                        <Image source={require('../../assets/images/camera.png')} style={[styles.icon25]} resizeMode='contain' />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.textRegular , styles.text_darkRed , styles.textSize_15 , styles.marginBottom_5]}>{username}</Text>
                            </View>

                            <KeyboardAvoidingView style={[styles.Width_100 , styles.marginTop_35 , styles.marginBottom_25]}>
                                <Form style={[styles.Width_100 , styles.flexCenter]}>

                                    <Item style={[styles.item]}>
                                        <Label style={[styles.label]}>{ i18n.t('username') }</Label>
                                        <Input style={[styles.input , {borderTopRightRadius :25 ,borderTopLeftRadius :25 , borderColor:username ? COLORS.darkRed : '#eee', borderWidth:1 , backgroundColor:username ? '#fff' : '#eee'}]}
                                               onChangeText={(username) => setUsername(username)}
                                               value={username}
                                               editable={editName}
                                        />
                                        <TouchableOpacity onPress={() =>setEditName(!editName)} style={{position:'absolute' , right:10 , bottom:10}}>
                                            <Image source={require('../../assets/images/edit_orange.png')} style={[styles.icon25]} resizeMode='contain' />
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
                                            <Image source={require('../../assets/images/edit_orange.png')} style={[styles.icon25]} resizeMode='contain' />
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
                                            <Image source={require('../../assets/images/edit_orange.png')} style={[styles.icon25]} resizeMode='contain' />
                                        </TouchableOpacity>
                                    </Item>

                                </Form>
                            </KeyboardAvoidingView>

                            <TouchableOpacity onPress={toggleModal} style={[styles.mstrdaBtn , styles.Width_100 , styles.marginBottom_10 ]}>
                                <Text style={[styles.textBold , styles.text_White , styles.textSize_15]}>{ i18n.t('changePass') }</Text>
                            </TouchableOpacity>

                            {renderSubmit()}

                        </View>
                        :
                        null
                }

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
            </Content>
        </Container>
    );
}

export default Profile;


