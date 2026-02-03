// src/services/storageService.js

const KEYS = {
  LOCATIONS: 'smartcal_locations',
  TASKS: 'smartcal_tasks',
  EVENTS: 'smartcal_events',
  RECURRING_SCHEDULE: 'smartcal_recurring_schedule',
  SETTINGS: 'smartcal_settings'
};

class StorageService {
  // LOCATIONS
  getLocations() {
    const data = localStorage.getItem(KEYS.LOCATIONS);
    return data ? JSON.parse(data) : [];
  }

  addLocation(location) {
    const locations = this.getLocations();
    const newLocation = {
      id: Date.now(),
      ...location,
      createdAt: new Date().toISOString()
    };
    locations.push(newLocation);
    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locations));
    return newLocation;
  }

  deleteLocation(id) {
    const locations = this.getLocations().filter(loc => loc.id !== id);
    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locations));
  }

  getHomeLocation() {
    const locations = this.getLocations();
    return locations.find(loc => loc.isHome) || null;
  }

  // TASKS
  getTasks(startDate, endDate) {
    const data = localStorage.getItem(KEYS.TASKS);
    let tasks = data ? JSON.parse(data) : [];

    if (startDate && endDate) {
      tasks = tasks.filter(task => {
        const taskStart = new Date(task.startDatetime);
        return taskStart >= new Date(startDate) && taskStart <= new Date(endDate);
      });
    }

    return tasks;
  }

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      id: Date.now(),
      ...task,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    return newTask;
  }

  deleteTask(id) {
    const tasks = this.getTasks().filter(task => task.id !== id);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  }

  // EVENTS
  getEvents(startDate, endDate) {
    const data = localStorage.getItem(KEYS.EVENTS);
    let events = data ? JSON.parse(data) : [];

    if (startDate && endDate) {
      events = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= new Date(startDate) && eventDate <= new(endDate);
      });
    }

    return events;
  }

  addEvent(event) {
    const events = this.getEvents();
    const newEvent = {
      id: Date.now(),
      ...event,
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
    return newEvent;
  }

  deleteEvent(id) {
    const events = this.getEvents().filter(event => event.id !== id);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  }

  // RECURRING SCHEDULE
  getRecurringSchedule(dayOfWeek = null) {
    const data = localStorage.getItem(KEYS.RECURRING_SCHEDULE);
    let schedules = data ? JSON.parse(data) : [];

    if (dayOfWeek !== null) {
      schedules = schedules.filter(s => s.dayOfWeek === dayOfWeek);
    }

    return schedules;
  }

  addRecurringSchedule(schedule) {
    const schedules = this.getRecurringSchedule();
    const newSchedule = {
      id: Date.now(),
      ...schedule,
      createdAt: new Date().toISOString()
    };
    schedules.push(newSchedule);
    localStorage.setItem(KEYS.RECURRING_SCHEDULE, JSON.stringify(schedules));
    return newSchedule;
  }

  deleteRecurringSchedule(id) {
    const schedules = this.getRecurringSchedule().filter(s => s.id !== id);
    localStorage.setItem(KEYS.RECURRING_SCHEDULE, JSON.stringify(schedules));
  }

  // SETTINGS (Plus besoin de googleMapsApiKey)
  getSettings() {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      nightStartTime: '21:00',
      nightEndTime: '06:00'
    };
  }

  updateSettings(settings) {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updatedSettings));
    return updatedSettings;
  }
}

export default new StorageService();