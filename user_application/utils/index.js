import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkImageURL = (url) => {
	if (!url) return false;
	else {
		const pattern = new RegExp(
			"^https?:\\/\\/.+\\.(png|jpg|jpeg|bmp|gif|webp)$",
			"i"
		);
		return pattern.test(url);
	}
};

export const storeData = async (value) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem("@FYP_APP_USER", jsonValue);
	} catch (error) {
		console.error("Error saving token:", error);
	}
};

export const getData = async (defaultReturn) => {
	try {
		const value = await AsyncStorage.getItem("@FYP_APP_USER");
		return value != null ? JSON.parse(value) : defaultReturn;
	} catch (error) {
		console.error("Error reading token:", error);
	}
};

export const requestUserPermission = async () => {
	const authStatus = await messaging().requestPermission();
	const enabled =
		authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus === messaging.AuthorizationStatus.PROVISIONAL;

	if (enabled) {
		console.log("Authorization status:", authStatus);
	}

	const unsubscribe = messaging().onMessage(async (remoteMessage) => {
		Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
	});
};

export const getURL = (urlType) => {
	if (urlType === "search") {
		return "http://192.168.43.13:3333/room/search";
	} else if (urlType === "video_feed") {
		return "http://192.168.43.13:8000/video_feed";
	} else if (urlType === "room") {
		return "http://192.168.43.13:3333/room";
	} else if (urlType === "notification") {
		return "http://192.168.43.13:3333/notification";
	} else if (urlType === "baseURL") {
		return "http://192.168.43.13:3333";
	}
};
