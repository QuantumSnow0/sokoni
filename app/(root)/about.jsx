import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";

const About = () => {
  return (
    <>
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 20,
            marginBottom: 20,
            backgroundColor: "white",
          }}
        >
          <TouchableWithoutFeedback onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={35}
              color="black"
              style={{ padding: 5 }}
            />
          </TouchableWithoutFeedback>
          <Text style={{ fontSize: 25, padding: 10, fontWeight: 700 }}>
            About Me
          </Text>
          <View style={{ padding: 10 }}></View>
        </View>
      </View>
      <ScrollView
        style={styles.mainView}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text>Personal Details</Text>
        {/* details view */}
        <View style={{ marginVertical: 20, display: "flex", gap: 5 }}>
          <CustomInput icon="person-outline" placeholder="John Doe" />
          <CustomInput icon="mail-outline" placeholder="JohnDoe@gmail.com" />
          <CustomInput icon="call-outline" placeholder="John Doe" />
        </View>
        {/* password reset */}
        <Text>Personal Details</Text>
        <View style={{ marginVertical: 20, display: "flex", gap: 5 }}>
          <CustomInput icon="person-outline" placeholder="John Doe" />
          <CustomInput icon="mail-outline" placeholder="JohnDoe@gmail.com" />
          <CustomInput icon="call-outline" placeholder="John Doe" />
        </View>
      </ScrollView>
    </>
  );
};

export default About;
const styles = StyleSheet.create({
  mainView: {
    padding: 20,
  },
});
