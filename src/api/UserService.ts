import { useContext } from "react";
import { UserRegistrationData } from "../components/UserContext";


const API = process.env.EXPO_PUBLIC_APP_URL + "/ChatWave";

export const createNewAccount = async (
  userRegistrationData: UserRegistrationData
) => {
  let formData = new FormData();
  formData.append("firstName", userRegistrationData.firstName);
  formData.append("lastName", userRegistrationData.lastName);
  formData.append("countryCode", userRegistrationData.countryCode);
  formData.append("contactNo", userRegistrationData.contactNo);
  formData.append("profileImage", {
    uri: userRegistrationData.profileImage,
    name: "profile.png",
    type: "image/png",
  } as any);

  const response = await fetch(API+"/UserController", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const json = await response.json();
    console.log(json);

    return json;
  } else {
    return "OOPS! Account creation failed!";
  }
};

export const uploadProfileImage = async (userId: string, imageUri: string) => {
  let formData = new FormData();
  formData.append("userId", userId);
  formData.append("profileImage", {
    uri: imageUri,
    type: "image/png", // change if PNG
    name: "profile.png",
  } as any);

  const response = await fetch(API + "/ProfileController", {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    return await response.json();
  } else {
    console.warn("Profile image uploading failed!");
  }
};
export const NumberVerification = async (countryCode: string, contactNo: string) => {
  console.log("Sending verification to:", countryCode + contactNo);

  try {
    const verifoication = {
      countryCode,
      contactNo,
    };

    const response = await fetch(API + "/UserSignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifoication),   
    });

    if (!response.ok) {
      console.warn("OTP Code sending failed! Server responded:", response.status);
      throw new Error("Failed to send verification code");
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.warn("signIn error:", err);
    throw err;
  }
};

