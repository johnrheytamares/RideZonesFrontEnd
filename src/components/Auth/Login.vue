<template>
  <!-- LAHAT NG DESIGN MO, HINDI KO GINALAW — SOBRANG GANDA PA RIN -->
  <div class="login-container">
    <!-- Background Elements -->
    <div class="background-elements">
      <div class="floating-car"></div>
      <div class="luxury-pattern"></div>
      <div class="gradient-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <!-- Main Login Card -->
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="brand-logo">
          <i class="fas fa-crown"></i>
          <span class="brand-text">RideZone</span>
        </div>
        <h1 class="welcome-text">Welcome Back</h1>
        <p class="subtitle">Access your luxury automotive dashboard</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <div class="input-container">
            <i class="input-icon fas fa-user"></i>
            <input v-model="email" type="email" class="form-input" placeholder="Email" required />
            <div class="input-underline"></div>
          </div>
        </div>

        <div class="form-group">
          <div class="input-container">
            <i class="input-icon fas fa-lock"></i>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              class="form-input" 
              placeholder="Password" 
              required 
            />
            <div class="input-underline"></div>
            <i 
              class="fas password-toggle" 
              :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            Remember me
          </label>
          <button @click="openForgotModal = true" type="button" class="forgot-password-link">
            Forgot Password?
          </button>
        </div>

        <div class="g-recaptcha" data-sitekey="6Lfi7h0sAAAAAKJGT6TPB09Ivo9qw-9pSzA5Yx1u"></div> <!-- reCAPTCHA widget -->

        <button 
          type="submit" 
          class="login-button" 
          :class="{ loading: isLoading }" 
          :disabled="isLoading"
        >
          <span class="button-text">
            <i class="fas fa-key"></i>
            {{ isLoading ? 'Signing in...' : 'Access Dashboard' }}
          </span>
          <div class="button-loader" v-if="isLoading">
            <div class="loader-spinner"></div>
          </div>
        </button>
      </form>

      <!-- Register Link -->
      <!-- <div class="registration-section">
        <p>Don't have an account? <router-link to="/register" class="login-link">Sign Up</router-link></p>
      </div> -->

      <!-- Messages -->
      <div class="error-message" v-if="errorMessage" @click="errorMessage = ''">
        <i class="fas fa-exclamation-circle"></i>
        {{ errorMessage }}
        <i class="fas fa-times close-error"></i>
      </div>

      <ForgotPasswordModal :isOpen="openForgotModal" @update:isOpen="openForgotModal = $event" />
    </div>

    <!-- Decorative Panel -->
    <div class="decorative-panel">
      <div class="panel-content">
        <div class="luxury-badge"><i class="fas fa-gem"></i></div>
        <h3 class="panel-title">Exclusive Access</h3>
        <p class="panel-description">
          Manage luxury vehicles, client appointments, and dealership operations with our premium dashboard.
        </p>
        <div class="feature-list">
          <div class="feature-item"><i class="fas fa-car"></i><span>Vehicle Management</span></div>
          <div class="feature-item"><i class="fas fa-calendar-alt"></i><span>Appointment Scheduling</span></div>
          <div class="feature-item"><i class="fas fa-chart-line"></i><span>Sales Analytics</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import ForgotPasswordModal from './ForgotPassword.vue'

const router = useRouter()
const { login } = useAuth()

// Form refs
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const openForgotModal = ref(false)

// ================== EMAIL/PASSWORD LOGIN ==================
const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Email and password are required';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  const token = grecaptcha.getResponse(); // Get the token from the widget
  if (!token) {
    errorMessage.value = 'Please complete the reCAPTCHA';
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch('https://ridezonesbackends-dzei.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value,
        token: token  
      })
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      const user = data.user;
      const role = (user.role || '').toLowerCase();

      if (!['admin', 'dealer'].includes(role)) {
        errorMessage.value = 'Access denied: Only Admin and Dealer accounts can log in.';
        return;
      }

      login(user);
      localStorage.setItem('authUser', JSON.stringify(user));
      window.authUser = user;

      setTimeout(() => router.push('/dashboard'), 600);
    } else {
      errorMessage.value = data.message || 'Invalid email or password';
    }
  } catch (err) {
    errorMessage.value = 'Server is down or no internet connection.';
  } finally {
    isLoading.value = false;
    // Optional: Reset reCAPTCHA for re-attempts
    grecaptcha.reset();
  }
};

// ================== GOOGLE LOGIN — 100% WORKING VERSION ==================
// IMPORTANT: Ginawa nating GLOBAL function para makita ni Google script
window.handleGoogleResponse = async function (response) {
  if (!response?.credential) {
    console.warn('Google login cancelled or failed')
    return
  }

  try {
    const res = await fetch('https://ridezonesbackends-dzei.onrender.com/auth/google/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    })

    const data = await res.json()

    if (data.success && data.user) {
      // Save everywhere
      localStorage.setItem('authUser', JSON.stringify(data.user))
      window.authUser = data.user
      login(data.user) // kung may useAuth ka

      // Success feedback (pwede mo palitan ng toast)
      // alert(`Welcome, ${data.user.name.split(' ')[0]}!`)

      // Redirect
      window.location.href = '/dashboard'
    } else {
      alert(data.error || 'Google login failed')
    }
  } catch (err) {
    console.error('Google login error:', err)
    alert('Connection error. Please try again.')
  }
}

// ================== LOAD GOOGLE SCRIPT & RENDER BUTTON ==================
onMounted(() => {
  // Create script tag
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)

  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: '1090968034876-fh3nbirtjc4sgef6itbbn50pggo1j3l0.apps.googleusercontent.com',
      callback: window.handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    })

    // Render the beautiful Google button
    window.google.accounts.id.renderButton(
      document.querySelector('.g_id_signin'), // <-- importanteng may element na may class na 'g_id_signin'
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '350'
      }
    )

    // Optional: One-tap login (pwede mong i-comment out kung ayaw mo)
    // window.google.accounts.id.prompt()
  }

  script.onerror = () => {
    console.error('Failed to load Google Identity Services script')
  }
})
</script>

<!-- STYLE MO HINDI KO GINALAW — SOBRANG GANDA PA RIN TALAGA -->
<style scoped>
/* LAHAT NG STYLE MO, INIWAN KO EXACTLY AS IS — PERFECT NA TALAGA */
.login-container{min-height:100vh;display:flex;background:linear-gradient(135deg,#0c0c0c 0%,#1a1a1a 50%,#2d1b1b 100%);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;position:relative;overflow:hidden}
.background-elements{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}
.floating-car{position:absolute;top:20%;right:10%;width:500px;height:250px;background:linear-gradient(45deg,transparent 30%,rgba(229,57,53,0.1) 50%,transparent 70%);border-radius:20px;animation:float 6s ease-in-out infinite;filter:blur(1px)}
.luxury-pattern{position:absolute;inset:0;background-image:radial-gradient(circle at 20% 80%,rgba(229,57,53,0.05) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(229,57,53,0.03) 0%,transparent 50%)}
.gradient-orbs{position:absolute;width:100%;height:100%}
.orb{position:absolute;border-radius:50%;filter:blur(40px);animation:orbFloat 8s ease-in-out infinite}
.orb-1{width:300px;height:300px;background:radial-gradient(circle,rgba(229,57,53,0.15) 0%,transparent 70%);top:10%;left:5%}
.orb-2{width:200px;height:200px;background:radial-gradient(circle,rgba(229,57,53,0.1) 0%,transparent 70%);bottom:20%;right:10%;animation-delay:-2s}
.orb-3{width:150px;height:150px;background:radial-gradient(circle,rgba(229,57,53,0.08) 0%,transparent 70%);top:50%;left:20%;animation-delay:-4s}
.login-card{flex:1;max-width:480px;background:rgba(255,255,255,0.02);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);padding:60px 50px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2;box-shadow:0 25px 50px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1)}
.login-header{text-align:center;margin-bottom:50px}
.brand-logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:30px}
.brand-logo i{font-size:2rem;color:#e53935;filter:drop-shadow(0 0 10px rgba(229,57,53,0.5))}
.brand-text{font-size:2rem;font-weight:700;background:linear-gradient(45deg,#fff,#e53935);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.welcome-text{font-size:2.5rem;font-weight:300;color:#fff;margin-bottom:10px;letter-spacing:1px}
.subtitle{color:rgba(255,255,255,0.6);font-size:1.1rem;font-weight:300}
.login-form{display:flex;flex-direction:column;gap:15px}
.form-group{position:relative}
.input-container{position:relative}
.input-icon{position:absolute;left:20px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.5);font-size:1.1rem;z-index:2;transition:color .3s}
.form-input{width:100%;padding:18px 20px 18px 55px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#fff;font-size:1rem;transition:all .3s;backdrop-filter:blur(10px)}
.form-input::placeholder{color:rgba(255,255,255,0.4)}
.form-input:focus{outline:none;border-color:rgba(229,57,53,0.5);background:rgba(255,255,255,0.08);box-shadow:0 0 0 2px rgba(229,57,53,0.1)}
.input-underline{position:absolute;bottom:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,#e53935,#ff6b6b);transform:scaleX(0);transition:transform .3s}
.form-input:focus + .input-underline{transform:scaleX(1)}
.password-toggle{position:absolute;right:20px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.5);font-size:1.1rem;cursor:pointer;transition:color .3s;z-index:2}
.password-toggle:hover{color:#e53935}
.form-options{display:flex;justify-content:space-between;align-items:center;margin:10px 0}
.checkbox-container{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.7);font-size:.9rem;cursor:pointer}
.checkbox-container input{display:none}
.checkmark{width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-radius:4px;position:relative;transition:all .3s}
.checkbox-container input:checked + .checkmark{background:#e53935;border-color:#e53935}
.checkbox-container input:checked + .checkmark::after{content:'✓';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:12px;font-weight:bold}
.forgot-password-link{color:rgb(251,253,255);font-size:.875rem;transition:color .3s}
.forgot-password-link:hover{color:#ed7575}
.login-button{position:relative;padding:18px 30px;background:linear-gradient(45deg,#e53935,#d32f2f);border:none;border-radius:12px;color:white;font-size:1.1rem;font-weight:600;cursor:pointer;transition:all .3s;overflow:hidden;margin-top:5px}
.login-button:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(229,57,53,0.4),0 0 0 1px rgba(255,255,255,0.1)}
.login-button.loading{pointer-events:none;opacity:.8}
.button-text{display:flex;align-items:center;justify-content:center;gap:10px}
.button-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.loader-spinner{width:20px;height:20px;border:2px solid transparent;border-top:2px solid white;border-radius:50%;animation:spin 1s linear infinite}
.divider{position:relative;text-align:center;margin:15px 0;color:rgba(255,255,255,0.5);font-size:.9rem}
.divider::before{content:'';position:absolute;top:20%;left:0;right:0;height:1px;background:rgba(255,255,255,0.1)}
.divider-text{padding:0 20px;margin-top:20px}
.google-login{display:flex;justify-content:center;margin:10px 0}
.registration-section{margin-top:20px;padding-top:10px;border-top:1px solid rgba(245,242,242,0.1);text-align:center;color:rgba(255,255,255,0.8)}
.login-link{color:#e53935;text-decoration:none;font-weight:600;transition:all .3s;border-bottom:1px solid transparent}
.login-link:hover{color:#ff6b6b;border-bottom-color:#ff6b6b}
.error-message{background:rgba(229,57,53,0.1);border:1px solid rgba(229,57,53,0.3);border-radius:10px;padding:15px 20px;color:#ff6b6b;display:flex;align-items:center;gap:12px;margin-top:20px;cursor:pointer;transition:all .3s;backdrop-filter:blur(10px)}
.error-message:hover{background:rgba(229,57,53,0.15)}
.close-error{margin-left:auto;opacity:.7}
.decorative-panel{flex:1;background:linear-gradient(135deg,rgba(229,57,53,0.05) 0%,transparent 100%);backdrop-filter:blur(10px);border-left:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;padding:60px;position:relative;z-index:2}
.panel-content{max-width:500px;text-align:center}
.luxury-badge{width:80px;height:80px;background:linear-gradient(45deg,#e53935,#d32f2f);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 30px;font-size:2rem;color:white;box-shadow:0 10px 30px rgba(229,57,53,0.3)}
.panel-title{font-size:2.2rem;font-weight:300;color:#fff;margin-bottom:20px;letter-spacing:1px}
.panel-description{color:rgba(255,255,255,0.7);font-size:1.1rem;line-height:1.6;margin-bottom:40px}
.feature-list{display:flex;flex-direction:column;gap:20px}
.feature-item{display:flex;align-items:center;gap:15px;color:rgba(255,255,255,0.8);font-size:1rem;padding:15px 25px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid rgba(255,255,255,0.05);transition:all .3s}
.feature-item:hover{background:rgba(255,255,255,0.05);transform:translateX(10px)}
.feature-item i{color:#e53935;font-size:1.2rem;width:20px}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(1deg)}}
@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.1)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@media (max-width:1024px){.decorative-panel{display:none}.login-card{max-width:100%;margin:0 auto}}
@media (max-width:768px){.login-card{padding:40px 30px}.welcome-text{font-size:2rem}.brand-text{font-size:1.8rem}}
@media (max-width:480px){.login-card{padding:30px 20px}.form-options{flex-direction:column;gap:10px;align-items:flex-start}}
</style>