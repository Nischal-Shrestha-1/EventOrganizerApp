import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  FlatList,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import LottieView from "lottie-react-native";

export default function Dashboard({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "events"));
    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleDelete = (id) => {
    Alert.alert("Confirm", "Delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => await deleteDoc(doc(db, "events", id)),
      },
    ]);
  };

  const handleFavourite = async (item) => {
    await updateDoc(doc(db, "events", item.id), {
      isFavourite: !item.isFavourite,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddEditEvent", { event: item })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleFavourite(item)}
        >
          <Text style={styles.buttonText}>
            {item.isFavourite ? "Unfavourite" : "Favourite"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/Bubbles.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.heading}>Dashboard</Text>
      <View style={styles.topButtons}>
        <Button
          title="Add Event"
          onPress={() => navigation.navigate("AddEditEvent")}
        />
        <Button
          title="Favourites"
          onPress={() => navigation.navigate("Favourites")}
          color="#007AFF"
        />
        <Button title="Logout" onPress={() => signOut(auth)} color="#FF3B30" />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingTop: 24,
    position: "relative",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
    zIndex: 1,
  },
  topButtons: {
    marginBottom: 20,
    gap: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
    color: "#222",
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  animation: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    top: 0,
    left: 0,
    zIndex: 0,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
});
