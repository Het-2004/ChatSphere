import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message, own }) => {
  const { text, timestamp, pending } = message;

  // Format time (HH:MM)
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return '';
    }
  };

  return (
    <View style={[styles.container, own ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, own ? styles.ownBubble : styles.otherBubble]}>
        {text && <Text style={[styles.text, own ? styles.ownText : styles.otherText]}>{text}</Text>}
        <View style={styles.meta}>
          <Text style={[styles.time, own ? styles.ownTime : styles.otherTime]}>
            {formatTime(timestamp)}
          </Text>
          {pending && <Text style={styles.pending}>⏳</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
    flexDirection: 'row',
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  ownBubble: {
    backgroundColor: '#0066ff',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#1c1c1e', // Dark mode glass/grey
    borderWidth: 1,
    borderColor: '#2c2c2e',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownText: {
    color: '#ffffff',
  },
  otherText: {
    color: '#e5e5ea',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  time: {
    fontSize: 10,
  },
  ownTime: {
    color: '#b0d4ff',
  },
  otherTime: {
    color: '#8e8e93',
  },
  pending: {
    fontSize: 10,
    marginLeft: 3,
  },
});

export default MessageBubble;
