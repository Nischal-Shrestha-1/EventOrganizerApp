import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import LottieView from "lottie-react-native";

export default function Favourites({ navigation }) {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "events"), where("isFavourite", "==", true));
    const unsub = onSnapshot(q, (snapshot) => {
      setFavourites(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return unsub;
  }, []);

  const handleRemove = async (id) => {
    await updateDoc(doc(db, "events", id), { isFavourite: false });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item.id)}
      >
        <Text style={styles.removeText}>Remove from Favourites</Text>
      </TouchableOpacity>
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
      <Text style={styles.header}>Favourite Events</Text>
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favourite events found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
    padding: 20,
    position: "relative",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    zIndex: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  removeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 50,
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
