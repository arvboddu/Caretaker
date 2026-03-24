import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const isPatient = user?.role === 'patient';

  const { data: bookingsData, isLoading, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await api.get('/bookings', { params: { limit: 5 } });
      return response.data.data;
    },
  });

  const { data: recommendationsData } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const response = await api.get('/patients/recommendations', { params: { limit: 5 } });
      return response.data.data;
    },
    enabled: isPatient,
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.fullName?.split(' ')[0]}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.fullName?.charAt(0)}</Text>
        </TouchableOpacity>
      </View>

      {isPatient && (
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => {}}
        >
          <Text style={styles.searchText}>Search caretakers...</Text>
        </TouchableOpacity>
      )}

      {bookingsData?.bookings?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
          {bookingsData.bookings.map((booking: any) => (
            <TouchableOpacity key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingIcon}>
                <Text>📅</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingName}>
                  {isPatient ? booking.caretaker?.fullName : booking.patient?.fullName}
                </Text>
                <Text style={styles.bookingDate}>
                  {new Date(booking.date).toLocaleDateString()} at {booking.startTime}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: booking.status === 'confirmed' ? '#D1FAE5' : '#FEF3C7' }]}>
                <Text style={[styles.statusText, { color: booking.status === 'confirmed' ? '#065F46' : '#92400E' }]}>
                  {booking.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isPatient && recommendationsData?.caretakers?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          {recommendationsData.caretakers.map((caretaker: any) => (
            <TouchableOpacity
              key={caretaker.id}
              style={styles.caretakerCard}
              onPress={() => navigation.navigate('CaretakerProfile', { id: caretaker.id })}
            >
              <Image
                source={{ uri: caretaker.photo || 'https://via.placeholder.com/64' }}
                style={styles.caretakerPhoto}
              />
              <View style={styles.caretakerInfo}>
                <Text style={styles.caretakerName}>{caretaker.fullName}</Text>
                <Text style={styles.caretakerRating}>
                  ⭐ {caretaker.rating} • ${caretaker.hourlyRate}/hr
                </Text>
                <Text style={styles.caretakerSkills}>
                  {caretaker.skills?.slice(0, 3).join(', ')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!isPatient && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>View Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionText}>Earnings</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 14,
    color: '#475569',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  searchBar: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchText: {
    color: '#94A3B8',
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  bookingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  bookingDate: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  caretakerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  caretakerPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
  },
  caretakerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  caretakerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  caretakerRating: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  caretakerSkills: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#1E3A5F',
  },
});
