import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function CaretakerProfileScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { user } = useAuth();
  const isPatient = user?.role === 'patient';

  const { data, isLoading } = useQuery({
    queryKey: ['caretaker', id],
    queryFn: async () => {
      const response = await api.get(`/caretakers/${id}`);
      return response.data.data;
    },
  });

  if (isLoading || !data) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <Image
          source={{ uri: data.profilePhoto || 'https://via.placeholder.com/96' }}
          style={styles.photo}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{data.fullName}</Text>
        <View style={styles.rating}>
          <Text style={styles.stars}>{'⭐'.repeat(Math.floor(data.rating || 0))}</Text>
          <Text style={styles.reviewCount}>({data.reviewCount} reviews)</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${data.hourlyRate}</Text>
            <Text style={styles.statLabel}>per hour</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.yearsExperience}</Text>
            <Text style={styles.statLabel}>years exp</Text>
          </View>
        </View>

        {isPatient && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>💬 Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => navigation.navigate('Booking', { caretakerId: id })}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{data.bio || 'No bio available'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {data.skills?.map((skill: string) => (
              <View key={skill} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill.replace('_', ' ')}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          {Object.entries(data.availability || {}).map(([day, hours]: [string, any]) => (
            <View key={day} style={styles.availabilityRow}>
              <Text style={styles.dayText}>{day}</Text>
              <Text style={styles.hoursText}>
                {hours ? `${hours.start} - ${hours.end}` : 'Not available'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
  },
  header: {
    alignItems: 'center',
  },
  headerBg: {
    width: '100%',
    height: 100,
    backgroundColor: '#0D9488',
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginTop: -48,
    backgroundColor: '#E2E8F0',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
    textAlign: 'center',
    marginTop: 8,
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  stars: {
    fontSize: 16,
  },
  reviewCount: {
    marginLeft: 8,
    color: '#475569',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  messageButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0D9488',
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#0D9488',
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    color: '#0D9488',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dayText: {
    color: '#475569',
    textTransform: 'capitalize',
  },
  hoursText: {
    color: '#1E3A5F',
  },
});
