import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { getContacts } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';


export default function ContactList({ navigation }) {
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="person-add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contactListContainer}>
        <Text style={styles.sectionHeader}>Contacts</Text>
        {contacts.map((contact) => (
          <TouchableOpacity key={contact.id}>
            <View style={styles.contactItem}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: contact.image }}
                  style={styles.contactImage}
                />
                {contact.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactBio}>{contact.bio}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomnavbar}>
        <TouchableOpacity style={styles.navButton} onPress={()=>navigation.navigate('Home')}>
          <Image source={require('../assets/home_icon.png')} style={{width:30, height:30}} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('../assets/User_icon.png')} style={{width:35, height:35}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginTop: 20,
  },
  header: {
    backgroundColor: '#24B2FF',
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
  contactListContainer: {
    padding: 10,
    paddingBottom: 60,
  },
  sectionHeader: {
    margin: 7,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 15,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactBio: {
    fontSize: 14,
    color: '#666',
  },
  bottomnavbar: {
    position: 'absolute',
    width: '100%',
    height: 60,
    bottom: 0,
    backgroundColor: '#24B2FF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    margin: 10,
  },
});
