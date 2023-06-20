import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";

import styles from "../styles/AuthScreens";
import axiosInstance from "../constants/axios";

const LoginScreen = ({ handleLogin }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigation = useNavigation();

	const handleSubmit = async () => {
		if (!email) return alert("Email not given");
		if (!password) return alert("Password not given");
		try {
			const deviceId = "123";
			const fcmToken = "123";
			const result = await axiosInstance.post("/api/user/login", {
				email,
				password,
				deviceId,
				fcmToken,
			});
			console.log(result.data.data);
			const data = result.data.data;
			if (typeof data === "string") return alert(data);
			await handleLogin(data);
		} catch (error) {
			console.log("error", error);
			alert(error.msg);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Login</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={(text) => setPassword(text)}
				secureTextEntry={true}
			/>
			<TouchableOpacity style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>

			<Text style={styles.FormText}>
				Don't have an account?{" "}
				<Text
					style={styles.FormLink}
					onPress={() => navigation.navigate("RegisterScreen")}
				>
					Register now
				</Text>
			</Text>
		</View>
	);
};

export default LoginScreen;
