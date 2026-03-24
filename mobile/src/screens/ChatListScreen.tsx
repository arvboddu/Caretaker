import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ChatThread } from '../types';

export default function ChatListScreen({ navigation }: any) {
  const { data, isLoading } = useQuery({
    queryKey: ['chat-threads'],
    queryFn: async () => {
      const response = await api.get('/chat/threads');
      return response.data.data;
    },
  });

  const renderItem = ({ item }: { item: ChatThread }) => (
    <TouchableOpacity
      style={styles.threadItem}
      onPress={() => navigation.navigate('Chat', { threadId: item.id })}
    >
      <Image
        source={{ uri: item.otherUser.profilePhoto || 'https://via.placeholder.com/48' }}
        style={styles.avatar}
      />
      <View style={styles.threadInfo}>
        <View style={styles.threadHeader}>
          <Text style={styles.threadName}>{item.otherUser.fullName}</Text>
          {item.lastMessage && (
            <Text style={styles.threadTime}>
              {new Date(item.lastMessage.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
        <Text style={styles.threadPreview} numberOfLines={1}>
          {item.lastMessage?.content || 'No messages yet'}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {data?.threads?.length > 0 ? (
        <FlatList
          data={data.threads}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptyText}>Book a caretaker to start chatting</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
    padding: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  threadInfo: {
    flex: 1,
    marginLeft: 12,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threadName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  threadTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  threadPreview: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  emptyText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
});
