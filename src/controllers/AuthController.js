import { auth, db } from '../firebase/firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

class AuthController {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authListeners = [];

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

  async register(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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

  async login(email, password) {
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
      return { success: false, message: error.message };
    }
  }

  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      this.notifyAuthListeners();
      return { success: true, message: 'La sesión fue cerrada correctamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  getCurrentUser() {
    return this.currentUser ? this._serializeUser(this.currentUser) : null;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

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

  addAuthListener(listener) {
    this.authListeners.push(listener);
  }

  removeAuthListener(listener) {
    this.authListeners = this.authListeners.filter(l => l !== listener);
  }

  notifyAuthListeners() {
    this.authListeners.forEach(listener => {
      listener({
        isAuthenticated: this.isAuthenticated,
        user: this.getCurrentUser()
      });
    });
  }

  hasPermission(permission) {
    if (!this.isAuthenticated) return false;
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

const authController = new AuthController();
export default authController;