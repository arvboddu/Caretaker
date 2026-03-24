import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { format, addDays, startOfWeek } from '../utils/date';

export default function BookingScreen({ route, navigation }: any) {
  const { caretakerId } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(2);
  const [address, setAddress] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

  const bookingMutation = useMutation({
    mutationFn: (data: any) => bookingService.create(data),
    onSuccess: () => {
      Alert.alert('Success', 'Booking request sent!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error?.message || 'Booking failed');
    },
  });

  const handleBook = () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time');
      return;
    }
    if (!address) {
      Alert.alert('Error', 'Please enter your address');
      return;
    }

    bookingMutation.mutate({
      caretakerId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedTime,
      duration,
      address,
      serviceNotes,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateRow}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.toISOString()}
                style={[
                  styles.dateItem,
                  format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') &&
                    styles.dateItemSelected,
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text
                  style={[
                    styles.dateDay,
                    format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') &&
                      styles.dateDaySelected,
                  ]}
                >
                  {format(day, 'EEE')}
                </Text>
                <Text
                  style={[
                    styles.dateNum,
                    format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') &&
                      styles.dateNumSelected,
                  ]}
                >
                  {format(day, 'd')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.timeSlotSelected,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duration</Text>
        <View style={styles.durationRow}>
          {[1, 2, 3, 4, 6, 8].map((hours) => (
            <TouchableOpacity
              key={hours}
              style={[
                styles.durationItem,
                duration === hours && styles.durationItemSelected,
              ]}
              onPress={() => setDuration(hours)}
            >
              <Text
                style={[
                  styles.durationText,
                  duration === hours && styles.durationTextSelected,
                ]}
              >
                {hours}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe what you need help with..."
          value={serviceNotes}
          onChangeText={setServiceNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date</Text>
          <Text style={styles.summaryValue}>{format(selectedDate, 'EEEE, MMM d, yyyy')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Time</Text>
          <Text style={styles.summaryValue}>{selectedTime || '--:--'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>{duration} hours</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bookButton, bookingMutation.isPending && styles.bookButtonDisabled]}
        onPress={handleBook}
        disabled={bookingMutation.isPending}
      >
        <Text style={styles.bookButtonText}>
          {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateItem: {
    width: 50,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  dateItemSelected: {
    backgroundColor: '#0D9488',
  },
  dateDay: {
    fontSize: 12,
    color: '#475569',
  },
  dateDaySelected: {
    color: '#FFFFFF',
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginTop: 4,
  },
  dateNumSelected: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  timeSlotSelected: {
    backgroundColor: '#0D9488',
  },
  timeText: {
    color: '#475569',
    fontWeight: '500',
  },
  timeTextSelected: {
    color: '#FFFFFF',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  durationItemSelected: {
    backgroundColor: '#0D9488',
  },
  durationText: {
    color: '#475569',
    fontWeight: '500',
  },
  durationTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1E3A5F',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    color: '#475569',
  },
  summaryValue: {
    color: '#1E3A5F',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#0D9488',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  bookButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
