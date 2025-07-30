import { autenticarUsuario } from '../models/demoData.js';
import { Usuario } from '../models/Usuario.js';

class AuthController {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authListeners = [];
  }

  // Método para iniciar sesión
  login(username, password) {
    try {
      const user = autenticarUsuario(username, password);
      
      if (user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Notificar a los listeners
        this.notifyAuthListeners();
        
        return {
          success: true,
          message: 'Inicio de sesión exitoso',
          user: user
        };
      } else {
        return {
          success: false,
          message: 'Usuario o contraseña incorrectos'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error en el inicio de sesión'
      };
    }
  }

  // Método para cerrar sesión
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Remover de localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    
    // Notificar a los listeners
    this.notifyAuthListeners();
    
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
  }

  // Método para obtener el usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Método para verificar si el usuario está autenticado
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  // Método para restaurar sesión desde localStorage
  restoreSession() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedAuth = localStorage.getItem('isAuthenticated');
      
      if (storedUser && storedAuth === 'true') {
        const userData = JSON.parse(storedUser);
        // Reconstruct the Usuario instance from the parsed data
        this.currentUser = new Usuario(userData);
        this.isAuthenticated = true;
        this.notifyAuthListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
      return false;
    }
  }

  // Método para agregar listeners de cambios de autenticación
  addAuthListener(listener) {
    this.authListeners.push(listener);
  }

  // Método para remover listeners
  removeAuthListener(listener) {
    this.authListeners = this.authListeners.filter(l => l !== listener);
  }

  // Método para notificar cambios de autenticación
  notifyAuthListeners() {
    this.authListeners.forEach(listener => {
      listener({
        isAuthenticated: this.isAuthenticated,
        user: this.currentUser
      });
    });
  }

  // Método para verificar permisos
  hasPermission(permission) {
    if (!this.isAuthenticated) return false;
    
    // Por ahora todos los usuarios autenticados tienen los mismos permisos
    const permissions = [
      'create_denuncia',
      'comment',
      'like',
      'view_profile',
      'edit_profile'
    ];
    
    return permissions.includes(permission);
  }

  // Método para obtener estadísticas del usuario
  getUserStats() {
    if (!this.isAuthenticated || !this.currentUser) {
      return null;
    }
    
    return this.currentUser.getEstadisticas();
  }

  // Método para actualizar configuraciones del usuario
  updateUserSettings(newSettings) {
    if (!this.isAuthenticated || !this.currentUser) {
      return {
        success: false,
        message: 'Usuario no autenticado'
      };
    }
    
    try {
      this.currentUser.actualizarConfiguraciones(newSettings);
      
      // Actualizar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      return {
        success: true,
        message: 'Configuraciones actualizadas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar configuraciones'
      };
    }
  }

  // Método para verificar si el usuario puede realizar una acción
  canPerformAction(action) {
    if (!this.isAuthenticated) return false;
    
    const allowedActions = {
      'create_denuncia': true,
      'like_denuncia': true,
      'comment': true,
      'view_denuncias': true,
      'view_ranking': true,
      'view_community': true,
      'view_profile': true,
      'edit_profile': true
    };
    
    return allowedActions[action] || false;
  }

  // Método para obtener el nombre mostrable del usuario
  getDisplayName() {
    if (!this.isAuthenticated || !this.currentUser) {
      return 'Usuario Anónimo';
    }
    
    return this.currentUser.getDisplayName();
  }

  // Método para validar datos de registro (para futuras implementaciones)
  validateRegistrationData(userData) {
    const errors = [];
    
    if (!userData.username || userData.username.length < 3) {
      errors.push('El nombre de usuario debe tener al menos 3 caracteres');
    }
    
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Email inválido');
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    return errors;
  }

  // Método para validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Crear instancia única del controlador (Singleton)
const authController = new AuthController();

export default authController; 