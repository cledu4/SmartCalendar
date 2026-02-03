// src/services/slotFinderService.js
// Algorithme avec choix des modes de transport aller/retour
import storageService from './storageService';
import travelService from './travelService';

class SlotFinderService {

  /**
   * Trouve des créneaux disponibles pour un rendez-vous
   * @param {number} locationId - ID du lieu du rendez-vous
   * @param {number} durationMinutes - Durée souhaitée du RDV
   * @param {string} modeGo - Mode de transport aller ('walking', 'cycling', 'driving', 'transit')
   * @param {string} modeReturn - Mode de transport retour ('walking', 'cycling', 'driving', 'transit')
   * @param {number} daysToSearch - Nombre de jours à chercher (défaut: 14)
   */
  async findAvailableSlots(locationId, durationMinutes, modeGo = 'driving', modeReturn = 'driving', daysToSearch = 14) {
    const locations = storageService.getLocations();
    const home = locations.find(loc => loc.isHome);
    const destination = locations.find(loc => loc.id === locationId);

    if (!destination) {
      throw new Error('Lieu non trouvé');
    }

    if (!home) {
      throw new Error('Veuillez définir un lieu comme domicile dans "Mes lieux"');
    }

    // Récupérer les paramètres
    const settings = storageService.getSettings();
    const nightStart = this.timeToMinutes(settings.nightStartTime);
    const nightEnd = this.timeToMinutes(settings.nightEndTime);

    // Récupérer l'emploi du temps récurrent
    const recurringSchedule = storageService.getRecurringSchedule();

    // Chercher des créneaux sur les X prochains jours
    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < daysToSearch; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const daySlots = await this.findSlotsForDay(
        currentDate,
        durationMinutes,
        destination,
        home,
        locations,
        nightStart,
        nightEnd,
        recurringSchedule,
        modeGo,
        modeReturn
      );

      slots.push(...daySlots);

      // Limiter à 10 résultats
      if (slots.length >= 10) break;
    }

    return slots.slice(0, 10);
  }

  /**
   * Trouve les créneaux disponibles pour une journée spécifique
   */
  async findSlotsForDay(date, durationMinutes, destination, home, locations, nightStart, nightEnd, recurringSchedule, modeGo, modeReturn) {
    const slots = [];
    const dayOfWeek = date.getDay();

    // Récupérer les tâches existantes pour ce jour
    const dateStr = date.toISOString().split('T')[0];
    const tasks = storageService.getTasks(
      `${dateStr}T00:00:00`,
      `${dateStr}T23:59:59`
    );

    // Créer la timeline des activités de la journée
    const activities = [];

    // Ajouter les heures de nuit comme activité
    if (nightStart > nightEnd) {
      activities.push({
        start: 0,
        end: nightEnd,
        location: home,
        type: 'night',
        title: 'Sommeil'
      });
      activities.push({
        start: nightStart,
        end: 24 * 60,
        location: home,
        type: 'night',
        title: 'Sommeil'
      });
    } else {
      activities.push({
        start: nightStart,
        end: nightEnd,
        location: home,
        type: 'night',
        title: 'Sommeil'
      });
    }

    // Ajouter l'emploi du temps récurrent
    const daySchedule = recurringSchedule.filter(s => s.dayOfWeek === dayOfWeek);
    for (const schedule of daySchedule) {
      const scheduleLocation = locations.find(loc => loc.id === schedule.locationId) || home;
      activities.push({
        start: this.timeToMinutes(schedule.startTime),
        end: this.timeToMinutes(schedule.endTime),
        location: scheduleLocation,
        type: 'recurring',
        title: schedule.title
      });
    }

    // Ajouter les tâches existantes
    for (const task of tasks) {
      const startTime = new Date(task.startDatetime);
      const endTime = new Date(task.endDatetime);
      const taskLocation = locations.find(loc => loc.id === task.locationId) || home;
      activities.push({
        start: startTime.getHours() * 60 + startTime.getMinutes(),
        end: endTime.getHours() * 60 + endTime.getMinutes(),
        location: taskLocation,
        type: 'task',
        title: task.title
      });
    }

    // Trier les activités par heure de début
    activities.sort((a, b) => a.start - b.start);

    // Chercher des créneaux entre les activités
    for (let i = 0; i < activities.length; i++) {
      const currentActivity = activities[i];
      const nextActivity = activities[i + 1];

      if (!nextActivity) {
        // Dernière activité de la journée
        const availableTime = (24 * 60) - currentActivity.end;

        if (availableTime > durationMinutes) {
          // Calculer le trajet aller (depuis dernière activité vers RDV)
          const travelFromLast = await this.calculateTravel(
            currentActivity.location,
            destination,
            modeGo
          );

          // Calculer le trajet retour (du RDV vers domicile)
          const travelToHome = await this.calculateTravel(
            destination,
            home,
            modeReturn
          );

          const requiredTime = travelFromLast + durationMinutes + travelToHome;

          if (availableTime >= requiredTime) {
            const slotStart = currentActivity.end + travelFromLast;
            const slotEnd = slotStart + durationMinutes;

            const slotDate = this.minutesToDate(date, slotStart);
            const slotEndDate = this.minutesToDate(date, slotEnd);

            if (slotDate > new Date()) {
              slots.push({
                id: `${date.getTime()}-${slotStart}`,
                startTime: slotDate,
                endTime: slotEndDate,
                travelBefore: travelFromLast,
                travelAfter: travelToHome,
                modeGo: this.getModeLabel(modeGo),
                modeReturn: this.getModeLabel(modeReturn),
                previousActivity: currentActivity.title,
                nextActivity: 'Retour domicile',
                date: date
              });
            }
          }
        }
        continue;
      }

      // Temps libre entre deux activités
      const freeTime = nextActivity.start - currentActivity.end;

      if (freeTime <= durationMinutes) {
        continue;
      }

      // Calculer le trajet aller (depuis dernière activité vers RDV)
      const travelFromLast = await this.calculateTravel(
        currentActivity.location,
        destination,
        modeGo
      );

      // Calculer le trajet retour (du RDV vers prochaine activité)
      const travelToNext = await this.calculateTravel(
        destination,
        nextActivity.location,
        modeReturn
      );

      // Temps total nécessaire
      const requiredTime = travelFromLast + durationMinutes + travelToNext;

      if (freeTime >= requiredTime) {
        const slotStart = currentActivity.end + travelFromLast;
        const slotEnd = slotStart + durationMinutes;

        const slotDate = this.minutesToDate(date, slotStart);
        const slotEndDate = this.minutesToDate(date, slotEnd);

        if (slotDate > new Date()) {
          slots.push({
            id: `${date.getTime()}-${slotStart}`,
            startTime: slotDate,
            endTime: slotEndDate,
            travelBefore: travelFromLast,
            travelAfter: travelToNext,
            modeGo: this.getModeLabel(modeGo),
            modeReturn: this.getModeLabel(modeReturn),
            previousActivity: currentActivity.title,
            nextActivity: nextActivity.title,
            date: date
          });
        }
      }
    }

    return slots;
  }

  /**
   * Calcule le temps de trajet entre deux lieux avec un mode de transport spécifique
   */
  async calculateTravel(fromLocation, toLocation, mode = 'driving') {
    if (!fromLocation || !toLocation) {
      return 30;
    }

    if (fromLocation.id === toLocation.id) {
      return 0;
    }

    try {
      // Transports en commun = estimation (1.5x le temps en voiture)
      if (mode === 'transit') {
        const result = await travelService.calculateTravelTimeWithBuffer(
          fromLocation.latitude,
          fromLocation.longitude,
          toLocation.latitude,
          toLocation.longitude,
          15
        );
        return Math.ceil((result.durationMinutesWithBuffer || result.durationMinutes) * 1.5);
      }

      // Autres modes (walking, cycling, driving)
      const result = await travelService.calculateTravelTime(
        fromLocation.latitude,
        fromLocation.longitude,
        toLocation.latitude,
        toLocation.longitude,
        mode
      );

      // Ajouter un buffer de 15%
      return Math.ceil(result.durationMinutes * 1.15);
    } catch (error) {
      console.error('Erreur calcul trajet:', error);
      // Estimation basée sur la distance
      const distance = travelService.calculateDistance(
        fromLocation.latitude,
        fromLocation.longitude,
        toLocation.latitude,
        toLocation.longitude
      );

      // Vitesses moyennes selon le mode
      const speeds = {
        walking: 5,    // 5 km/h
        cycling: 15,   // 15 km/h
        driving: 40,   // 40 km/h
        transit: 25    // 25 km/h
      };

      const speed = speeds[mode] || 40;
      return Math.ceil((distance / speed) * 60);
    }
  }

  /**
   * Retourne le label lisible du mode de transport
   */
  getModeLabel(mode) {
    const labels = {
      walking: '🚶 À pied',
      cycling: '🚲 Vélo',
      driving: '🚗 Voiture',
      transit: '🚍 Transports en commun'
    };
    return labels[mode] || mode;
  }

  /**
   * Convertit une heure "HH:MM" en minutes depuis minuit
   */
  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convertit des minutes depuis minuit en Date
   */
  minutesToDate(baseDate, minutes) {
    const date = new Date(baseDate);
    date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return date;
  }
}

export default new SlotFinderService();