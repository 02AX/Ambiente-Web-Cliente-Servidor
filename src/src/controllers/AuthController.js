import { autenticarUsuario } from '../models/demoData.js';
import { Usuario } from '../models/Usuario.js';
import { auth, db } from '../firebase/firebaseConfig.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const USUARIO_DEMO = { email: 'demo@example.com', password: '123456' };

const listeners = [];

const notifyAuthChange = (user) => {
  listeners.forEach(fn => fn ({
    isAuthenticated: !!user,
    user: user ? { uid: user.uid, email: user.email } : null
  }));
};


class AuthController {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authListeners = [];

    // Escuchar cambios de estado de autenticación
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(this._serializeUser(user)));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }
      this.notifyAuthListeners();
    });
  }

  _serializeUser(user){
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
    };
  }

  // Método para registrar usuario
  async register(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar username u otros datos en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        username,
        createdAt: new Date()
      });

      return { success: true, user: this._serializeUser(user) };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Método para iniciar sesión
  async login(email, password) {

     if (email === USUARIO_DEMO.email && password === USUARIO_DEMO.password) {
      this.currentUser = USUARIO_DEMO;
      this.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(this._serializeUser(this.currentUser)));
      localStorage.setItem('isAuthenticated', 'true');
      this.notifyAuthListeners();

      return {
        success: true,
        message: 'Inicio de sesión demo exitoso',
        user: this._serializeUser(this.currentUser),
      };
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.currentUser = userCredential.user;
      this.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(this._serializeUser(this.currentUser)));
      localStorage.setItem('isAuthenticated', 'true');
      this.notifyAuthListeners();

      return{
        success: true,
        message: 'El inicio de sesión fue exitoso',
        user: this._serializeUser(this.currentUser),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Método para cerrar sesión
  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      this.notifyAuthListeners();

      return {
        success: true,
        message: 'La sesión fue cerrada correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Método para obtener el usuario actual
  getCurrentUser() {
    return this.currentUser ? this._serializeUser(this.currentUser) : null;
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
        this.currentUser = JSON.parse(storedUser);
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
        user: this.getCurrentUser()
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
}

// Crear instancia única del controlador (Singleton)
const authController = new AuthController();

export default authController;
