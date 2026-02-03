// src/services/travelService.js
// Utilise OSRM (Open Source Routing Machine) - 100% GRATUIT
import axios from 'axios';

class TravelService {
  constructor() {
    this.osrmBaseUrl = 'https://router.project-osrm.org/route/v1';
  }

  /**
   * Calcule le temps de trajet entre deux points GPS
   * @param {number} originLat - Latitude d'origine
   * @param {number} originLng - Longitude d'origine
   * @param {number} destLat - Latitude de destination
   * @param {number} destLng - Longitude de destination
   * @param {string} mode - Mode de transport ('driving', 'walking', 'cycling')
   * @returns {Object} { durationMinutes, distance, durationText }
   */
  async calculateTravelTime(originLat, originLng, destLat, destLng, mode = 'driving') {
    try {
      // OSRM utilise le format : longitude,latitude (pas latitude,longitude !)
      const url = `${this.osrmBaseUrl}/${mode}/${originLng},${originLat};${destLng},${destLat}`;
      const params = {
        overview: false,
        alternatives: false,
        steps: false
      };

      const response = await axios.get(url, { params });

      if (response.data.code === 'Ok' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const durationMinutes = Math.ceil(route.duration / 60);
        const distanceKm = (route.distance / 1000).toFixed(1);

        return {
          durationMinutes: durationMinutes,
          distance: route.distance, // en mètres
          distanceKm: distanceKm,
          durationText: this.formatDuration(durationMinutes),
          distanceText: `${distanceKm} km`,
          success: true
        };
      } else {
        console.warn('OSRM : Pas de route trouvée');
        return this.getFallbackEstimate(originLat, originLng, destLat, destLng);
      }

    } catch (error) {
      console.error('Erreur OSRM:', error.message);
      return this.getFallbackEstimate(originLat, originLng, destLat, destLng);
    }
  }

  /**
   * Calcule le temps de trajet pour les transports en commun
   * Note : OSRM ne gère pas les transports en commun directement
   * On utilise donc le mode "driving" et on ajoute un facteur de correction
   */
  async calculatePublicTransportTime(originLat, originLng, destLat, destLng) {
    const drivingResult = await this.calculateTravelTime(originLat, originLng, destLat, destLng, 'driving');

    if (drivingResult.success) {
      // Estimation : transports en commun = 1.5x le temps en voiture
      const publicTransportMinutes = Math.ceil(drivingResult.durationMinutes * 1.5);

      return {
        ...drivingResult,
        durationMinutes: publicTransportMinutes,
        durationText: this.formatDuration(publicTransportMinutes),
        mode: 'transit (estimé)'
      };
    }

    return drivingResult;
  }

  /**
   * Estimation de secours basée sur la distance à vol d'oiseau
   * Utilisée quand OSRM échoue
   */
  getFallbackEstimate(originLat, originLng, destLat, destLng) {
    const distance = this.calculateDistance(originLat, originLng, destLat, destLng);
    const distanceKm = distance.toFixed(1);

    // Estimation : 40 km/h de moyenne en ville
    const estimatedMinutes = Math.ceil((distance / 40) * 60);

    return {
      durationMinutes: estimatedMinutes,
      distance: distance * 1000, // conversion en mètres
      distanceKm: distanceKm,
      durationText: `${estimatedMinutes} min (estimé)`,
      distanceText: `${distanceKm} km`,
      success: false,
      estimated: true
    };
  }

  /**
   * Calcule la distance à vol d'oiseau entre deux points GPS (formule de Haversine)
   * @returns {number} Distance en kilomètres
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  /**
   * Convertit des degrés en radians
   */
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Formate une durée en minutes en texte lisible
   */
  formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (mins === 0) {
        return `${hours}h`;
      }
      return `${hours}h${mins}`;
    }
  }

  /**
   * Calcule le temps de trajet avec un buffer (marge de sécurité)
   */
  async calculateTravelTimeWithBuffer(originLat, originLng, destLat, destLng, bufferPercent = 20) {
    const result = await this.calculateTravelTime(originLat, originLng, destLat, destLng);

    const bufferMinutes = Math.ceil(result.durationMinutes * (bufferPercent / 100));
    const totalMinutes = result.durationMinutes + bufferMinutes;

    return {
      ...result,
      durationMinutesWithBuffer: totalMinutes,
      bufferMinutes: bufferMinutes,
      durationTextWithBuffer: this.formatDuration(totalMinutes)
    };
  }

  /**
   * Vérifie si OSRM est accessible
   */
  async checkServiceAvailability() {
    try {
      const response = await axios.get(`${this.osrmBaseUrl}/driving/2.3522,48.8566;2.2945,48.8584`, {
        timeout: 5000
      });
      return response.data.code === 'Ok';
    } catch (error) {
      console.error('OSRM non disponible:', error.message);
      return false;
    }
  }
}

export default new TravelService();