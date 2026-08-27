import { useState, useEffect } from 'react';
import {
  getHoursOfOperation,
  updateHours,
  getHolidayHours,
  addHolidayHours,
  updateHolidayHours,
  deleteHolidayHours,
  HoursOperation,
  HolidayHours
} from '../../services/operationalService';
import {
  ClockIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HoursManagement = () => {
  const [hours, setHours] = useState<HoursOperation[]>([]);
  const [holidays, setHolidays] = useState<HolidayHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<HolidayHours | null>(null);

  const [holidayForm, setHolidayForm] = useState({
    date: '',
    isOpen: true,
    openTime: '11:00',
    closeTime: '23:00',
    reason: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [hoursData, holidaysData] = await Promise.all([
        getHoursOfOperation(),
        getHolidayHours()
      ]);
      setHours(hoursData);
      setHolidays(holidaysData);
    } catch (error) {
      console.error('Error loading hours data:', error);
      toast.error('Failed to load hours data');
    } finally {
      setLoading(false);
    }
  };

  const handleHourUpdate = async (id: string, field: keyof HoursOperation, value: any) => {
    try {
      await updateHours(id, { [field]: value });
      
      // Update local state
      setHours(prev => prev.map(h => 
        h.id === id ? { ...h, [field]: value } : h
      ));
      
      toast.success('Hours updated successfully');
    } catch (error) {
      console.error('Error updating hours:', error);
      toast.error('Failed to update hours');
    }
  };

  const handleHolidaySubmit = async () => {
    try {
      const holidayData = {
        date: new Date(holidayForm.date),
        isOpen: holidayForm.isOpen,
        openTime: holidayForm.isOpen ? holidayForm.openTime : undefined,
        closeTime: holidayForm.isOpen ? holidayForm.closeTime : undefined,
        reason: holidayForm.reason
      };

      if (editingHoliday) {
        await updateHolidayHours(editingHoliday.id, holidayData);
        toast.success('Holiday hours updated');
      } else {
        await addHolidayHours(holidayData as any);
        toast.success('Holiday hours added');
      }

      setShowHolidayModal(false);
      setEditingHoliday(null);
      setHolidayForm({
        date: '',
        isOpen: true,
        openTime: '11:00',
        closeTime: '23:00',
        reason: ''
      });
      
      loadData();
    } catch (error) {
      console.error('Error saving holiday hours:', error);
      toast.error('Failed to save holiday hours');
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (window.confirm('Are you sure you want to delete these holiday hours?')) {
      try {
        await deleteHolidayHours(id);
        toast.success('Holiday hours deleted');
        loadData();
      } catch (error) {
        console.error('Error deleting holiday hours:', error);
        toast.error('Failed to delete holiday hours');
      }
    }
  };

  const openHolidayModal = (holiday?: HolidayHours) => {
    if (holiday) {
      setEditingHoliday(holiday);
      setHolidayForm({
        date: holiday.date.toISOString().split('T')[0],
        isOpen: holiday.isOpen,
        openTime: holiday.openTime || '11:00',
        closeTime: holiday.closeTime || '23:00',
        reason: holiday.reason
      });
    } else {
      setEditingHoliday(null);
      setHolidayForm({
        date: '',
        isOpen: true,
        openTime: '11:00',
        closeTime: '23:00',
        reason: ''
      });
    }
    setShowHolidayModal(true);
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-melt-charcoal mb-6 flex items-center">
        <ClockIcon className="h-6 w-6 text-melt-red mr-2" />
        Hours of Operation
      </h2>

      {/* Regular Hours */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opening Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closing Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hours.map((day) => (
              <tr key={day.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {day.dayName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.isOpen}
                      onChange={(e) => handleHourUpdate(day.id, 'isOpen', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-melt-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-melt-red"></div>
                    <span className="ml-3 text-sm">
                      {day.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingDay === day.id ? (
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => handleHourUpdate(day.id, 'openTime', e.target.value)}
                      onBlur={() => setEditingDay(null)}
                      className="p-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <div 
                      onClick={() => setEditingDay(day.id)}
                      className="cursor-pointer hover:text-melt-red flex items-center"
                    >
                      {day.openTime}
                      <PencilIcon className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingDay === day.id ? (
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => handleHourUpdate(day.id, 'closeTime', e.target.value)}
                      onBlur={() => setEditingDay(null)}
                      className="p-1 border rounded"
                    />
                  ) : (
                    <div 
                      onClick={() => setEditingDay(day.id)}
                      className="cursor-pointer hover:text-melt-red flex items-center"
                    >
                      {day.closeTime}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setEditingDay(day.id)}
                    className="text-melt-gold hover:text-melt-red"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Holiday Hours */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-melt-charcoal flex items-center">
            <CalendarIcon className="h-5 w-5 text-melt-red mr-2" />
            Special Holiday Hours
          </h3>
          <button
            onClick={() => openHolidayModal()}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Holiday</span>
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holidays.map((holiday) => (
              <tr key={holiday.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {holiday.date.toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    holiday.isOpen 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {holiday.isOpen ? 'Open' : 'Closed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {holiday.isOpen 
                    ? `${holiday.openTime} - ${holiday.closeTime}`
                    : 'Closed all day'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => openHolidayModal(holiday)}
                    className="text-melt-gold hover:text-melt-red"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHoliday(holiday.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {holidays.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No special holiday hours set
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-melt-charcoal mb-4">
              {editingHoliday ? 'Edit Holiday Hours' : 'Add Holiday Hours'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={holidayForm.reason}
                  onChange={(e) => setHolidayForm({ ...holidayForm, reason: e.target.value })}
                  placeholder="e.g., Eid Holiday, New Year, etc."
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={holidayForm.isOpen}
                    onChange={(e) => setHolidayForm({ ...holidayForm, isOpen: e.target.checked })}
                    className="rounded text-melt-gold"
                  />
                  <span className="text-sm text-gray-700">Restaurant is open</span>
                </label>
              </div>

              {holidayForm.isOpen && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Open Time
                    </label>
                    <input
                      type="time"
                      value={holidayForm.openTime}
                      onChange={(e) => setHolidayForm({ ...holidayForm, openTime: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Close Time
                    </label>
                    <input
                      type="time"
                      value={holidayForm.closeTime}
                      onChange={(e) => setHolidayForm({ ...holidayForm, closeTime: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowHolidayModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleHolidaySubmit}
                  className="btn-primary px-6 py-2"
                >
                  {editingHoliday ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoursManagement;