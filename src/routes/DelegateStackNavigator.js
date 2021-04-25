import React from "react";
import {View, Image, I18nManager, Text, Platform} from 'react-native';
import COLORS from "../consts/colors";
import { createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styles from '../../assets/styles'
import CustomDrawerContent from './DelegateDrawerContent'
import i18n from "../../locale/i18n";
import {useDispatch, useSelector} from "react-redux";
import {logout, tempAuth} from '../actions';


import SelectLoc 				        from "../common/SelectLoc";
import Home                             from "../components/delegate/Home";
import Profile 					        from "../components/delegate/Profile";
import NewLocation 				        from "../common/NewLocation";
import Orders 				            from "../components/delegate/Orders";
import Comments 				        from "../components/delegate/Comments";
import AboutApp                         from "../common/AboutApp";
import AppPolicy                        from "../common/AppPolicy";
import ContactUs                        from "../common/ContactUs";
import CompAndSug                       from "../common/CompAndSug";
import Wallet                           from "../common/Wallet";
import OrderDetails                     from "../components/delegate/OrderDetails";
import GetLocation                      from "../components/delegate/GetLocation";
import OrderDeliveredSuccessfully       from "../components/delegate/OrderDeliveredSuccessfully";
import SpecialOrderDetails              from "../components/delegate/SpecialOrderDetails";
import NormalOrderDetails               from "../components/delegate/NormalOrderDetails";
import Notifications                    from "../components/delegate/Notifications";
import Recharge                         from "../common/Recharge";
import BankTransfer                     from "../common/BankTransfer";
import Settings                         from "../common/Settings";
import Banks 					        from "../common/Banks";
import SetLocation 		    	        from "../common/SetLocation";


const MainStack  	= createStackNavigator();
const Drawer 	 	= createDrawerNavigator();
const Tabs   	 	= createBottomTabNavigator();



// function TabsScreen() {
//
//     return (
//         <Tabs.Navigator
//             initialRouteName="home"
//             tabBarOptions={{
//                 activeTintColor: COLORS.darkRed,
//                 style: [styles.footerStyle],
//                 tabStyle : [styles.paddingVertical_5]
//             }}
//         >
//
//             <Tabs.Screen
{/*                name="home"*/}
//                 component={Home}
//                 options={{
//                     tabBarLabel: ({ color, focused }) => (
//                         <Text style={[styles.textBold , color === COLORS.darkRed ? styles.text_darkRed : styles.text_gray, styles.textCenter , styles.textSize_11]}>{i18n.t('home')}</Text>
//                     ),
//                     tabBarIcon: ({ color, size }) => (
//                         <Image source={color === COLORS.darkRed ? require('../../assets/images/home_yellow.png') : require('../../assets/images/home_gray.png')} style={[styles.icon20]} resizeMode={'contain'} />
{/*                    ),*/}
{/*                }}*/}
//             />
//
//             <Tabs.Screen
//                 name="orders"
//                 component={Orders}
{/*                options={{*/}
//                     tabBarLabel: ({ color, focused }) => (
//                         <Text style={[styles.textBold , color === COLORS.darkRed ? styles.text_darkRed : styles.text_gray, styles.textCenter , styles.textSize_11]}>{i18n.t('orders')}</Text>
//                     ),
//                     tabBarIcon: ({ color, size }) => (
{/*                        <Image source={color === COLORS.darkRed ? require('../../assets/images/delivery_yellow.png') : require('../../assets/images/delivery_gray.png')} style={[styles.icon20]} resizeMode={'contain'} />*/}
{/*                    ),*/}
{/*                }}*/}
{/*            />*/}
//
//             <Tabs.Screen
//                 name="comments"
//                 component={Comments}
//                 options={{
//                     tabBarLabel: ({ color, focused }) => (
//                         <Text style={[styles.textBold , color === COLORS.darkRed ? styles.text_darkRed : styles.text_gray, styles.textCenter , styles.textSize_11]}>{i18n.t('comments')}</Text>
{/*                    ),*/}
{/*                    tabBarIcon: ({ color, size }) => (*/}
{/*                        <Image source={color === COLORS.darkRed ? require('../../assets/images/comment_yellow.png') : require('../../assets/images/comment_gray.png')} style={[styles.icon20]} resizeMode={'contain'} />*/}
{/*                    ),*/}
//                 }}
//             />
//
//             <Tabs.Screen
//                 name="profile"
//                 component={Profile}
//                 options={{
//                     tabBarLabel: ({ color, focused }) => (
//                         <Text style={[styles.textBold , color === COLORS.darkRed ? styles.text_darkRed : styles.text_gray , styles.textCenter , styles.textSize_10]}>{i18n.t('profile')}</Text>
//                     ),
//                     tabBarIcon: ({ color, size }) => (
//                         <Image source={color === COLORS.darkRed ? require('../../assets/images/user_yellow.png') : require('../../assets/images/user_gray.png')} style={[styles.icon20]} resizeMode={'contain'} />
//                     ),
//                 }}
//             />
//
//         </Tabs.Navigator>
//     );
// }



function MyDrawer() {

    return (
        <Drawer.Navigator
            initialRouteName="selectLoc"
            drawerStyle={[styles.Width_75]}
            drawerContentOptions={{
                itemStyle: [{ backgroundColor: 'transparent' , marginHorizontal:0}],
                labelStyle: [styles.textRegular ,{color:COLORS.gray }],
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}>
            {/*<Drawer.Screen name="tabs" component={TabsScreen}/>*/}
            <Drawer.Screen name="home" component={Home}/>
            <Drawer.Screen name='selectLoc' component={SelectLoc} options={() => ({
                gestureEnabled: false
            })}/>
            <Drawer.Screen name='newLocation' component={NewLocation} options={() => ({
                gestureEnabled: false
            })}/>
            <Drawer.Screen name='setLocation' component={SetLocation} options={() => ({
                gestureEnabled: false
            })}/>
            <Drawer.Screen name='profile' component={Profile}/>
            <Drawer.Screen name='orders' component={Orders}/>
            <Drawer.Screen name='aboutApp' component={AboutApp}/>
            <Drawer.Screen name='appPolicy' component={AppPolicy}/>
            <Drawer.Screen name='contactUs' component={ContactUs}/>
            <Drawer.Screen name='compAndSug' component={CompAndSug}/>
            <Drawer.Screen name='wallet' component={Wallet}/>
            <Drawer.Screen name='orderDetails' component={OrderDetails}/>
            <Drawer.Screen name='getLocation' component={GetLocation}/>
            <Drawer.Screen name='orderDeliveredSuccessfully' component={OrderDeliveredSuccessfully}/>
            <Drawer.Screen name='specialOrderDetails' component={SpecialOrderDetails}/>
            <Drawer.Screen name='normalOrderDetails' component={NormalOrderDetails}/>
            <Drawer.Screen name='notifications' component={Notifications}/>
            <Drawer.Screen name='recharge' component={Recharge}/>
            <Drawer.Screen name='banks' component={Banks}/>
            <Drawer.Screen name='bankTransfer' component={BankTransfer}/>
            <Drawer.Screen name='settings' component={Settings}/>
        </Drawer.Navigator>
    );
}



export function DelegateStackNavigator()  {
    return(
        <MainStack.Navigator mode={'card'} screenOptions={{headerShown: false}}  >
            <MainStack.Screen name='myDrawer' component={MyDrawer}/>
        </MainStack.Navigator>
    );
}

