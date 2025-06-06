import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Calendar, CheckCircle, Circle, Plus, BarChart3, Target, Clock, TrendingUp, Play, ChevronLeft, ChevronRight } from 'lucide-react-native';

const TwelveWeekYearApp = () => {
  const [planStarted, setPlanStarted] = useState(false);
  const [planStartDate, setPlanStartDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [todos, setTodos] = useState({});
  const [scheduleItems, setScheduleItems] = useState([]);
  const [scheduleFrequency, setScheduleFrequency] = useState({});
  const [completedSchedule, setCompletedSchedule] = useState({});
  const [activeTab, setActiveTab] = useState('calendar');
  const [newTodo, setNewTodo] = useState('');
  const [newScheduleItem, setNewScheduleItem] = useState('');

  // Nanakshahi Calendar Data
  const nanakshahiMonths = [
    { name: 'ਚੇਤ', days: 31 }, { name: 'ਵੈਸਾਖ', days: 31 }, { name: 'ਜੇਠ', days: 31 },
    { name: 'ਹਾੜ', days: 31 }, { name: 'ਸਾਵਣ', days: 31 }, { name: 'ਭਾਦੋਂ', days: 30 },
    { name: 'ਅੱਸੂ', days: 30 }, { name: 'ਕੱਤਕ', days: 30 }, { name: 'ਮੱਘਰ', days: 30 },
    { name: 'ਪੋਹ', days: 30 }, { name: 'ਮਾਘ', days: 30 }, { name: 'ਫੱਗਣ', days: 30 }
  ];

  const weekDays = ['ਸੋਮਵਾਰ', 'ਮੰਗਲਵਾਰ', 'ਬੁੱਧਵਾਰ', 'ਵੀਰਵਾਰ', 'ਸ਼ੁੱਕਰਵਾਰ', 'ਸ਼ਨੀਵਾਰ', 'ਐਤਵਾਰ'];

  const getCurrentNanakshahiDate = () => {
    const today = new Date();
    const nanakshahiNewYear = new Date(today.getFullYear(), 2, 14);
    if (today < nanakshahiNewYear) {
      nanakshahiNewYear.setFullYear(today.getFullYear() - 1);
    }
    const daysSinceNewYear = Math.floor((today - nanakshahiNewYear) / (1000 * 60 * 60 * 24)) + 1;
    let currentMonth = 0;
    let currentDay = daysSinceNewYear;
    for (let i = 0; i < nanakshahiMonths.length; i++) {
      if (currentDay <= nanakshahiMonths[i].days) {
        currentMonth = i;
        break;
      }
      currentDay -= nanakshahiMonths[i].days;
    }
    if (currentMonth >= nanakshahiMonths.length) {
      currentMonth = nanakshahiMonths.length - 1;
      currentDay = nanakshahiMonths[currentMonth].days;
    }
    const dayName = weekDays[today.getDay() === 0 ? 6 : today.getDay() - 1];
    return {
      day: Math.max(1, currentDay),
      month: nanakshahiMonths[currentMonth].name,
      dayName: dayName
    };
  };

  const getCurrentPlanDay = () => {
    if (!planStarted || !planStartDate) return null;
    const today = new Date();
    const diffTime = Math.abs(today - planStartDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const month = Math.ceil(diffDays / 7);
    const day = ((diffDays - 1) % 7) + 1;
    return { month: Math.min(month, 12), day, totalDays: diffDays };
  };

  const startPlan = () => {
    const startDate = new Date();
    setPlanStartDate(startDate);
    setPlanStarted(true);
    setSelectedDay(1);
    setCurrentMonth(1);
  };

  const addTodo = () => {
    if (newTodo.trim() && selectedDay) {
      const key = `${currentMonth}-${selectedDay}`;
      setTodos(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), { id: Date.now(), text: newTodo, completed: false }]
      }));
      setNewTodo('');
    }
  };

  const toggleTodo = (monthDay, todoId) => {
    setTodos(prev => ({
      ...prev,
      [monthDay]: prev[monthDay].map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const addScheduleItem = () => {
    if (newScheduleItem.trim()) {
      const id = Date.now();
      setScheduleItems(prev => [...prev, { id, text: newScheduleItem }]);
      setScheduleFrequency(prev => ({ ...prev, [id]: 'weekly' }));
      setNewScheduleItem('');
    }
  };

  const toggleScheduleCompletion = (itemId, month, day) => {
    const key = `${itemId}-${month}-${day}`;
    setCompletedSchedule(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getMonthProgress = (month) => {
    let totalTasks = 0;
    let completedTasks = 0;
    for (let day = 1; day <= 7; day++) {
      const dayTodos = todos[`${month}-${day}`] || [];
      totalTasks += dayTodos.length;
      completedTasks += dayTodos.filter(t => t.completed).length;
    }
    scheduleItems.forEach(item => {
      const frequency = scheduleFrequency[item.id];
      if (frequency === 'weekly') {
        for (let day = 1; day <= 7; day++) {
          totalTasks++;
          if (completedSchedule[`${item.id}-${month}-${day}`]) {
            completedTasks++;
          }
        }
      } else if (frequency === 'yearly') {
        totalTasks++;
        if (completedSchedule[`${item.id}-${month}-1`]) {
          completedTasks++;
        }
      }
    });
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const WelcomeScreen = () => (
    <View style={styles.welcomeContainer}>
      <View style={styles.welcomeCard}>
        <Target size={64} color="#2563EB" />
        <Text style={styles.welcomeTitle}>12 Week Year</Text>
        <Text style={styles.welcomeSubtitle}>Transform your year into achievable 12-week cycles</Text>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeTextBold}>Your journey will include:</Text>
          <Text style={styles.welcomeText}>• 12 focused "months" (weeks)</Text>
          <Text style={styles.welcomeText}>• Daily task management</Text>
          <Text style={styles.welcomeText}>• Schedule tracking (weekly/yearly)</Text>
          <Text style={styles.welcomeText}>• Detailed progress analytics</Text>
          <Text style={styles.welcomeText}>• Nanakshahi calendar reference</Text>
        </View>
        <TouchableOpacity style={styles.welcomeButton} onPress={startPlan}>
          <Play size={20} color="#fff" />
          <Text style={styles.welcomeButtonText}>Start My 12 Week Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CalendarView = () => {
    const currentPlanDay = getCurrentPlanDay();
    return (
      <ScrollView style={styles.tabContainer}>
        <View style={styles.monthGrid}>
          {[...Array(12)].map((_, i) => {
            const month = i + 1;
            const progress = getMonthProgress(month);
            const isCurrentMonth = currentPlanDay && month === currentPlanDay.month;
            const isSelectedMonth = month === currentMonth;
            return (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthCard,
                  isCurrentMonth && styles.currentMonth,
                  isSelectedMonth && styles.selectedMonth
                ]}
                onPress={() => setCurrentMonth(month)}
              >
                <Text style={styles.monthText}>Month {month}</Text>
                {isCurrentMonth && <Text style={styles.currentMonthText}>Current</Text>}
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.dayContainer}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>Month {currentMonth} - Days</Text>
            <View style={styles.dayNav}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => setCurrentMonth(Math.max(1, currentMonth - 1))}
              >
                <ChevronLeft size={20} color="#4B5563" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => setCurrentMonth(Math.min(12, currentMonth + 1))}
              >
                <ChevronRight size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dayGrid}>
            {[...Array(7)].map((_, i) => {
              const day = i + 1;
              const isToday = currentPlanDay && currentPlanDay.month === currentMonth && currentPlanDay.day === day;
              const isSelected = selectedDay === day;
              const dayTodos = todos[`${currentMonth}-${day}`] || [];
              const completedTodos = dayTodos.filter(t => t.completed).length;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayCard, isToday && styles.todayCard, isSelected && styles.selectedDay]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={styles.dayText}>Day {day}</Text>
                  {isToday && <Text style={styles.todayText}>TODAY</Text>}
                  {dayTodos.length > 0 && (
                    <Text style={styles.taskCount}>
                      {completedTodos}/{dayTodos.length} tasks
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  const TodoView = () => {
    if (!selectedDay) {
      return (
        <View style={styles.emptyTab}>
          <Calendar size={64} color="#9CA3AF" />
          <Text style={styles.emptyText}>Select a day from the calendar to manage tasks</Text>
        </View>
      );
    }
    const currentKey = `${currentMonth}-${selectedDay}`;
    const currentTodos = todos[currentKey] || [];
    return (
      <ScrollView style={styles.tabContainer}>
        <View style={styles.todoHeader}>
          <Text style={styles.todoTitle}>Tasks for Day {selectedDay}</Text>
          <Text style={styles.todoSubtitle}>Month {currentMonth}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="Add a new task..."
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.todoList}>
          {currentTodos.map(todo => (
            <View key={todo.id} style={styles.todoItem}>
              <TouchableOpacity onPress={() => toggleTodo(currentKey, todo.id)}>
                {todo.completed ? (
                  <CheckCircle size={20} color="#16A34A" />
                ) : (
                  <Circle size={20} color="#16A34A" />
                )}
              </TouchableOpacity>
              <Text style={[styles.todoText, todo.completed && styles.todoCompleted]}>
                {todo.text}
              </Text>
            </View>
          ))}
          {currentTodos.length === 0 && (
            <Text style={styles.emptyTodo}>No tasks for this day. Add one above!</Text>
          )}
        </View>
      </ScrollView>
    );
  };

  const ScheduleView = () => (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.scheduleHeader}>
        <Text style={styles.scheduleTitle}>Schedule Management</Text>
        <Text style={styles.scheduleSubtitle}>Create weekly or yearly recurring activities</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newScheduleItem}
          onChangeText={setNewScheduleItem}
          placeholder="Add a schedule item..."
          onSubmitEditing={addScheduleItem}
        />
        <TouchableOpacity style={styles.addButtonPurple} onPress={addScheduleItem}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.scheduleList}>
        {scheduleItems.map(item => (
          <View key={item.id} style={styles.scheduleItem}>
            <View style={styles.scheduleItemHeader}>
              <Text style={styles.scheduleItemText}>{item.text}</Text>
              <View style={styles.frequencyPicker}>
                <Text
                  style={[styles.frequencyOption, scheduleFrequency[item.id] === 'weekly' && styles.frequencySelected]}
                  onPress={() => setScheduleFrequency(prev => ({ ...prev, [item.id]: 'weekly' }))}
                >
                  Weekly
                </Text>
                <Text
                  style={[styles.frequencyOption, scheduleFrequency[item.id] === 'yearly' && styles.frequencySelected]}
                  onPress={() => setScheduleFrequency(prev => ({ ...prev, [item.id]: 'yearly' }))}
                >
                  Yearly
                </Text>
              </View>
            </View>
            {scheduleFrequency[item.id] === 'weekly' ? (
              <View style={styles.dayGrid}>
                {[...Array(7)].map((_, dayIndex) => {
                  const day = dayIndex + 1;
                  const key = `${item.id}-${currentMonth}-${day}`;
                  const isCompleted = completedSchedule[key];
                  return (
                    <View key={dayIndex} style={styles.scheduleDay}>
                      <Text style={styles.scheduleDayText}>Day {day}</Text>
                      <TouchableOpacity
                        style={[styles.scheduleButton, isCompleted && styles.scheduleButtonCompleted]}
                        onPress={() => toggleScheduleCompletion(item.id, currentMonth, day)}
                      >
                        {isCompleted && <CheckCircle size={16} color="#fff" />}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) 혹은 (
              <View style={styles.yearlyButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.yearlyButton,
                    completedSchedule[`${item.id}-${currentMonth}-1`] && styles.yearlyButtonCompleted
                  ]}
                  onPress={() => toggleScheduleCompletion(item.id, currentMonth, 1)}
                >
                  <Text style={styles.yearlyButtonText}>
                    {completedSchedule[`${item.id}-${currentMonth}-1`] ? 'Completed' : 'Mark Complete'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        {scheduleItems.length === 0 && (
          <Text style={styles.emptySchedule}>No schedule items yet. Add one above!</Text>
        )}
      </View>
    </ScrollView>
  );

  const AnalyticsView = () => {
    const currentPlanDay = getCurrentPlanDay();
    const totalProgress = [...Array(12)].reduce((acc, _, i) => acc + getMonthProgress(i + 1), 0) / 12;
    return (
      <ScrollView style={styles.tabContainer}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsTitle}>Advanced Analytics</Text>
          <Text style={styles.analyticsSubtitle}>Deep insights into your 12-week journey</Text>
        </View>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsCardTitle}>
              <Target size={20} color="#2563EB" /> Progress Overview
            </Text>
            <View style={styles.progressStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{Math.round(totalProgress)}%</Text>
                <Text style={styles.statLabel}>Overall Progress</Text>
              </View>
              {currentPlanDay && (
                <>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{currentPlanDay.totalDays}</Text>
                    <Text style={styles.statLabel}>Days Completed</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{84 - currentPlanDay.totalDays}</Text>
                    <Text style={styles.statLabel}>Days Remaining</Text>
                  </View>
                </>
              )}
            </View>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsCard-vertical-align: middle;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.analyticsCardTitle {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
}

.progressStats {
  align-items: center;
}

.stat {
  margin-bottom: 16px;
  align-items: center;
}

.statValue {
  font-size: 24px;
  font-weight: bold;
  color: #2563EB;
}

.statLabel {
  font-size: 12px;
  color: #6B7280;
}

.monthProgress {
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
}

.monthLabel {
  width: 80px;
  font-size: 14px;
  font-weight: medium;
}

.progressBar {
  flex: 1;
  background-color: #e5e7eb;
  border-radius: 9999px;
  height: 12px;
  margin-right: 12px;
}

.progressFill {
  background-color: #3b82f6;
  border-radius: 9999px;
  height: 12px;
}

.progressText {
  font-size: 12px;
  color: #6B7280;
  width: 48px;
}

.taskStats {
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: space-between;
}

.taskLabel {
  font-size: 14px;
}

.taskValue {
  font-size14px;
  font-weight: medium;
}

.scheduleItemContainer {
  margin-bottom: 12px;
}

.scheduleItemHeader {
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
}

.scheduleItemText {
  font-size: 16px;
  font-weight: medium;
}

.scheduleFrequency {
  font-size: 12px;
  color: #6B7280;
}

.scheduleProgress {
  flex-direction: row;
  align-items: center;
}

.scheduleProgressBar {
  flex: 1;
  background-color: #e5e7eb;
  border-radius: 9999px;
  height: 8px;
  margin-right: 12px;
}

.scheduleProgressFill {
  background-color: #3b82f6;
  border-radius: 9999px;
  height: 8px;
}

.scheduleProgressText {
  font-size: 14px;
  font-weight: medium;
}

.navContainer {
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
  padding: 16px;
}

.navContent {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.navTitle {
  font-size: 20px;
  font-weight: bold;
  color: #1F2937;
}

.navDate {
  font-size: 12px;
  color: #6B7280;
  background-color: #fefce8;
  padding: 6px;
  border-radius: 8px;
}

.navPlan {
  font-size: 12px;
  color: #16A34A;
  background-color: #f0fdf4;
  padding: 6px;
  border-radius: 8px;
}

.navTabs {
  flex-direction: row;
}

.navTab {
  padding: 8px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
}

.navTabActive {
  background-color: #2563EB;
}

.navTabText {
  font-size: 14px;
  color: #6B7280;
}

.navTabTextActive {
  color: #fff;
}

.navTabIcon {
  margin-right: 8px;
}
`);

export default TwelveWeekYearApp;
