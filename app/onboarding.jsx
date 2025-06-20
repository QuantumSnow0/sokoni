import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "one",
    title: "Welcome to",
    icon: require("../assets/images/adaptive-icon.png"),
    text: "Your trusted source for essential food supplies in bulk.",
    image: require("../assets/images/splash1.png"),
    backgroundColor: "#3a4275",
  },
  {
    key: "two",
    title: "Buy Quality Dairy Products",
    text: "Supplying bulk dairy essentials to shops, hotels, and homes.",
    image: require("../assets/images/splash2.png"),
    backgroundColor: "#34639c",
  },
  {
    key: "three",
    title: "Start Stocking with Sokoni",
    text: "Create an account and start placing your orders today.",
    image: require("../assets/images/splash3.png"),
    backgroundColor: "#258199",
    isLast: true,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const { isSignedIn } = useUser();
  useEffect(() => {
    const checkOnboarding = async () => {
      if (isSignedIn) {
        setHasSeenOnboarding(true);
        router.replace("Login"); // or Home
      } else {
        setHasSeenOnboarding(false);
      }
      setLoading(false);
    };
    checkOnboarding();
  }, [router]);

  const onDone = async () => {
    router.replace("(auth)/sign-in");
  };

  const renderItem = ({ item }) => (
    <ImageBackground source={item.image} style={styles.background}>
      {
        item.icon ? (
          <View style={styles.titleContainer}>
            <Text style={styles.getStartedText}>{item.title}</Text>
            <Image source={item.icon} resizeMode="contain" style={styles.titleImage}/>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        ) : (
        
         <View>
           <Text style={[styles.getStartedText, {textAlign: "center", marginBottom: 10}]}>{item.title}</Text>
           <Text style={[styles.text]}>{item.text}</Text>
          </View> 
          
        )
      }
      <TouchableOpacity style={styles.startButton} onPress={onDone}>
        <Text style={styles.startText}>Get Started</Text>
      </TouchableOpacity>
    </ImageBackground>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      showSkipButton = {false}
      showNextButton = {false}
      showDoneButton={false}
      renderPagination={(activeIndex) => (
    <View style={styles.customPagination}>
      {slides.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex ? styles.activeDot : null,
          ]}
        />
      ))}
    </View>
  )}
      
      
    />
  );
}

const styles = StyleSheet.create({
  background : {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
    
  },
  image: {
    width: width * 0.9,
    height: height * 0.5,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Righteous-Regular",
  },
  text: {
    fontSize: 24,
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    fontFamily: "AncizarSerif-italic",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  getStartedButton: {
    marginTop: 30,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  getStartedText: {
    color: "black",
    fontSize: width * 0.14,
    fontWeight: "800",
  },
  titleContainer: {
     display: "flex",
     justifyContent: "flex-start",
     alignItems: "center",
     
  }, 
  titleImage: {
    width: width * 0.2,
    height: width * 0.2
  },
  startButton: {
     display: "flex",
     alignItems : "center",
     backgroundColor: "#6CC51D",
     padding: 15,
     borderRadius: 10,
     width: "100%"
  },
  startText: {
     fontSize: width * 0.06,
     color: "#fff"
  },
  customPagination: {
  position: "absolute",
  bottom: 100, // 👈 move dots higher
  flexDirection: "row",
  alignSelf: "center",
},

dot: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: "#aaa",
  marginHorizontal: 5,
},

activeDot: {
  backgroundColor: "#6CC51D",
  width: 12,
  height: 12,
},

});
