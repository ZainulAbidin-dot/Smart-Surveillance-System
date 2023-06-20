import LoginScreen from "./LoginScreen";
import Display from "./Display";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { COLORS } from "../constants";
import { useEffect, useState } from "react";
import { getData, storeData } from "../utils";
import registerNNPushToken from "native-notify";

const Index = () => {
	registerNNPushToken(8001, "zy08cMaUkMdVRgRWjNB7bm");
	const [user, setUser] = useState(null);

	useEffect(() => {
		getData(null)
			.then((value) => setUser(value))
			.catch((error) => console.log(error));
	}, []);

	const handleLogin = async (userData) => {
		const updatedUserInfo = { ...userData };
		await storeData(updatedUserInfo);
		setUser(updatedUserInfo);
	};

	const handleLogout = async () => {
		await storeData(null);
		setUser(null);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: COLORS.lightWhite },
					headerShown: false,
				}}
			/>
			{user != null && user?.token ? (
				<Display handleLogout={handleLogout} />
			) : (
				<LoginScreen handleLogin={handleLogin} />
			)}
		</SafeAreaView>
	);
};

export default Index;
