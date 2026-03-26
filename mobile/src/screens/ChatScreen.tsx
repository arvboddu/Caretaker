import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GiftedChat } from 'react-native-gifted-chat';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function ChatScreen({ route }: any) {
  const { threadId } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['messages', threadId],
    queryFn: async () => {
      const response = await api.get(`/chat/threads/${threadId}/messages`);
      return response.data.data;
    },
    refetchInterval: 5000,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post(`/chat/threads/${threadId}/messages`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', threadId] });
      queryClient.invalidateQueries({ queryKey: ['chat-threads'] });
    },
  });

  const messages = messagesData?.messages?.map((msg: any) => ({
    _id: msg.id,
    text: msg.content,
    createdAt: new Date(msg.createdAt),
    user: {
      _id: msg.senderId === user?.id ? 1 : 2,
    },
  })) || [];

  const onSend = (newMessages: any) => {
    sendMutation.mutate(newMessages[0].text);
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: 1,
      }}
      placeholder="Type a message..."
      textInputStyle={styles.input}
      renderAvatar={null}
      messagesContainerStyle={styles.messagesContainer}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messagesContainer: {
    backgroundColor: '#FFFFFF',
  },
});
