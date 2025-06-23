import React from 'react';
import {
  Modal,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from '../../twrnc';

type PickerMode = 'checkin' | 'checkout' | null;

type ModalState = {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  checkIn: Date | null;
  checkOut: Date | null;
  showPicker: boolean;
  pickerMode: PickerMode;
  errorMsg: string;
  setPickerMode: (mode: PickerMode) => void;
  setShowPicker: (v: boolean) => void;
  setCheckIn: (date: Date | null) => void;
  setCheckOut: (date: Date | null) => void;
  setErrorMsg: (msg: string) => void;
};

type BookingModalProps = {
  modalState: ModalState;
  bookingActions: {
    confirmBooking: () => void;
  };
};

const BookingModal: React.FC<BookingModalProps> = ({ modalState, bookingActions }) => {
  const {
    modalVisible,
    setModalVisible,
    checkIn,
    checkOut,
    showPicker,
    pickerMode,
    errorMsg,
    setPickerMode,
    setShowPicker,
    setCheckIn,
    setCheckOut,
    setErrorMsg,
  } = modalState;

  const { confirmBooking } = bookingActions;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed') return;

    const date = selectedDate!;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setErrorMsg('Date cannot be in the past');
      return;
    }

    if (pickerMode === 'checkin') {
      setCheckIn(date);
      setCheckOut(null); // reset checkout
      setErrorMsg('');
    } else if (pickerMode === 'checkout') {
      if (!checkIn || date <= checkIn) {
        setErrorMsg('Check-out must be after check-in');
      } else {
        setCheckOut(date);
        setErrorMsg('');
      }
    }

    setShowPicker(false);
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={tw`flex-1 justify-center bg-black bg-opacity-50 px-6`}>
        <View style={tw`bg-white rounded-lg p-6`}>
          <Text style={tw`text-base font-medium mb-2`}>Select Dates</Text>

          <TouchableOpacity
            style={tw`bg-gray-100 px-4 py-3 rounded-md mb-2`}
            onPress={() => {
              setPickerMode('checkin');
              setShowPicker(true);
              setErrorMsg('');
            }}
          >
            <Text style={tw`text-base text-indigo-600`}>
              {checkIn ? `Check-in: ${checkIn.toDateString()}` : 'Select Check-in Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-gray-100 px-4 py-3 rounded-md mb-4`}
            onPress={() => {
              setPickerMode('checkout');
              setShowPicker(true);
              setErrorMsg('');
            }}
            disabled={!checkIn}
          >
            <Text
              style={tw.style(
                'text-base',
                checkIn ? 'text-indigo-600' : 'text-gray-400'
              )}
            >
              {checkOut
                ? `Check-out: ${checkOut.toDateString()}`
                : 'Select Check-out Date'}
            </Text>
          </TouchableOpacity>

          {/* Show date picker when requested */}
          {showPicker && (
            <DateTimePicker
              value={
                pickerMode === 'checkin'
                  ? checkIn || new Date()
                  : checkOut || checkIn || new Date()
              }
              mode="date"
              display="default"
              minimumDate={
                pickerMode === 'checkin'
                  ? new Date()
                  : checkIn || new Date()
              }
              onChange={handleDateChange}
            />
          )}

          {errorMsg ? (
            <Text style={tw`text-red-500 mb-4`}>{errorMsg}</Text>
          ) : null}

          {checkIn && checkOut && (
            <TouchableOpacity
              style={tw`bg-indigo-600 py-3 rounded-md mb-4`}
              onPress={confirmBooking}
            >
              <Text style={tw`text-white text-center font-bold text-lg`}>
                Confirm Booking
              </Text>
            </TouchableOpacity>
          )}

          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

export default BookingModal;