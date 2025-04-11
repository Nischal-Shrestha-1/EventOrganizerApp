import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../firebase";
import LottieView from "lottie-react-native";

export default function AddEditEvent({ route, navigation }) {
  const event = route.params?.event;
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(event?.date || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !date) {
      return Alert.alert("Error", "Please fill in all fields.");
    }
    try {
      setLoading(true);
      if (event) {
        await updateDoc(doc(db, "events", event.id), { title, date });
      } else {
        await addDoc(collection(db, "events"), {
          title,
          date,
          isFavourite: false,
        });
      }
      setLoading(false);
      navigation.goBack();
    } catch (err) {
      setLoading(false);
      Alert.alert("Save Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/Bubbles.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.heading}>
        {event ? "Edit Event" : "Add New Event"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Event Date (e.g. 2025-04-15)"
        value={date}
        onChangeText={setDate}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Saving..." : "Save Event"}
          onPress={handleSave}
          disabled={loading}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelLink}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    position: "relative",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    zIndex: 1,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  buttonContainer: {
    marginBottom: 16,
    zIndex: 1,
  },
  cancelLink: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 16,
    marginTop: 12,
    zIndex: 1,
  },
  animation: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 0,
  },
});
