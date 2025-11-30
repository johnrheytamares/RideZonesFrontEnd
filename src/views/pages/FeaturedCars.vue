<template>
  <section class="featured-horizontal">
    <div class="container">
      <h2>Featured Luxury Collection</h2>
      <p class="subtitle">Swipe or scroll to explore our exclusive vehicles</p>

      <!-- Loading State -->
      <div v-if="loading" class="scroll-container">
        <div class="car-card skeleton" v-for="n in 6" :key="n"></div>
      </div>

      <!-- Horizontal Scroll -->
      <div v-else class="scroll-container" ref="scrollContainer">
        <div 
          class="car-card" 
          v-for="car in displayedCars" 
          :key="car.id"
          @click="scheduleViewing(car.id)"
        >
          <img 
            :src="car.main_image || car.image || placeholder(car.make)" 
            :alt="car.make + ' ' + car.model"
            @error="e => e.target.src = placeholder(car.make)"
          />

          <div class="info">
            <h3>{{ car.make }} {{ car.model }} {{ car.variant || '' }}</h3>
            <p class="year">{{ car.year }} • {{ car.color || 'Premium' }}</p>
            <p class="price">₱{{ Number(car.price).toLocaleString() }}</p>
            
            <div class="status" :class="car.status || 'available'">
              {{ car.status === 'available' || !car.status ? 'Available' : 'Reserved' }}
            </div>
          </div>
        </div>

        <!-- Optional: Extra card to indicate more -->
        <div class="more-card" @click="$router.push('/cars-page')">
          <div class="more-content">
            <i class="fas fa-arrow-right"></i>
            <span>View All Cars</span>
          </div>
        </div>
      </div>

      <!-- Scroll Indicators (Optional pero maganda) -->
      <button class="scroll-btn left" @click="scrollLeft" :disabled="isAtStart">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="scroll-btn right" @click="scrollRight" :disabled="isAtEnd">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const displayedCars = ref([])
const loading = ref(true)
const scrollContainer = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

// MOCK DATA — Kapag offline
const mockCars = [
  { id: 9991, make: 'Lamborghini', model: 'Aventador SVJ', year: 2023, price: 48500000, color: 'Verde Mantis', main_image: 'https://images.unsplash.com/photo-1606664515524-ed1285a13abd?w=800', status: 'available' },
  { id: 9992, make: 'Rolls-Royce', model: 'Phantom VIII', year: 2024, price: 68000000, color: 'Black Diamond', main_image: 'https://images.unsplash.com/photo-1618843479313-40f8e8993988?w=800', status: 'available' },
  { id: 9993, make: 'Ferrari', model: 'SF90 Stradale', year: 2023, price: 42000000, color: 'Rosso Corsa', main_image: 'https://images.unsplash.com/photo-1556808710-89f3d7d655b4?w=800', status: 'available' },
  { id: 9994, make: 'Bentley', model: 'Continental GT', year: 2024, price: 29800000, color: 'Onyx Black', main_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', status: 'available' },
  { id: 9995, make: 'Porsche', model: '911 Turbo S', year: 2024, price: 24800000, color: 'Guards Red', main_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', status: 'available' },
  { id: 9996, make: 'Aston Martin', model: 'DB12 AMR', year: 2024, price: 32800000, color: 'Cosmic Black', main_image: 'https://images.unsplash.com/photo-1618843479313-40f8e8993988?w=800', status: 'available' },
  { id: 9997, make: 'Mercedes-Maybach', model: 'S680', year: 2024, price: 25800000, color: 'Obsidian Black', main_image: 'https://images.unsplash.com/photo-1603584173870-7f23f4d8d7f3?w=800', status: 'available' }
]

const fetchCars = async () => {
  try {
    const res = await fetch('https://ridezonesbackends-dzei.onrender.com/listcars', {
      credentials: 'include'
    })

    if (!res.ok) throw new Error('Network error')
    const data = await res.json()

    if (data.status === 'success' && data.cars?.length > 0) {
      displayedCars.value = data.cars
        .filter(car => car.status !== 'sold')
        .slice(0, 15)
    } else {
      throw new Error('No cars')
    }
  } catch (err) {
    console.warn('Using luxury mock data (offline mode)')
    displayedCars.value = mockCars
  } finally {
    loading.value = false
    await nextTick()
    checkScroll()
  }
}

const scheduleViewing = (carId) => {
  router.push(`/appointmentpage?car=${carId}`)
}

const placeholder = (make) => `https://via.placeholder.com/600x400/1a1a1a/fff?text=${encodeURIComponent(make)}`

// Smooth scroll
const scrollLeft = () => {
  scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
}
const scrollRight = () => {
  scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
}

const checkScroll = () => {
  if (!scrollContainer.value) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  isAtStart.value = scrollLeft <= 10
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 10
}

// Listen to scroll
const handleScroll = () => checkScroll()

onMounted(() => {
  fetchCars()
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
})
</script>

<!-- EXACT SAME CARD DESIGN — PERO NGAYON HORIZONTAL SCROLL! -->
<style scoped>
.featured-horizontal {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #dad9d9, #d2d1d1, #ebe9e9);
  color: #fff;
  overflow: hidden;
  position: relative;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

h2 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #333, #d40000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #555;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

/* Horizontal Scroll Container */
.scroll-container {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

/* Same Card Design */
.car-card {
  min-width: 300px;
  max-width: 300px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  padding: 1.2rem;
  border-radius: 14px;
  box-shadow: 0px 6px 18px rgba(0,0,0,0.35);
  transition: 0.35s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.car-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0px 12px 30px rgba(0,0,0,0.45);
}

.car-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.4s ease;
}

.car-card:hover img {
  transform: scale(1.08);
}

.info h3 {
  margin: 0.8rem 0 0.4rem;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
}

.year {
  font-size: 0.9rem;
  color: #ddd;
  margin-bottom: 0.5rem;
}

.price {
  color: #ff4d4d;
  font-weight: 700;
  font-size: 1.25rem;
}

.status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status.available {
  background: #00ff41;
  color: #000;
}

.status:not(.available) {
  background: #ff0033;
  color: white;
}

/* View All Card */
.more-card {
  min-width: 300px;
  max-width: 300px;
  background: linear-gradient(135deg, #d40000, #a80000);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.more-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.more-content {
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Scroll Buttons */
.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: 0.3s;
}

.scroll-btn:hover {
  background: #d40000;
}

.scroll-btn.left { left: 10px; }
.scroll-btn.right { right: 10px; }
.scroll-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
  background-size: 200% 100%;
  animation: loading 1.8s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 768px) {
  .scroll-btn { display: none; }
  h2 { font-size: 2.2rem; }
}
</style>