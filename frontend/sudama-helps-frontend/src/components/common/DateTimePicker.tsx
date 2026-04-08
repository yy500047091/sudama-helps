import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format, addDays, isBefore, isToday } from 'date-fns';
import { clsx } from 'clsx';

interface DateTimePickerProps {
  value?: { date: Date; time: string };
  onChange: (value: { date: Date; time: string }) => void;
  minDate?: Date;
  disabled?: boolean;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minDate = new Date(),
  disabled = false,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(minDate, i));
  const timeSlots = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ];

  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar size={16} className="inline mr-2" />
          Select Date
        </label>
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {value?.date ? format(value.date, 'MMM dd, yyyy') : 'Select date'}
          </button>

          {showDatePicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      onChange({ date, time: value?.time || '10:00' });
                      setShowDatePicker(false);
                    }}
                    className={clsx(
                      'p-2 rounded text-sm font-medium transition-all',
                      value?.date && format(value.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    <div className="text-xs opacity-75">{format(date, 'EEE')}</div>
                    <div>{format(date, 'dd')}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Picker */}
      {value?.date && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={16} className="inline mr-2" />
            Select Time
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {timeSlots.map((time) => {
              time.split(':').map(Number);
              const isAvailable = !(
                isToday(value.date) &&
                isBefore(new Date(`${format(value.date, 'yyyy-MM-dd')}T${time}`), new Date())
              );

              return (
                <button
                  key={time}
                  onClick={() => {
                    if (isAvailable) {
                      onChange({ date: value.date, time });
                    }
                  }}
                  disabled={!isAvailable}
                  className={clsx(
                    'p-2 rounded font-medium transition-all text-sm',
                    value.time === time
                      ? 'bg-primary-600 text-white'
                      : isAvailable
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Display Selected */}
      {value?.date && value?.time && (
        <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-primary-800">
            <strong>Scheduled for:</strong> {format(value.date, 'MMMM dd, yyyy')} at{' '}
            {value.time}
          </p>
        </div>
      )}
    </div>
  );
};
