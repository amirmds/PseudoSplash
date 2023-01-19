import { useState } from "react";
import { Text, View, StyleSheet, Modal, Pressable, Alert } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';
import moment from "moment/moment";

function FullImg({ route }) {
  const { item } = route.params;
  const [ modalState, setModalState ] = useState(false);

  const handleDownload = async () => {
    let date = moment().format('YYYYMMDD_hhmmss');
    let fileUri = `${FileSystem.documentDirectory}${date}.png`;
    try {
      const res = await FileSystem.downloadAsync(item.download, fileUri);
      await MediaLibrary.requestPermissionsAsync();
      try {
        await MediaLibrary.createAssetAsync(fileUri);
        Alert.alert(date + '.png',  'Download complete.');
      } catch (err) {
        console.log("Save err: ", err);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  const handleFavorite = () => {
    Alert.alert("Added to Favorites");
  }

  const toggleModal = () => {
    setModalState(!modalState);
  };
  
  return (  
      <View style={{flex: 1}} >
        <Modal 
          visible={ modalState }
          statusBarTranslucent={true}
          presentationStyle='fullScreen'
          animationType='fade'
          style={{justifyContent: 'center'}}
        >
          <ImageViewer 
            imageUrls={[{url: item.img}]}
            renderIndicator={() => {}}
            backgroundColor='#606060'
            saveToLocalByLongPress={false}
            onClick={ toggleModal }
          />
        </Modal>
        <ImageViewer 
          imageUrls={[{url: item.img}]}
          renderIndicator={() => {}}
          backgroundColor='#f0f0f0'
          saveToLocalByLongPress={false}
          onClick={ toggleModal }
          style={{justifyContent: 'center'}}
        />
        <Text style={styles.item}>
          Photographer: {item.author}
        </Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.buttonDownload} onPress={handleDownload}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>Download</Text>
          </Pressable>
          <Pressable style={styles.buttonFavorite} onPress={handleFavorite}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Favorite</Text>
          </Pressable>
        </View>
      </View>
  );  
}


const styles = StyleSheet.create({
  image: {
    width: 'auto',
    height: '90%',
    margin: 0,
    adjustContent: "center",
    alignItems: "center",
  },
  item: {
    fontSize: 18,
    color: "#808080",
    margin: 15,
    alignContent: 'flex-start'
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignContent: 'space-around',
    marginBottom: 10,
    width: '100%'
  },
  buttonDownload: {
    backgroundColor: '#0065e3',
    marginLeft: 15,
    marginBottom: 20,
    borderRadius: 15,
    paddingHorizontal: 30,
    paddingVertical: 12,
    flexDirection: 'row'
  },
  buttonFavorite: {
    backgroundColor: '#00000035',
    marginLeft: 15,
    marginBottom: 20,
    borderRadius: 15,
    paddingHorizontal: 30,
    paddingVertical: 12,
    flexDirection: 'row'
  }
});

export default FullImg;